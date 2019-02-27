const mongoose = require('mongoose');

const collegeSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type : String, required:true}
});

module.exports = mongoose.model('college', collegeSchema);