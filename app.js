const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const morgan = require('morgan');
const bodyParser = require("body-parser");

const db = require("./models");
const authRouter = require("./routers/authRouter");
const productRouter = require("./routers/productRouter");

dotenv.config("./.env");

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("common"));

app.use(express.static(path.join(__dirname, "uploads")));
app.use("/auth",authRouter);
app.use(productRouter);

const PORT = process.env.PORT;

app.listen(PORT);