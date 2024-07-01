const { Order } = require("../model/Order");

exports.fetchOrderByUser = async (req,res) => {
   const {user} = req.query;
    try{
        // console.log(user)
        const orders = await Order.find({user: user});
        res.status(200).json(orders);
    }
    catch(err)
    {
        console.log(err);
        res.status(400).json(err);
    }  
}

exports.createOrder = async (req,res) => {
    const order = new Order(req.body);
    // console.log(req.body)
    try{
        const doc = await order.save();
        // const result = await doc.populate('product');
        // console.log(result);
        res.status(201).json(doc);
    }
    catch(err)
    {
        res.status(400).json(err);
    }  
}

exports.updateOrder = async (req,res) => {
    const {id} = req.params;

    try{
        const cart = await Order.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json(cart);
    }
    catch(err)
    {
        res.status(400).json(err);
    }  
}

exports.deleteOrder = async (req,res) => {
    const {id} = req.params;

    try{
        const doc = await Order.findByIdAndDelete(id);
        res.status(200).json(doc);
    }
    catch(err)
    {
        res.status(400).json(err);
    }  
}