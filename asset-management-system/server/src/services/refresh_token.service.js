const jwt = require("jsonwebtoken");

const refreshTokenRepository = require("../repositories/refresh_token.repository");
const authRepository = require("../repositories/auth.repository");
const env = require("../config/env");
const AppError = require("../utils/AppError");

const refreshAccessToken = async (token) => {
  const existingToken = await refreshTokenRepository.findByToken(token);

  if (!existingToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (new Date(existingToken.expires_at) < new Date()) {
    await refreshTokenRepository.deleteByToken(token);

    throw new AppError("Refresh token expired", 401);
  }

  const user = await authRepository.findById(existingToken.user_id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.status) {
    throw new AppError("User is inactive", 403);
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    env.jwt.secret,
    {
      expiresIn: env.jwt.expiresIn,
    },
  );

  return {
    accessToken,
  };
};

module.exports = {
  refreshAccessToken,
};
