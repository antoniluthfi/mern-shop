const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

require('dotenv/config');

app.use(cors());
app.options('*', cors());

const baseurl = process.env.API_URL;
const userRouter = require('./routers/user');
const productRouter = require('./routers/product');
const categoryRouter = require('./routers/category');
const orderRouter = require('./routers/order');

// middleware 
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

// connection
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'mern-shop'
})
.then(() => {
    console.log('connected');
})
.catch(err => {
    console.log(err);
});

// routers
app.use(`${baseurl}/user`, userRouter);
app.use(`${baseurl}/product`, productRouter);
app.use(`${baseurl}/category`, categoryRouter);
app.use(`${baseurl}/order`, orderRouter);

app.get('/', (req, res) => {
    res.send('hello antoni');
});

app.listen(5000, () => {
    console.log('server is running on port 5000');
});