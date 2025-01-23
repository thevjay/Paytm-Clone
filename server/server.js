const express = require("express");
const cors = require("cors");
const { connect }=require('./db')
const app = express();

require('dotenv').config();

// CORS configuration
// const corsOptions = {
//     origin: 'http://localhost:3000/', // Replace with your frontend URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//     optionsSuccessStatus: 204
// };

// Apply CORS middleware
app.use(cors({
    origin: 'https://paytm-clone-frontend-70yc.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
}));

//app.options('*', cors());  // Enable CORS preflight requests

app.use(express.json());

const mainRoute=require('./routes/index')
app.use('/api/v1',mainRoute);

connect();

const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});