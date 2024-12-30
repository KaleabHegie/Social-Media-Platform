const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
  register: async (req, res) => {
    try {
      const { first_name, last_name, user_name, date_of_birth, email, gender, password } =
        req.body;

      // Validate required fields
      if (!first_name || !last_name || !user_name || !email || !password) {
        return res.status(400).json({
          message:
            "All required fields (first_name, last_name, user_name, email, password) must be provided.",
        });
      }

      // Validate gender if provided
      if (gender && !["male", "female"].includes(gender.toLowerCase())) {
        return res.status(400).json({
          message: "Invalid gender. Allowed values are 'male' or 'female'.",
        });
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { user_name }],
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "A user was found with this email or username" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        first_name,
        last_name,
        user_name,
        date_of_birth,
        email,
        gender,
        password: hashedPassword,
      });

      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error registering user", error });
    }
  },
  login: async (req, res) => {
    const password = req.body.password;
    const user_name = req.body.username;
    if (!user_name || !password) {
      res.status(400);
      throw new Error("Please provide username and password");
    }
    const user = await User.findOne({ user_name });

    if (
      user &&
      (await bcrypt.compare(password, user.password)) &&
      (await (user_name, user.user_name))
    ) {
      const accessToken = jwt.sign(
        {
          user: {
            username: user.user_name,
            email: user.email,
            id: user._id,
            is_admin: user.is_admin,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "30d",
        }
      );

      res.status(200).json({ accessToken });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  },
};

module.exports = userController;
