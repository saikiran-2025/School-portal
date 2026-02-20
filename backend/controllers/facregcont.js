let Faculty = require("../models/facreg");
let bcrypt = require("bcrypt");

let fr = async (req, res) => {
  try {
    let { facultyid, pwd } = req.body;
    if (!facultyid || !pwd) {
      return res.status(400).json({err: "Faculty ID and password are required"});
    }
    let data = await Faculty.findOne({ facultyid });
    if (data) {
      return res.status(409).json({msg: "Account already exists with this faculty ID"});
    }
    let pwdhash = await bcrypt.hash(pwd, 10);
    let user = new Faculty({...req.body,pwd: pwdhash});
    await user.save();
    return res.status(201).json({msg: "Faculty account created successfully"});
  } 
  catch (error) {
    return res.status(500).json({err: "Error in faculty registration",details: error.message});
  }
};
module.exports = { fr };
