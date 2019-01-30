const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require('../../models/accounts/user')

exports.st_create = (userData,callback)=>{
    const newUser = new User({
        _id:new mongoose.Types.ObjectId(),
        email:"ram98.sri98@gmail.com",
        username:"admin",
        password:"12345678",
        isAdmin:true,
        isStaff:false
    });
    newUser.save().then(result =>{
        console.log(result);
    })
    .catch(err=>{
        console.log(err);
    })
    callback(null,'success');
}