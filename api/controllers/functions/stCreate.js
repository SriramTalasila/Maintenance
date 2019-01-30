const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

exports.st_create = (userData,callback)=>{
    console.log(userData);
    callback(null,'success');
}