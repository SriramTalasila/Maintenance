const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    email:{type : String, required:true},
    username:{type: String,required:true},
    password:{type: String,required:true},
    isAdmin:{type: Boolean},
    isStaff : {type: Boolean}
});

module.exports = mongoose.model('User', userSchema);