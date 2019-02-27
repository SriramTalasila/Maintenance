const mongoose = require('mongoose');

const hostelSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type : String, required:true},
    location:{type: String,required:true},
    hstltype:{type: String,required:true}
});

module.exports = mongoose.model('hostel', hostelSchema);