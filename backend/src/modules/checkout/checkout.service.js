const prisma = require('../../core/prisma');
const cartService = require('../cart/cart.service');

const getSummary = async (sessionId, pincode) => {
  const cart = await cartService.getCart(sessionId);
  if (!cart.items || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  const subtotal = cart.subtotal;
  let deliveryCharge = 0;
  let freeDeliveryApplied = false;
  let message = "";
  let deliveryPoint = null;

  if (pincode) {
    // Check if delivery point exists
    deliveryPoint = await prisma.deliveryPoint.findUnique({
      where: { pincode }
    });

    if (!deliveryPoint || !deliveryPoint.isActive) {
      // Fallback check if it exists in DeliveryPincode table if we want to migrate
      const legacyPincode = await prisma.deliveryPincode.findUnique({
        where: { pincode }
      });
      
      if (!legacyPincode || !legacyPincode.serviceable) {
        throw new Error(`Delivery not available for pincode ${pincode}`);
      } else {
        // Mock a delivery point from legacy data
        deliveryPoint = {
          id: null,
          pincode: legacyPincode.pincode,
          deliveryCharge: legacyPincode.deliveryCharge,
          minOrderForFreeDelivery: 1000 // default
        };
      }
    }

    const minOrder = parseFloat(deliveryPoint.minOrderForFreeDelivery || 1000);
    const standardCharge = parseFloat(deliveryPoint.deliveryCharge || 0);

    if (subtotal >= minOrder) {
      deliveryCharge = 0;
      freeDeliveryApplied = true;
      message = "Free Delivery Applied!";
    } else {
      deliveryCharge = standardCharge;
      const amountLeft = minOrder - subtotal;
      message = `Add ₹${amountLeft.toFixed(2)} more for FREE Delivery!`;
    }
  }

  const totalAmount = subtotal + deliveryCharge;

  return {
    subtotal,
    deliveryCharge,
    freeDeliveryApplied,
    totalAmount,
    message,
    deliveryPointId: deliveryPoint?.id || null
  };
};

module.exports = {
  getSummary
};
