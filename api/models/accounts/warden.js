const mongoose = require('mongoose');

const wardenSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    _wid:mongoose.Schema.Types.ObjectId,
    fullname:{type: String,required:true},
    phone:{type: String,required:true},
    hostel:mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('warden', wardenSchema);