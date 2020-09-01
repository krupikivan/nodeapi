const express = require('express')
const app = express()
const morgan = require('morgan')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const cors = require('cors')
const expressValidator = require('express-validator');
dotenv.config();

// Database
mongoose.connect(
    process.env.MONGO_URI,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
)
    .then(() => console.log('DB Connected'))

mongoose.connection.on('error', err => console.log(`DB connection error: ${err.message}`))

// Routes
const postRoutes = require('./src/routes/post');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
app.get('/', (req, res) => {
    fs.readFile('./src/docs/apiDocs.json', (err, data) => {
        if (err) {
            res.status(400).json({ error: err })
        }
        const docs = JSON.parse(data)
        res.json(docs);
    })
});

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ error: "Unauthorized" })
    }
});


const port = process.env.PORT || 8080;

app.listen(port, () => { console.log(`A Node JS API is listening on port: ${port}`) });