const prisma = require('../../core/prisma');

const getCart = async (sessionId) => {
  let cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: true // We need to fetch product details manually since we didn't relation them to keep it decoupled, or we can fetch products manually here
    }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
      include: { items: true }
    });
  }

  // Fetch product details for cart items
  const productIds = cart.items.map(i => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { images: { where: { isPrimary: true } } }
  });

  // Calculate totals and merge
  let subtotal = 0;
  const enrichedItems = cart.items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return null;
    
    const price = parseFloat(product.price);
    subtotal += price * item.quantity;
    
    return {
      id: item.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: price,
      quantity: item.quantity,
      image: product.images[0]?.imageUrl || null,
      stockStatus: product.stockStatus,
      stockAvailable: product.stockAvailable
    };
  }).filter(Boolean);

  return {
    id: cart.id,
    sessionId: cart.sessionId,
    items: enrichedItems,
    subtotal
  };
};

const addToCart = async (sessionId, productId, quantity) => {
  let cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { sessionId } });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId }
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity }
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity
      }
    });
  }

  return getCart(sessionId);
};

const updateCartItem = async (sessionId, cartItemId, quantity) => {
  const cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (!cart) throw new Error('Cart not found');

  if (quantity <= 0) {
    return removeCartItem(sessionId, cartItemId);
  }

  await prisma.cartItem.updateMany({
    where: { id: cartItemId, cartId: cart.id },
    data: { quantity }
  });

  return getCart(sessionId);
};

const removeCartItem = async (sessionId, cartItemId) => {
  const cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (!cart) throw new Error('Cart not found');

  await prisma.cartItem.deleteMany({
    where: { id: cartItemId, cartId: cart.id }
  });

  return getCart(sessionId);
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
};
