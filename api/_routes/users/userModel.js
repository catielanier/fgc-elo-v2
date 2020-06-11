"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: "User",
    enum: ["Admin", "Author", "User"]
  },
  joinDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  banned: {
    type: Boolean,
    required: true,
    default: false
  }
});

userSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password") || user.isNew) {
    try {
      const hash = await bcrypt.hash(user.password, 10);
      user.password = hash;
      return next();
    } catch (e) {
      return next(e);
    }
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

exports.model = mongoose.model("User", userSchema);
