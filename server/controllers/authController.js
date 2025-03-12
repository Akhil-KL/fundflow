import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/signup
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role, // "donor", "university", or "admin"
    });

    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
};

// @route   POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};
