const mongoose = require('mongoose');

require('dotenv').config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log('Db connected Successfully!');
    }).catch((err) => {
        console.log("Db connection issue",err);
    });
}
