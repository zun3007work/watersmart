const User = require('../models/User');

const postImage = async (req, res) => {
  const userId = req.body._id;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({
      msg: 'user not found',
    });
  } else {
    user.entries++;
    const { entries } = user.entries;
    await user.save();
    return res.status(200).json({
      msg: 'user found',
      userInfo: {
        entries,
      },
    });
  }
};

module.exports = {
  postImage,
};
