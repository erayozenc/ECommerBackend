const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Import Routes
const authRoute = require('./routes/authRoutes');
const productRoute = require('./routes/productRoutes');
const categoryRoute = require('./routes/categoryRoutes')
const orderRoute = require('./routes/orderRoutes');
const favoriteRoute = require('./routes/favoriteRoutes');
dotenv.config();

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to db!')
);


//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Route Middlewares
app.use('/api/user',authRoute);
app.use('/api/products',productRoute);
app.use('/api/categories',categoryRoute);
app.use('/api/orders', orderRoute);
app.use('/api/favorites', favoriteRoute);

app.listen(3000, () => console.log('Server up and running'));