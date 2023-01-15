const User = require("../schema/user.schema");
const { findUser } = require('../services/jobServices')

const bcrypt = require('bcrypt')

const verifyUser = async (req, res, next) => {
    try {
        console.log('auth', req.headers)
        let {email, password} = req.headers;
        console.log("emailpassword", email, password)
        if(!email && !password){
            throw new Error("Input Error")
        }
        const userData = await findUser(email);
        console.log(userData)
        let flag = false;
        if(userData){
            flag = bcrypt.compareSync(password, userData.password);
        }
        if(!flag){
            throw new Error()
        }
        next();
    } catch (error) {
        console.log("error", error.message)
        return res.status(401).json({
            status: true,
            body: 'Invalide email and password'
        });
    }
  };



  module.exports = {
    verifyUser
  }