let mongoose = require("mongoose")

let studentSchema = new mongoose.Schema({
    hallticket: { type: String, required: true, unique: true },
    "hallticket": String,
    "stuname": String,
    "stuclass": Number,
    "stufather": String,
    "stuphone": Number,
    "stuaddress": String,
    "stucity": String,
    "stustate": String,
    "stuattend": Number,
    "stuage": Number,
    "stugen": String,
    "stufees": Number,
    createdBy: String  // Faculty ID who created
}, { timestamps: true })

module.exports = mongoose.model("stupro", studentSchema)
