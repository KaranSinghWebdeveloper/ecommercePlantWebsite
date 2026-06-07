const deliveryRepository = require('./delivery.repository');

const checkDeliveryOptions = async (pincode, productId) => {
  if (!pincode) {
    const error = new Error('Pincode is required');
    error.isJoi = true;
    error.details = [{ context: { key: 'pincode' }, message: 'Pincode is required' }];
    throw error;
  }
  return await deliveryRepository.checkDeliveryOptions(pincode, productId);
};

module.exports = {
  checkDeliveryOptions
};
