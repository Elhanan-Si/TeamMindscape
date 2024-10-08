const mongoose = require('mongoose');

const connectdb = () => {
    mongoose.connect('mongodb://localhost:27017/TeamMindscape')
    .then(() => console.log('DB connected'))
    .catch(console.error);
}

module.exports = connectdb;