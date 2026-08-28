import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =========================
// SIGNUP
// =========================
export const signup = async (req, res) => {
try {
const { name, email, password } = req.body;


if (!name || !email || !password) {
  return res.status(400).json({
    message: "Please provide name, email and password.",
  });
}

const existingUser = await User.findOne({
  email: email.toLowerCase(),
});

if (existingUser) {
  return res.status(409).json({
    message: "User already exists.",
  });
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
  name,
  email: email.toLowerCase(),
  password: hashedPassword,
});

const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

res.status(201).json({
  message: "Account created successfully.",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});


} catch (error) {
console.error("Signup error:", error);


res.status(500).json({
  message: "Server error during signup.",
});


}
};

// =========================
// LOGIN
// =========================
export const login = async (req, res) => {
try {
const { email, password } = req.body;


if (!email || !password) {
  return res.status(400).json({
    message: "Please provide email and password.",
  });
}

const user = await User.findOne({
  email: email.toLowerCase(),
});

if (!user) {
  return res.status(401).json({
    message: "Invalid email or password.",
  });
}

const passwordMatch = await bcrypt.compare(
  password,
  user.password
);

if (!passwordMatch) {
  return res.status(401).json({
    message: "Invalid email or password.",
  });
}

const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

res.json({
  message: "Login successful.",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});


} catch (error) {
console.error("Login error:", error);


res.status(500).json({
  message: "Server error during login.",
});


}
};
