const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user_id:mongoose.Schema.Types.ObjectId,
    otp:{type: Number,required:true}
})

module.exports = mongoose.model('otp',otpSchema);
