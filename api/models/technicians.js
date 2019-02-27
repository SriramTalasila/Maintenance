const mongoose = require('mongoose');

const technicianSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type : String, required:true},
    phone:{type : String, required:true},
    section:mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Technician', technicianSchema);