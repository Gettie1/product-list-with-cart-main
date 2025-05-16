interface ProductInfo {
  name: string;
  price: number;
}

const cart: { [name: string]: { price: number; quantity: number } } = {};

function updateCartDisplay(): void {
  const cartItems = document.getElementById("cart-items")!;
  const cartCount = document.getElementById("cart-count")!;
  const cartTotal = document.getElementById("cart-total")!;

  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  for (const name in cart) {
    const item = cart[name];
    const lineTotal = item.price * item.quantity;
    total += lineTotal;
    count += item.quantity;

    const li = document.createElement("li");
    li.textContent = `${name} - ${item.quantity} x $${item.price.toFixed(2)} = $${lineTotal.toFixed(2)}`;
    cartItems.appendChild(li);
  }

  cartCount.textContent = count.toString();
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

function extractProductInfo(card: HTMLElement): ProductInfo | null {
  const nameEl = card.querySelector("h4");
  const priceEl = card.querySelector(".price");

  if (!nameEl || !priceEl) return null;

  const name = nameEl.textContent?.trim() || "Unknown";
  const price = parseFloat(priceEl.textContent?.replace("$", "") || "0");

  return { name, price };
}

function setupCart(): void {
  const buttons = document.querySelectorAll(".add-to-cart");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product") as HTMLElement;
      const info = extractProductInfo(card);

      if (info) {
        if (!cart[info.name]) {
          cart[info.name] = { price: info.price, quantity: 1 };
        } else {
          cart[info.name].quantity++;
        }
        updateCartDisplay();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", setupCart);
