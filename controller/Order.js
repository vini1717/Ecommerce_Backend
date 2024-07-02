const { Order } = require("../model/Order");

exports.fetchOrderByUser = async (req,res) => {
   const {userId} = req.params;
    try{
        // console.log(user)
        const orders = await Order.find({user: userId});
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

exports.fetchAllOrders = async (req,res) =>{
    let query = Order.find({deleted: {$ne:true}});
    let totalOrders = Order.find({deleted: {$ne:true}});

    
        if(req.query._sort && req.query._order)
    {
        query = query.sort({[req.query._sort]: req.query._order});
        totalOrders = totalOrders.sort({[req.query._sort] : req.query._order});
    }
    const totalItems = await totalOrders.count().exec();

    if(req.query._page && req.query._per_page)
    {
        const pageNo = req.query._page;
        const pagelimit = req.query._per_page;
        query = query.skip(pagelimit*(pageNo-1)).limit(pagelimit);
    }
    try{
    const docs = await query.exec();
    res.status(200).json({data: docs, items: totalItems});
    }
    catch(err)
    {
        res.status(400).json(err);
    }
    
    
}