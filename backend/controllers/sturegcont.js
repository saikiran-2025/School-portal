let Student = require("../models/stureg");
let bcrypt = require("bcrypt");

let sr = async (req, res) => {
  try {
    let { hallticket, pwd } = req.body;
    if (!hallticket || !pwd) {
      return res.status(400).json({err: "Hall ticket and password are required"});
    }
    let data = await Student.findOne({ hallticket });
    if (data) {
      return res.status(409).json({msg: "Account already exists with this hall ticket"});
    }
    let pwdhash = await bcrypt.hash(pwd, 10);
    let user = new Student({...req.body,pwd: pwdhash});
    await user.save();
    return res.status(201).json({msg: "Student account created successfully"});
  } catch (error) {
    return res.status(500).json({err: "Error in student registration",details: error.message});
  }
};

module.exports = { sr };
