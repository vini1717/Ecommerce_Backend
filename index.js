const express = require("express");
const mongoose = require("mongoose");
const { User } = require("./model/User");
const { createProduct } = require("./controller/Product");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const productsRouter = require("./routes/Products");
const brandRouter = require("./routes/Brands");
const categoryRouter = require("./routes/Categories")
const userRouter = require("./routes/Users")
const authRouter = require("./routes/Auth")
const cartRouter = require("./routes/Cart")
const orderRouter = require("./routes/Order")
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const server = express();
const { isAuth, sanitizeUser } = require("./Services/Common");
const crypto = require('crypto');

const secret = 'SECRET_KEY';

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret ;



server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

server.use(passport.authenticate('session'))

const cors = require('cors');

server.use(cors())
server.use(express.json());
server.use("/products", isAuth(), productsRouter.router);
server.use("/brands", isAuth(), brandRouter.router);
server.use("/categories", isAuth(), categoryRouter.router);
server.use("/users", isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderRouter.router);


passport.use('local', new LocalStrategy(
    {usernameField: 'email'},
   async function(email,password,done){
        try{
            const user = await User.findOne({email: email}).exec();
            if(!user)
            {
               return done(null, false, {message: "No such user email exists"});
            }
            crypto.pbkdf2(password,user.salt,31000,32,'sha256', function(err, hashedPassword)
            {
                if(crypto.timingSafeEqual(user.password, hashedPassword))
                {
                    const token = jwt.sign(sanitizeUser(user), secret)
                    return done(null, token)
                    // res.status(201).json({id: user.id, email: user.email, addresses: user.addresses, role: user.role });
                }
                else{
                   return done(null,false, {message: 'Invalid Credentials'})
                    // res.status(401).json({message: "Invalid Credentials"});
                }
            })
            // console.log(user);
            
        }
        catch(err)
        {
            done(err)
        }
    }
))

passport.use('jwt', new JwtStrategy(opts, async function(jwt_payload,done){
    try{
        console.log("JWT TOKEN : ", {jwt_payload});
        const user = await User.findOne({_id:jwt_payload.id});
        console.log(user);
        if(!user)
            return done(null,false,{message: 'No Such User Found'})
        if(user)
            return done(null,sanitizeUser(user))
        }
    catch(err)
    {
        return done(err,false,{message: err})
    }
    

}) )

passport.serializeUser(function (user,cb){
    console.log("SerializeUser: ", user)
    process.nextTick(function(){
        return cb(null,sanitizeUser(user))
    })
})

passport.deserializeUser(function(user,cb){
    console.log("deserializeUser: ", user)
    process.nextTick(function(){
        return cb(null,sanitizeUser(user));
    })
})
main().catch(err => console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
    console.log("database connected")
}

server.get("/", (req,res)=>{
    res.json({status: "Success"})
})



server.listen(8080, ()=>{
    console.log("Server Started");
})