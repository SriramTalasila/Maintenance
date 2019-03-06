const Nexmo = require('nexmo');

exports.send_sms = (dataTosend) => {
    const nexmo = new Nexmo({
        apiKey: '05de01be',
        apiSecret: 'de19912d26e10c59'
    })
    console.log(dataTosend.phone);
    const from = 'Maintenance';
    const to = dataTosend.phone;
    const text = dataTosend.text

    nexmo.message.sendSms(from, to, text)
}