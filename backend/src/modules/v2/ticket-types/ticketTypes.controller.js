const ticketTypesService = require("./ticketTypes.service");
const { sendHttpError } = require("../common/httpError");

const listTicketTypes = async (req, res) => {
  try {
    const ticketTypes = await ticketTypesService.listTicketTypes({
      eventSlug: req.query.eventSlug,
      eventId: req.query.eventId,
      includeInactive: req.query.includeInactive === "true",
    });

    return res.json(ticketTypes);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

module.exports = {
  listTicketTypes,
};
