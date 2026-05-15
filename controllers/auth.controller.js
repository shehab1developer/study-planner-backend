const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const httpStatus = require("../utils/httpStatus");

// ── Helpers ────────────────────────────────────────────────────────────────
const generateToken = (userId) =>
  jwt.sign({ _id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

const setTokenCookie = (res, token) =>
  res.cookie("jwt_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

// ── Register ───────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: httpStatus.FAIL,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: httpStatus.FAIL,
        message: "Email already in use",
      });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    return res.status(201).json({
      status: httpStatus.SUCCESS,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: httpStatus.ERROR, message: err.message });
  }
};

// ── Login ──────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: httpStatus.FAIL,
        message: "Email and password are required",
      });
    }

    // .select('+password') because password has select:false on the schema
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        status: httpStatus.FAIL,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: httpStatus.FAIL,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    return res.status(200).json({
      status: httpStatus.SUCCESS,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: httpStatus.ERROR, message: err.message });
  }
};

// ── Logout ─────────────────────────────────────────────────────────────────
const logout = (req, res) => {
  res.clearCookie("jwt_token");
  return res
    .status(200)
    .json({ status: httpStatus.SUCCESS, message: "Logged out" });
};
const getMe = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        status: httpStatus.FAIL,
        message: "Not authenticated",
      });
    }

    return res.status(200).json({
      status: httpStatus.SUCCESS,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: httpStatus.ERROR,
      message: error.message,
    });
  }
};
// update profile
const updateProfile = async (req, res) => {
    try {
        const { name, email, newPassword } = req.body;

        const updates = {};

        if (name)        updates.name  = name.trim();
        if (email)       updates.email = email.trim().toLowerCase();
        if (newPassword) {
            if (newPassword.length < 6) {
                return res.status(400).json({
                    status:  httpStatus.FAIL,
                    message: 'Password must be at least 6 characters',
                });
            }
            updates.password = await bcrypt.hash(newPassword, 12);
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                status:  httpStatus.FAIL,
                message: 'No fields provided to update',
            });
        }

        // Email uniqueness check
        if (email) {
            const emailTaken = await User.findOne({ email: updates.email, _id: { $ne: req.userId } });
            if (emailTaken) {
                return res.status(409).json({
                    status:  httpStatus.FAIL,
                    message: 'Email is already in use by another account',
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            updates,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            status: httpStatus.SUCCESS,
            data: {
                _id:        updatedUser._id,
                name:       updatedUser.name,
                email:      updatedUser.email,
                role:       updatedUser.role,
                isVerified: updatedUser.isVerified,
            },
        });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.ERROR, message: err.message });
    }
};

module.exports = { register, login, logout, getMe,updateProfile };
