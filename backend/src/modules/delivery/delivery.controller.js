const deliveryService = require('./delivery.service');
const { successResponse } = require('../../core/response');

const checkDeliveryOptions = async (req, res, next) => {
  try {
    const { pincode, productId } = req.query;
    const options = await deliveryService.checkDeliveryOptions(pincode, productId);
    return successResponse(res, 200, 'Delivery options retrieved', options);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkDeliveryOptions
};
