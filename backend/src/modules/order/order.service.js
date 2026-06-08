const prisma = require('../../core/prisma');
const checkoutService = require('../checkout/checkout.service');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_MOCK_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret_12345',
});

const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
  return `PLANT-${dateStr}-${randomStr}`;
};

const createOrder = async (sessionId, orderData) => {
  const { customerName, customerPhone, customerEmail, addressLine1, addressLine2, city, state, pincode, landmark, customerNote, paymentMethod = 'COD' } = orderData;

  if (!customerName || !customerPhone || !addressLine1 || !city || !state || !pincode) {
    throw new Error('Missing required customer or address details');
  }

  // 1. Calculate Summary to ensure prices match backend
  const summary = await checkoutService.getSummary(sessionId, pincode);
  
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true }
  });

  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  // Fetch product details for prices and names
  const productIds = cart.items.map(i => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { images: { where: { isPrimary: true } } }
  });

  // Verify stock
  for (const item of cart.items) {
    const product = products.find(p => p.id === item.productId);
    if (!product || product.stockAvailable < item.quantity) {
      throw new Error(`Product ${product?.name || item.productId} is out of stock or requested quantity unavailable`);
    }
  }

  // Prepare Razorpay Order if ONLINE
  let rzpOrder = null;
  const orderNumber = generateOrderNumber();
  if (paymentMethod === 'ONLINE') {
    const amountInPaise = Math.round(parseFloat(summary.totalAmount) * 100);
    rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: orderNumber,
    });
  }

  // Run in transaction
  const localOrder = await prisma.$transaction(async (tx) => {
    // 2. Create or find Customer
    let customer = await tx.customer.findUnique({ where: { phone: customerPhone } });
    if (!customer) {
      customer = await tx.customer.create({
        data: { name: customerName, phone: customerPhone, email: customerEmail }
      });
    }

    // 3. Create Address (or use existing but let's always create for snapshot or find exact)
    const address = await tx.customerAddress.create({
      data: {
        customerId: customer.id,
        fullName: customerName,
        phone: customerPhone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        landmark
      }
    });

    const deliveryAddressText = `${customerName}, ${addressLine1}, ${addressLine2 ? addressLine2 + ', ' : ''}${city}, ${state} - ${pincode}. Landmark: ${landmark || 'N/A'}, Phone: ${customerPhone}`;

    // 4. Create Order
    const order = await tx.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        customerName,
        customerPhone,
        customerEmail,
        addressId: address.id,
        deliveryAddressText,
        deliveryPointId: summary.deliveryPointId,
        paymentMethod: paymentMethod, 
        paymentStatus: 'pending',
        orderStatus: 'pending',
        razorpayOrderId: rzpOrder ? rzpOrder.id : null,
        subtotal: summary.subtotal,
        deliveryCharge: summary.deliveryCharge,
        totalAmount: summary.totalAmount,
        freeDeliveryApplied: summary.freeDeliveryApplied,
        customerNote
      }
    });

    // 5. Create Order Items and decrease stock
    const orderItemsData = cart.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      const unitPrice = parseFloat(product.price);
      return {
        orderId: order.id,
        productId: product.id,
        productName: product.name,
        productImage: product.images[0]?.imageUrl || null,
        quantity: item.quantity,
        unitPrice: unitPrice,
        totalPrice: unitPrice * item.quantity
      };
    });

    await tx.orderItem.createMany({ data: orderItemsData });

    // Decrease stock
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockAvailable: { decrement: item.quantity } }
      });
    }

    // 6. Create Status Log
    await tx.orderStatusLog.create({
      data: {
        orderId: order.id,
        newStatus: 'pending',
        note: `Order created via checkout (${paymentMethod})`
      }
    });

    // 7. Clear Cart if COD.
    if (paymentMethod === 'COD') {
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return order;
  });

  return { order: localOrder, rzpOrder };
};

const getOrder = async (orderNumber) => {
  return await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      statusLogs: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });
};

const verifyPayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature, sessionId = null) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret_12345';
  
  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    const order = await prisma.order.findFirst({
      where: { razorpayOrderId: razorpay_order_id }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { 
        paymentStatus: 'paid',
        razorpayPaymentId: razorpay_payment_id
      }
    });

    await prisma.orderStatusLog.create({
      data: {
        orderId: order.id,
        newStatus: 'pending',
        note: 'Payment verified successfully via Razorpay'
      }
    });

    if (sessionId) {
      const cart = await prisma.cart.findUnique({ where: { sessionId } });
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }

    return true;
  } else {
    throw new Error('Invalid signature');
  }
};

module.exports = {
  createOrder,
  getOrder,
  verifyPayment
};
