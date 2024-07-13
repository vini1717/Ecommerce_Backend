const { sanitizeUser } = require("../Services/Common");
const { User } = require("../model/User");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const secret = 'SECRET_KEY';
exports.createUser = async (req,res) => {
    try{
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 31000,32,'sha256', async function(err,hashedPassword){
            const user = new User({...req.body,password: hashedPassword, salt});

            const doc = await user.save();
            req.login(doc,function(err){
                if(err)
                    res.status(400).json(err);
                const token = jwt.sign(sanitizeUser(doc),secret)
                res.status(201).json(token);
            })
            
        })
    }
    catch(err)
    {
        res.status(400).json(err);
    }  
}

exports.loginUser = async (req,res) => {

    // console.log(req.user)
    res.json(req.user);

}
exports.checkUser = async (req,res) => {

    // console.log(req.user)
    res.json(req.user);

}