const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

exports.signUp = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validasi Input START
    if (!name) {
      return res.status(400).json({ message: "Silahkan masukan Nama" });
    }

    if (!email) {
      return res.status(400).json({ message: "Silahkan masukan email" });
    }

    if (!password) {
      return res.status(400).json({ message: "Silahkan masukan password" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password dan Confirm Password tidak sama",
      });
    }

    // Validasi Input END

    // Hash password sebelum disimpan ke database
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Cek jika email sudah ada di database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email anda telah terdaftar di layanan kami" });
    }

    // Simpan pengguna baru ke database
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      token: "",
    });

    await newUser.save();

    return res
      .status(201)
      .json({ message: "User berhasil diregistrasi", newUser });
  } catch (error) {
    console.error("Error saat pendaftaran:", error.message);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan saat membuat pengguna" });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email)
      return res.status(400).json({ message: "Silahkan masukan email anda" });
    if (!password)
      return res
        .status(400)
        .json({ message: "Silahkan masukan password anda" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Email tidak ditemukan, silahkan daftar terlebih dahulu",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Password yang anda masukan salah!" });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1h" }
    );

    await User.updateOne({ email: email }, { $set: { token: token } });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.JWT_SECRET === "supersecurekey",
      // sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login Successful",
      data: user,
      token: token,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error during login" });
  }
};
exports.signOut = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log("Token yang diterima: " + token);

    // Jika token tidak ditemukan di cookies
    if (!token) {
      return res.status(401).json({ message: "Token Not Found" });
    }

    // Cari user berdasarkan token
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({
        message: "User not found, please register first",
      });
    }

    // Hapus refresh token di database
    await User.updateOne({ token: token }, { $set: { refreshToken: null } });

    // Hapus cookie token dari browser
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Gunakan secure hanya jika di production
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Error during logout" });
  }
};

// exports.fetchData = async (req, res) => {
//   const { }
// }
