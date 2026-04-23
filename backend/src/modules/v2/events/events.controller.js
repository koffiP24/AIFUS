const eventsService = require("./events.service");
const { sendHttpError } = require("../common/httpError");

const listEvents = async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === "true";
    const events = await eventsService.listEvents({ includeInactive });
    return res.json(events);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

const getEventBySlug = async (req, res) => {
  try {
    const event = await eventsService.getEventBySlug(req.params.slug);
    return res.json(event);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

module.exports = {
  listEvents,
  getEventBySlug,
};
