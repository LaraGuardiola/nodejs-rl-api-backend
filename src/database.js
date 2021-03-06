import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()

const uri = `mongodb+srv://webdevslara:${process.env.PASSWORD}@cluster0.oca5c.mongodb.net/api-db?retryWrites=true&w=majority`;
mongoose.connect(uri, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
    .then(db => console.log('db is connected'))
    .catch(err => console.error(err))