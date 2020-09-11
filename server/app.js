const config = require('./utils/config')
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("./utils/logger");
const Data = require("./data");
const app = express();
const cors = require('cors');
const data = require('./data');
const { nextTick } = require('process');
const router = express.Router();
const middleware = require('./utils/middleware')

//connect to database
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
})

.then(() => {
    logger.info('connected to MongoDB')
})
.catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
})

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(middleware.requestLogger)


//controller/routes
//get
router.get("/getData", (req,res) => {
    Data.find((err, data) => {
        if(err) return res.json({Success: false, error: err })
        return res.json({Success: true, data: data})
    })
})

//update
router.put("/:id", (req, res, next) => {
    const { id, message } = req.body;
    const data = {
        message: message
    }

    Data.findByIdAndUpdate(req.params.id, data, { new: true })
    .then(updatedData => { res.json(updatedData.toJSON())})
    .catch(error => next(error))
})

//create
router.post("/putData", (req, res) => {
    let data = new Data();

    const { id, message } = req.body;
    if((!id && id !== 0) || (!message)) {
        return res.json({ Success: false, Message: "Invalid Input"})
    }

    data.message = message
    data.id = id
    data.save(err => {
        if(err) return res.json({ Success: false, Error: err})
        return res.json({ Success: true })
    }) 
})

//delete
router.delete("/deleteData", (req, res) => {
    const { id } = req.body
    Data.findOneAndDelete(id, err => {
        if(err) return res.send(err)
        return res.json({ Success: true })
    })
})

//app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

//to use api
app.use("/api", router)

module.exports = app