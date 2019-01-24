const mongoose = require('mongoose');

const studentProfile = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    St_id: mongoose.Schema.Types.ObjectId,
    Full_name: { type: String, required: true },
    room: { type: String, default: "000" },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    },
    hostel: mongoose.Schema.Types.ObjectId,
    gender: { type: String, required: true }
});

module.exports = mongoose.model('SProfile', studentProfile);