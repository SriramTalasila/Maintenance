const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    _sid:mongoose.Schema.Types.ObjectId,
    fullname:{type: String,required:true},
    rollno:{type: String,required:true},
    phone:{type: String,required:true},
    gender: String,
    college:mongoose.Schema.Types.ObjectId,
    hostel:mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('student', studentSchema);