const express = require("express");
const { fetchOrderByUser, createOrder, deleteOrder, updateOrder } = require("../controller/Order");

const router = express.Router();

router.get("/", fetchOrderByUser).post("/", createOrder).delete("/:id", deleteOrder).patch("/:id", updateOrder);

exports.router = router;