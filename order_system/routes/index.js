const express = require("express");
const router = express.Router();
const controller = require('../controllers/exampleController');
const drinkController = require('../controllers/drinkController');
const drinkPriceController = require('../controllers/drinkPriceController');
const orderController = require('../controllers/orderController');

// Example routes
router.get("/example", controller.getExample);

// Drink routes
router.get("/drinks", drinkController.getAllDrinks);
router.get("/drinks/:id", drinkController.getDrinkById);
router.post("/drinks", drinkController.addDrink);

// Order routes
router.get("/orders", orderController.getAllOrders);
router.post("/orders", orderController.createOrder);
router.get("/profitOrLoss", orderController.getProfitOrLoss);

// Drink price routes
router.get("/drinkPrices", drinkPriceController.getDrinkPrices);

module.exports = router;
