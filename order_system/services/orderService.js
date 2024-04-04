// services/orderService.js

const { or } = require("sequelize");
const databaseAccess = require("../DatabaseAccess/databaseAccess");
const cycleService = require("./cycleService");

const getOrders = () => {
  const sql =
    "SELECT \n" +
    "    o.id AS order_id, \n" +
    "    o.createCycle, \n" +
    "    o.created_at, \n" +
    "    d.name AS drink_name, \n" +
    "    oi.quantity\n" +
    "FROM \n" +
    "    orders o\n" +
    "INNER JOIN \n" +
    "    order_items oi ON o.id = oi.order_id\n" +
    "INNER JOIN \n" +
    "    drinks d ON oi.drink_id = d.id\n" +
    "ORDER BY \n" +
    "    o.id, d.name;\n";
  return databaseAccess
    .read(sql)
    .then((orders) => {
      console.log("read orders from database");
      return orders;
    })
    .catch((err) => {
      throw err;
    });
};

const getItemOrders = () => {
  const sql =
    "SELECT \n" +
    "oi.id AS order_item_id,\n" +
    "oi.order_id,\n" +
    "oi.drink_id, \n" +
    "oi.quantity, \n" +
    "oi.itemPrice AS price_per_item, \n" +
    "d.name AS drink_name, \n" +
    "d.drinkGroupId AS drink_droup_id, \n" +
    "o.created_at AS order_created_at \n" +
    "FROM order_items oi \n" +
    "JOIN drinks d ON oi.drink_id = d.id \n" +
    "JOIN orders o ON oi.order_id = o.id \n" +
    "ORDER BY oi.id; \n";
  return databaseAccess
    .read(sql)
    .then((orders) => {
      console.log("read orders from database");
      return orders;
    })
    .catch((err) => {
      throw err;
    });
};

const DrinkGroups = {
  ANTI_ALKOHOL: 1,
  LONG_DRINK: 2,
  SHOTS: 3,
  BIER_UND_WEIN: 4,
};

function getDrinkNormalizePrice(drinkName, drinkGroupId) {
  if (drinkGroupId == DrinkGroups.LONG_DRINK) {
    if (drinkName.includes("0.3")) {
      return 4.0;
    } else {
      return 6.0;
    }
  }
  if (drinkGroupId == DrinkGroups.BIER_UND_WEIN) {
    if (drinkName.includes("0.3")) {
      return 3.0;
    } else {
      return 4.0;
    }
  }
  if (drinkGroupId == DrinkGroups.SHOTS) {
    if (drinkName.includes("Frucht")) {
      return 0.1;
    } else {
      return 2.5;
    }
  }
  return 0;
}

async function getProfitOrLoss() {
  try {
    const itemOrders = await getItemOrders(); // Rufe die Bestellungen ab
    let summedPrice = 0.0;
    itemOrders.forEach((order) => {
      const profit =
        order.price_per_item -
        getDrinkNormalizePrice(order.drink_name, order.drink_group_id);
      const totalPrice = order.quantity * profit;
      summedPrice += totalPrice;
    });
    return summedPrice;
    // Führe weitere Schritte aus, wenn nötig...
  } catch (err) {
    console.error("Error processing item orders:", err);
  }
}

async function placeOrder(orderDetails) {
  if (!orderDetails.drinks) {
    throw new Error("No drinks in order");
  }
  var orderItems = orderDetails.drinks;
  const db = databaseAccess.connect(); // Establish the connection once for the transaction

  try {
    // Start the transaction
    await databaseAccess.write("BEGIN TRANSACTION;", [], db);

    // Insert the new order and retrieve the order id
    const orderInsertSql = "INSERT INTO orders (createCycle) VALUES (?);";
    const orderResult = await databaseAccess.write(
      orderInsertSql,
      [cycleService.getCycle()],
      db
    );
    const orderId = orderResult.lastID;

    console.log("orderItems: ", orderItems);
    console.log("in cycle: ", cycleService.getCycle());

    // Insert order items using the orderId
    const orderItemInsertSql =
      "INSERT INTO order_items (order_id, drink_id, quantity, itemPrice) VALUES (?, ?, ?, ?);";
    for (const item of orderItems) {
      await databaseAccess.write(
        orderItemInsertSql,
        [orderId, item.id, item.quantity, item.price],
        db
      );
    }

    // Commit the transaction if all goes well
    await databaseAccess.write("COMMIT;", [], db);
  } catch (error) {
    // Rollback the transaction in case of an error
    console.error(
      "An error occurred during the transaction, rolling back:",
      error
    );
    await databaseAccess.write("ROLLBACK;", [], db);
    throw error; // Propagate the error
  } finally {
    console.log("Transaction complete");
    // Ensure the database connection is closed
    if (db) {
      db.close();
    }
  }
}

const getDrinkOrdersByCycle = (createCycle) => {
  const sql = `
        SELECT 
            d.id AS drink_id, 
            d.name AS drink_name, 
            SUM(oi.quantity) AS total_ordered
        FROM 
            drinks d
        JOIN 
            order_items oi ON d.id = oi.drink_id
        JOIN 
            orders o ON oi.order_id = o.id
        WHERE 
            o.createCycle = ?
        GROUP BY 
            d.id, d.name
        ORDER BY 
            total_ordered DESC;
    `;

  return databaseAccess.read(sql, [createCycle]);
};

module.exports = {
  getOrders,
  placeOrder,
  getDrinkOrdersByCycle,
  getProfitOrLoss,
};
