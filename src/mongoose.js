const mongoose = require('mongoose');

const dbString = 'mongodb://localhost:27017/session-db';
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(dbString, dbOptions)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const connection = mongoose.connection;

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});


const userModel = connection.model('User', userSchema);

module.exports = connection;
