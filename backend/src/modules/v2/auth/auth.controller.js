const authService = require("./auth.service");
const { sendHttpError } = require("../common/httpError");

const getRequestMetadata = (req) => ({
  userAgent: req.headers["user-agent"] || null,
  ipAddress: req.ip || req.socket?.remoteAddress || null,
});

const register = async (req, res) => {
  try {
    const payload = await authService.register(req.body, getRequestMetadata(req));
    return res.status(201).json(payload);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const payload = await authService.login(req.body, getRequestMetadata(req));
    return res.json(payload);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

const refresh = async (req, res) => {
  try {
    const payload = await authService.refresh(
      req.body.refreshToken,
      getRequestMetadata(req),
    );
    return res.json(payload);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

const logout = async (req, res) => {
  try {
    await authService.logout(req.body.refreshToken);
    return res.json({ message: "Session fermee" });
  } catch (error) {
    return sendHttpError(res, error);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.ticketingUser.id);
    return res.json(user);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
};
