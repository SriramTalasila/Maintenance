const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sid: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    ondate: { type: Date, default: Date.now },
    description: { type: String, required: true },
    location: { type: String, required: true },
    section: mongoose.Schema.Types.ObjectId,
    hostel: mongoose.Schema.Types.ObjectId,
    status: { type: String, required: true },
    technician: { type: mongoose.Schema.Types.ObjectId, default: null },
    isClosed: { type: Boolean, default: false },
    feedback:{ type: String, default:"" },
    stufeedback:{ type: String, default:"" },
    closedon: { type: Date }
});

module.exports = mongoose.model('complaint', complaintSchema);