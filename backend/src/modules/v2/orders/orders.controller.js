const ordersService = require("./orders.service");
const { sendHttpError } = require("../common/httpError");

const previewOrder = async (req, res) => {
  try {
    const preview = await ordersService.previewOrder(req.body);
    return res.json(preview);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await ordersService.createOrder(req.body, req.ticketingUser || null);
    return res.status(201).json(order);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

const getOrderByReference = async (req, res) => {
  try {
    const order = await ordersService.getOrderByReference(
      req.params.reference,
      req.ticketingUser || null,
      req.query.customerEmail || null,
    );
    return res.json(order);
  } catch (error) {
    return sendHttpError(res, error);
  }
};

module.exports = {
  previewOrder,
  createOrder,
  getOrderByReference,
};
