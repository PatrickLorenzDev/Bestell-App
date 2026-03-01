const menuItems = {
  1: { id: 1, name: "Pizza Krabben",    description: "mit Krabben und Peperoni",                     price: 9.50 },
  2: { id: 2, name: "Pizza Margherita", description: "mit Mozzarella",                               price: 5.90 },
  3: { id: 3, name: "Pizza Diavolo",    description: "mit Salami, Zwiebeln, Peperoni und Knoblauch", price: 8.50 },
  4: { id: 4, name: "Pizzabrötchen",    description: "mit Käse und Knoblauch",                       price: 12.90 },
};

let cart = [];
const deliveryCost = 5.00;

function calculateSubtotal() {
  let sum = 0;
  for (let i = 0; i < cart.length; i++) {
    sum += cart[i].price * cart[i].quantity;
  }
  return sum;
}

function renderCart() {
  const subtotal = calculateSubtotal();
  const total = subtotal + deliveryCost;

  let itemsHTML = "";

  if (cart.length === 0) {
    itemsHTML = "<li class='cart__empty'>Der Warenkorb ist leer.</li>";
  } else {
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      itemsHTML += "<li class='cart__item'>";
      itemsHTML += "<span class='cart__item-name'>" + item.name + "</span>";
      itemsHTML += "<div class='cart__item-controls'>";
      itemsHTML += "<button class='cart__btn' onclick='changeQuantity(" + item.id + ", -1)'>-</button>";
      itemsHTML += "<span class='cart__item-quantity'>" + item.quantity + "x</span>";
      itemsHTML += "<button class='cart__btn' onclick='changeQuantity(" + item.id + ", 1)'>+</button>";
      itemsHTML += "<button class='cart__btn cart__btn--delete' onclick='removeItem(" + item.id + ")'>🗑</button>";
      itemsHTML += "</div>";
      itemsHTML += "<span class='cart__item-price'>" + (item.price * item.quantity).toFixed(2) + " €</span>";
      itemsHTML += "</li>";
    }
  }

  document.getElementById("cart__list").innerHTML = itemsHTML;

  let summaryHTML = "";
  summaryHTML += "<div class='cart__summary-row'><span>Zwischensumme</span><span>" + subtotal.toFixed(2) + " €</span></div>";
  summaryHTML += "<div class='cart__summary-row'><span>Lieferung</span><span>" + deliveryCost.toFixed(2) + " €</span></div>";
  summaryHTML += "<div class='cart__summary-row cart__summary-row--total'><span>Gesamt</span><span>" + total.toFixed(2) + " €</span></div>";

  document.getElementById("cart__summary").innerHTML = summaryHTML;
}

function addToCart(id) {
  const product = menuItems[id];

  let existingItem = null;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      existingItem = cart[i];
    }
  }

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: 1
    });
  }

  renderCart();
}

function changeQuantity(id, delta) {
  let item = null;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      item = cart[i];
    }
  }

  if (item === null) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    removeItem(id);
    return;
  }

  renderCart();
}

function removeItem(id) {
  let newCart = [];
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id !== id) {
      newCart.push(cart[i]);
    }
  }
  cart = newCart;
  renderCart();
}

renderCart();
