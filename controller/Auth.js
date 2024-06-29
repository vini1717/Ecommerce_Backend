const { User } = require("../model/User");

exports.createUser = async (req,res) => {
    const user = new User(req.body);

    try{
        const doc = await user.save();
        res.status(201).json(doc);
    }
    catch(err)
    {
        res.status(400).json(err);
    }  
}

exports.loginUser = async (req,res) => {

    try{
        const user = await User.findOne({email: req.body.email}).exec();
        console.log(user);
        if(!user)
        {
            res.status(401).json({message: "No such user email exists"})
        }
        else if(user.password === req.body.password)
        {
            res.status(201).json({id: user.id, email: user.email, addresses: user.addresses});
        }
        else{
            res.status(401).json({message: "Invalid Credentials"});
        }
    }
    catch(err)
    {
        res.status(400).json(err);
    }
}