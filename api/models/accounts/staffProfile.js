const mongoose = require('mongoose');

const staffSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    _staffid:mongoose.Schema.Types.ObjectId,
    fullname:{type: String,required:true},
    phone:{type: String,required:true},
    section:mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('staff', staffSchema);