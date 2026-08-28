const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const authRepository = require("../repositories/auth.repository");
const refreshTokenRepository = require("../repositories/refresh_token.repository");

const AppError = require("../utils/AppError");

const login = async (username, password) => {
  const user = await authRepository.findByUsername(username);

  if (!user) {
    throw new AppError("Invalid username or password", 401);
  }

  if (user.status !== 1) {
    throw new AppError("User account is disabled", 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError("Invalid username or password", 401);
  }

  // Access Token
  const accessToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
  );

  // Refresh Token
  const refreshToken = crypto.randomBytes(64).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await refreshTokenRepository.create(user.id, refreshToken, expiresAt);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    },
  };
};

const logout = async (refreshToken) => {
  console.log("LOGOUT TOKEN:", refreshToken);
  const deleted = await refreshTokenRepository.deleteByToken(refreshToken);

  if (!deleted) {
    throw new AppError("Invalid refresh token", 401);
  }

  return {
    message: "Logout successful",
  };
};

module.exports = {
  login,
  logout,
};
