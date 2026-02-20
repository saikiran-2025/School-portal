let mongoose=require("mongoose")
let ustt=new mongoose.Schema({
    class: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        required: true
    },
    timetable: {
        monday: [{ subject: String, time: String }],    // [{"subject": "Maths", "time": "9:00-10:00"}]
        tuesday: [{ subject: String, time: String }],
        wednesday: [{ subject: String, time: String }],
        thursday: [{ subject: String, time: String }],
        friday: [{ subject: String, time: String }]
    } 
})
let umtt=mongoose.model("timetable",ustt)
module.exports=umtt