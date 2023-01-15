const express = require("express");
const app = express();
const userRouter = require("./src/router");
const { connect } = require('./src/helpers/db.helper');
const dotenv = require('dotenv');
dotenv.config()
const fileUpload = require('express-fileupload');
 
// default options
app.use(fileUpload());


app.use(express.json());

app.use("/api", userRouter);

const port = process.env.PORT || 3000;
connect().then(() => {
    app.listen(port, () => {
        console.log(`Server started on port http://localhost:${port}`);
    });
}).catch(err => {
    console.log(err);
    process.exit(1);
});