const schema = require("./schema");
const bcrypt = require("bcrypt");

const listingUser = async (req, resp) => {
  let response = await schema.userModel.find();
  let result = { status: 1, message: "Success", data: response };
  resp.send(result);
};

const createUser = async (req, resp) => {
  const { name, mobile, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(password, salt);

  let data = {
    name: name,
    mobile: mobile,
    email: email,
    password: hassedPassword,
  };

  let response1 = await schema.userModel.findOne({ email });

  if (response1) {
    let result = { status: 0, message: "User Already Exist" };
    resp.send(result);
  } else {
    let response2 = new schema.userModel(data);
    let result = await response2.save();
    resp.send(result);
  }
};

const updateUser = async (req, resp) => {
  let { email, mobile, name, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hassedPassword = await bcrypt.hash(password, salt);

  let data = {
    name: name,
    mobile: mobile,
    password: hassedPassword,
  };

  let response = await schema.userModel.findOne({ email });
  if (response) {
    let result = await schema.userModel.updateOne(
      { email: email },
      { $set: data }
    );
    resp.send(result);
  } else {
    let data = { status: 0, message: "Please Enter Valid Data" };
    resp.send(data);
  }
};

const deleteUser = async (req, resp) => {
  let { email } = req.body;
  let response = await schema.userModel.findOne({ email });

  if (response) {
    let result = await schema.userModel.deleteOne({ email });
    resp.send(result);
  } else {
    let data = { status: 0, message: "Please Enter Valid Data" };
    resp.send(data);
  }
};

const loginUser = async (req, resp) => {
  let { email, password } = req.body;
  let response = await schema.userModel.findOne({ email });

  if (response) {
    bcrypt.compare(password, response.password, (err, result) => {
      if (result) {
        let data = {
          status: 1,
          message: "Login Successfull",
          data: response,
        };
        resp.send(data);
      } else {
        let data = { status: 0, message: "Wrong Password" };
        resp.send(data);
      }
    });
  } else {
    let data = { status: 0, message: "Wrong Email" };
    resp.send(data);
  }
};

module.exports = {
  listingUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
