const ticketsService = require("./tickets.service");
const { sendHttpError } = require("../common/httpError");

const getDownloadByReference = async (req, res) => {
  try {
    const payload = await ticketsService.getDownloadByReference(req.params.reference, {
      user: req.ticketingUser || null,
      customerEmail: req.query.customerEmail || null,
    });

    return res.json(payload);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

module.exports = {
  getDownloadByReference,
};
