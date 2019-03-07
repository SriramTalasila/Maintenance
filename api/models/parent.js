const mongoose = require('mongoose');

const parentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    _sid: mongoose.Schema.Types.ObjectId,
    srollNo: { type: String, required: true },
    fullname: { type: String, required: true },
    relation: { type: String, required: true },
    email: { type: String },
    photo: { type: String },
    phone: { type: String, required: true }
});

module.exports = mongoose.model('parent', parentSchema);