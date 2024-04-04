const drinkPriceService = require("../services/drinkPriceService");

const getDrinkPrices = (req, res) => {
    drinkPriceService
        .getDrinkPrices()
        .then((drinkPrices) => {
            res.status(200).json(drinkPrices);
        })
        .catch((err) => {
            res.status(500).send("Internal Server Error");
        });
};

const addDrinkPrice = async (req, res) => {
    const drinkPrice = req.body;
    try {
        await drinkPriceService.addDrinkPrices(drinkPrice);
        console.log("Drink price added");
        res.status(201).send("Drink price added");
    } catch (error) {
        console.error("Error adding drink price:", error);
        res.status(500).send(error.message);
    }
};

module.exports = {
    getDrinkPrices,
    addDrinkPrice,
};
