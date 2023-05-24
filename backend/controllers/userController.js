const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, last_name,role } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    name,
    last_name,
    email,
    password: hashedPassword,
    role,
  })

  

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      role:user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
  
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role:user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// @desc    Get user data
// @route   GET/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, user: req.user.id })

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, last_name, email, password, phone } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Check if the updated email is already used by another user
    if (email && email !== user.email) {
      const emailInUse = await User.exists({ _id: { $ne: id }, email });
      if (emailInUse) {
        res.status(400);
        throw new Error('Email is already in use by another user');
      }
    }

    // Check for required fields
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required fields' });
      throw new Error('Name, email, and password are required fields');
    }

    // Update user fields
    user.name = name;
    user.last_name = last_name;
    user.email = email;
    user.phone = phone;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while updating the user' });
  }
});


const getAllUserByStatue = asyncHandler(async (req, res) => {
  const rolenumber=req.query.role;
  const users = await User.find({role:parseInt(rolenumber)})

  if (!users) {
    res.status(404);
    throw new Error('Users not found');
  }

  res.status(200).json(users);
});
const upgradeUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }
  const role = 2;
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );

  res.status(200).json(updatedUser);
});
const downgradeUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }
  const role = 1;
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );

  res.status(200).json(updatedUser);
});

const updateUserPhone = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const phone  = req.body.phone;

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }
  
  const updatedUser = await User.findByIdAndUpdate(
    user,
    { phone },
    { new: true }
  );
  res.status(200).json(updatedUser);
});


module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUserById,
  updateUser,
  getAllUserByStatue,
  upgradeUser,
  downgradeUser,
  updateUserPhone
};
