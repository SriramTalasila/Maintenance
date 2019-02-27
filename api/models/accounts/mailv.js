const mongoose = require('mongoose');

const verifySchema = mongoose.Schema({
    uid:mongoose.Schema.Types.ObjectId,
    vt:{type: String,required:true}
})

module.exports = mongoose.model('verifytoken',verifySchema);
