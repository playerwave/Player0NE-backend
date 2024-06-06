const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      default: null,
    },
    last_name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      unique: true,
      min: 8,
    },
    profileimage: {
      type: String,
      // default: "default_profile_image_url.jp", // URL ของรูปภาพโปรไฟล์เริ่มต้น
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
