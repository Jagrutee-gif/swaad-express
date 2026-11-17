// SWAAD EXPRESS CART AND BILL LOGIC
// The cart is a plain object: { dishId: quantity }.

const MAX_PER_DISH = 10;   // F2 will lower this to 10 (kitchen capacity)

// "₹249" -> 249
function priceValue(price) {
  return Number(String(price).replace(/[^0-9.]/g, "")) || 0;
}

function addToCart(cart, id) {
  const key = String(id);
  const qty = cart[key] || 0;
  if (qty < MAX_PER_DISH) cart[key] = qty + 1;
  return cart;
}

function changeQty(cart, id, delta) {
  const key = String(id);
  const qty = (cart[key] || 0) + delta;
  if (qty <= 0) delete cart[key];
  else if (qty <= MAX_PER_DISH) cart[key] = qty;
  return cart;
}

// Turns the cart into rows: dish, quantity, line total.
function cartLines(cart, menu) {
  return menu
    .filter((item) => cart[String(item.id)] > 0)
    .map((item) => {
      const qty = cart[String(item.id)];
      return { item, qty, lineTotal: priceValue(item.price) * qty };
    });
}

// The food total: the sum of every line.
function cartTotal(cart, menu) {
  return cartLines(cart, menu).reduce((sum, line) => sum + line.lineTotal, 0);
}

// The bill: food total + 5% GST.
function billSummary(cart, menu) {
  const food = cartTotal(cart, menu);
  const gstRate = 0.05;
  const gst = Math.round(food * gstRate * 100) / 100;
  const total = Math.round((food + gst) * 100) / 100;
  return { food, gstRate, gst, total };
}

if (typeof module !== "undefined") {
  module.exports = { MAX_PER_DISH, priceValue, addToCart, changeQty, cartLines, cartTotal, billSummary };
}
