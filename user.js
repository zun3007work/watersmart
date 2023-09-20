const bcrypt = require('bcrypt');
const User = require('../models/User');

const postSignin = async (req, res) => {
  const inputEmail = req.body.email;
  const inputPassword = req.body.password;

  const user = await User.findOne({ email: inputEmail });

  const isCorrect = await bcrypt.compare(inputPassword, user.password);

  if (user && isCorrect) {
    return res.status(200).json({
      msg: 'login successfully',
      userId: user._id,
    });
  } else {
    return res.status(400).json({
      msg: 'login failed',
    });
  }
};

const postRegister = async (req, res) => {
  const inputEmail = req.body.email,
    inputPassword = req.body.password,
    inputName = req.body.name;

  if (await User.findOne({ email: inputEmail })) {
    return res.status(400).json({
      msg: 'this email has already available',
    });
  }

  const saltRound = 12;

  const hashPassword = await bcrypt.hash(inputPassword, saltRound);

  const user = new User({
    email: inputEmail,
    name: inputName,
    password: hashPassword,
    entries: 0,
    createdAt: new Date(),
  });

  await user.save();

  return res.status(201).json({
    msg: 'account created',
  });
};

const getProfile = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({
      msg: 'user not found',
    });
  } else {
    const { _id, email, name, entries, createdAt } = user;
    return res.status(200).json({
      msg: 'user found',
      userInfo: {
        _id,
        email,
        name,
        entries,
        createdAt,
      },
    });
  }
};

module.exports = {
  postSignin,
  postRegister,
  getProfile,
};
