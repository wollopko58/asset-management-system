const authService = require("../services/auth.service");
const refreshTokenService = require("../services/refresh_token.service");
const { sendSuccess } = require("../utils/response");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login(username, password);

    sendSuccess(res, result, "Login successful");
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.logout(refreshToken);

    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const result = await refreshTokenService.refreshAccessToken(
      req.body.refreshToken,
    );

    sendSuccess(res, result, "Access token refreshed successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  refresh,
};
