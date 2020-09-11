const mongoose = require("mongoose")
const Schema = mongoose.Schema

//Database data structure
const dataSchema = new Schema(
   { 
    id: Number,
    message: String
},
{ timestamps: true}
)

dataSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

module.exports = mongoose.model("Data", dataSchema)