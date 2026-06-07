const prisma = require('../../core/prisma');

const checkDeliveryOptions = async (pincode, productId) => {
  const [deliveryInfo, product] = await Promise.all([
    prisma.deliveryPincode.findUnique({
      where: { pincode }
    }),
    productId ? prisma.product.findUnique({ where: { id: parseInt(productId, 10) } }) : null
  ]);

  if (!deliveryInfo) {
    return {
      serviceable: false,
      message: 'Delivery is not available for this pincode.',
      estimatedDelivery: null,
      deliveryCharge: null,
      codAvailable: false
    };
  }

  return {
    serviceable: deliveryInfo.serviceable,
    message: deliveryInfo.serviceable ? 'Delivery available.' : 'Currently not serviceable.',
    estimatedDelivery: deliveryInfo.estimatedDelivery,
    deliveryCharge: deliveryInfo.deliveryCharge,
    codAvailable: deliveryInfo.codAvailable,
    productStockStatus: product ? product.stockStatus : null
  };
};

module.exports = {
  checkDeliveryOptions
};
