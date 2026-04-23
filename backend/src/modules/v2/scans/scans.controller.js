const scansService = require("./scans.service");
const { sendHttpError } = require("../common/httpError");

const getRequestMeta = (req) => ({
  ipAddress: req.ip || req.socket?.remoteAddress || null,
});

const validateScan = async (req, res) => {
  try {
    const payload = await scansService.validateScan(
      req.body,
      req.ticketingUser,
      getRequestMeta(req),
    );
    return res.json(payload);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

const getTicketByCode = async (req, res) => {
  try {
    const ticket = await scansService.getTicketByCode(req.params.ticketCode);
    return res.json(ticket);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

module.exports = {
  validateScan,
  getTicketByCode,
};
