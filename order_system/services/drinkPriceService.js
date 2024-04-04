const databaseAccess = require("../DatabaseAccess/databaseAccess");

function getDrinkPrices() {
    const sql = `
        SELECT
            d.cycle_id,
            d.drink_id,
            d.price,
            d.time
        FROM
            drink_prices d
        ORDER BY
            d.drink_id,
            d.cycle_id;
    `;

    return databaseAccess
        .read(sql)
        .then((drinks) => {
            console.log("read drink prices from database");
            return drinks;
        })
        .catch((err) => {
            throw err;
        });
}

async function addDrinkPrices(cycle_id, drinks) {
    const db = databaseAccess.connect(); // Establish the connection once for the transaction

    try {
        // Start the transaction
        await databaseAccess.write("BEGIN TRANSACTION;", [], db);

        for (let i = 0; i < drinks.length; i++) {
            const drink = drinks[i];

            if (drink.name.includes("0.3")) {
                continue
            }

            // Insert the new drink price
            const drinkPriceInsertSql =
                "INSERT INTO drink_prices (cycle_id, drink_id, price) VALUES (?, ?, ?);";
            await databaseAccess.write(
                drinkPriceInsertSql,
                [cycle_id, drink.id, drink.price],
                db
            );
        }

        // Commit the transaction if all goes well
        await databaseAccess.write("COMMIT;", [], db);
    } catch (error) {
        // Rollback the transaction if an error occurred
        await databaseAccess.write("ROLLBACK;", [], db);
        throw error;
    } finally {
        console.log("Transaction complete");
        // Ensure the database connection is closed
        if (db) {
            db.close();
        }
    }
}

module.exports = {
    getDrinkPrices,
    addDrinkPrices,
};
