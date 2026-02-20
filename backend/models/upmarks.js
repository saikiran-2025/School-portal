let mongoose = require("mongoose")

let classmarks = new mongoose.Schema({
    class: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        required: true
    },
    Telugu: { type: Number, default: 0, min: 0, max: 100 },
    Hindi: { type: Number, default: 0, min: 0, max: 100 },
    English: { type: Number, default: 0, min: 0, max: 100 },
    Maths: { type: Number, default: 0, min: 0, max: 100 },
    Science: { type: Number, default: 0, min: 0, max: 100 },
    Social: { type: Number, default: 0, min: 0, max: 100 },
    Physics: { type: Number, default: 0, min: 0, max: 100 },
    Biology: { type: Number, default: 0, min: 0, max: 100 },
    Drawing: { type: Number, default: 0, min: 0, max: 100 },
    ScienceLab: { type: Number, default: 0, min: 0, max: 100 },
    MockTest: { type: Number, default: 0, min: 0, max: 100 }
})

let usermarksSchema = new mongoose.Schema({
    hallticket: { type: String, required: true, unique: true },
    marks: [classmarks]
}, { timestamps: true })

module.exports = mongoose.model("upmarks", usermarksSchema)
