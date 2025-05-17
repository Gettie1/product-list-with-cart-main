import type { Product } from './types';
import { addOrUpdateCartItem, getAllCartItems } from './db';

export async function addToCart(product: Product) {
  await addOrUpdateCartItem({ ...product, quantity: 1 });
  updateCartUI();
}

export async function updateCartUI() {
  const cartItems = await getAllCartItems();
  const list = document.getElementById('cart-items')!;
  const count = document.getElementById('cart-count')!;
  const total = document.getElementById('cart-total')!;

  list.innerHTML = '';
  let itemCount = 0;
  let totalAmount = 0;

  cartItems.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.name} <br> ${item.quantity}x @$${(item.price)}   $${(item.price * item.quantity).toFixed(2)}`;
    list.appendChild(li);

    itemCount += item.quantity;
    totalAmount += item.quantity * item.price;
  });

  count.textContent = String(itemCount);
  total.textContent = `$${totalAmount.toFixed(2)}`;
}
