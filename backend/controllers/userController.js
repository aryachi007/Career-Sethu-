const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const { name, college, targetRole, targetCompany, githubUrl, skills } = req.body;

    // Validate required fields
    if (!name || !college || !targetRole || !targetCompany) {
      return res.status(400).json({ error: "Missing required fields: name, college, targetRole, targetCompany" });
    }

    const newUser = await User.create({
      name,
      college,
      targetRole,
      targetCompany,
      githubUrl,
      skills,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Server error creating user" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error fetching users" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error fetching user" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, college, targetRole, targetCompany, githubUrl, skills } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (college !== undefined) user.college = college;
    if (targetRole !== undefined) user.targetRole = targetRole;
    if (targetCompany !== undefined) user.targetCompany = targetCompany;
    if (githubUrl !== undefined) user.githubUrl = githubUrl;
    if (skills !== undefined) user.skills = skills;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Server error updating user" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
};
