const menuData = {
  hauptgerichte: {
    label: "Hauptgerichte",
    banner: "./assets/img/21_italian_57.avif",
    items: {
      1: { id: 1, name: "Pizza Krabben",    description: "mit Krabben und Peperoni",                     price: 9.50 },
      2: { id: 2, name: "Pizza Margherita", description: "mit Mozzarella",                               price: 5.90 },
      3: { id: 3, name: "Pizza Diavolo",    description: "mit Salami, Zwiebeln, Peperoni und Knoblauch", price: 8.50 },
    }
  },
  beilagen: {
    label: "Beilagen",
    banner: "./assets/img/271_italian_pizza_111.avif",
    items: {
      4: { id: 4, name: "Pizzabrötchen", description: "mit Käse und Knoblauch",  price: 12.90 },
      5: { id: 5, name: "Knoblauchbrot", description: "mit Butter und Kräutern", price: 3.50  },
      6: { id: 6, name: "Dip Auswahl",   description: "Ketchup, Mayo oder BBQ",  price: 1.50  },
    }
  },
  getraenke: {
    label: "Getränke",
    banner: "./assets/img/21_italian_57.avif",
    items: {
      7: { id: 7, name: "Cola 0,5l",        description: "eisgekühlt",           price: 2.50 },
      8: { id: 8, name: "Wasser 0,5l",      description: "still oder sprudelnd", price: 1.90 },
      9: { id: 9, name: "Orangensaft 0,3l", description: "frisch gepresst",      price: 3.20 },
    }
  }
};

let cart = [];
const deliveryCost = 1.99;


// ─── CATEGORY NAV ─────────────────────────────

function buildNavLink(key, isFirst) {
  let activeClass = isFirst ? " category-nav__link--active" : "";
  return "<a class='category-nav__link" + activeClass + "' href='#" + key + "'>" + menuData[key].label + "</a>";
}

function buildCategoryNav() {
  let navHTML = "";
  let keys = Object.keys(menuData);
  for (let i = 0; i < keys.length; i++) {
    navHTML += buildNavLink(keys[i], i === 0);
  }
  document.getElementById("category-nav").innerHTML = navHTML;
}


// ─── MENU CATEGORIES ──────────────────────────

function buildMenuItemHTML(item) {
  let html = "<li class='menu-item'>";
  html += "<div class='menu-item__info'>";
  html += "<h3 class='menu-item__name'>" + item.name + "</h3>";
  html += "<p class='menu-item__description'>" + item.description + "</p>";
  html += "<span class='menu-item__price'>" + item.price.toFixed(2) + "&nbsp;€</span>";
  html += "</div>";
  html += "<button class='menu-item__add-btn' onclick='addToCart(" + item.id + ")'>+</button>";
  html += "</li>";
  return html;
}

function fillCategoryClone(clone, key) {
  const category = menuData[key];
  clone.querySelector("section").id = key;
  clone.querySelector(".menu-category__banner-img").src = category.banner;
  clone.querySelector(".menu-category__banner-img").alt = category.label;
  clone.querySelector(".menu-category__heading").textContent = category.label;
}

function fillCategoryItems(clone, key) {
  const list = clone.querySelector(".menu-list");
  const itemKeys = Object.keys(menuData[key].items);
  for (let j = 0; j < itemKeys.length; j++) {
    list.innerHTML += buildMenuItemHTML(menuData[key].items[itemKeys[j]]);
  }
}

function buildMenuCategories() {
  const container = document.getElementById("menu-categories");
  const tmpl = document.getElementById("tmpl-category");
  const keys = Object.keys(menuData);
  for (let i = 0; i < keys.length; i++) {
    const clone = tmpl.content.cloneNode(true);
    fillCategoryClone(clone, keys[i]);
    fillCategoryItems(clone, keys[i]);
    container.appendChild(clone);
  }
}


// ─── CART TEMPLATE ────────────────────────────

function setCartItemButtons(clone, item) {
  clone.querySelector(".cart__btn--minus").onclick  = function() { changeQuantity(item.id, -1); };
  clone.querySelector(".cart__btn--plus").onclick   = function() { changeQuantity(item.id,  1); };
  clone.querySelector(".cart__btn--delete").onclick = function() { removeItem(item.id); };
}

function buildCartItemElement(item) {
  const clone = document.getElementById("tmpl-cart-item").content.cloneNode(true);
  clone.querySelector(".cart__item-name").textContent     = item.name;
  clone.querySelector(".cart__item-quantity").textContent = item.quantity + "x";
  clone.querySelector(".cart__item-price").textContent    = (item.price * item.quantity).toFixed(2) + " €";
  setCartItemButtons(clone, item);
  return clone;
}


// ─── CART RENDER ──────────────────────────────

function buildSummaryHTML(subtotal) {
  let total = subtotal + deliveryCost;
  let html = "<div class='cart__summary-row'><span>Zwischensumme</span><span>" + subtotal.toFixed(2) + " €</span></div>";
  html += "<div class='cart__summary-row'><span>Lieferung</span><span>" + deliveryCost.toFixed(2) + " €</span></div>";
  html += "<div class='cart__summary-row cart__summary-row--total'><span>Gesamt</span><span>" + total.toFixed(2) + " €</span></div>";
  return html;
}

function calculateSubtotal() {
  let sum = 0;
  for (let i = 0; i < cart.length; i++) {
    sum += cart[i].price * cart[i].quantity;
  }
  return sum;
}

function fillCartList(listEl) {
  listEl.innerHTML = "";
  if (cart.length === 0) {
    listEl.innerHTML = "<li class='cart__empty'>Der Warenkorb ist leer.</li>";
    return;
  }
  for (let i = 0; i < cart.length; i++) {
    listEl.appendChild(buildCartItemElement(cart[i]));
  }
}

function renderCart() {
  const subtotal = calculateSubtotal();
  fillCartList(document.getElementById("cart__list"));
  fillCartList(document.getElementById("cart__list-mobile"));
  document.getElementById("cart__summary").innerHTML        = buildSummaryHTML(subtotal);
  document.getElementById("cart__summary-mobile").innerHTML = buildSummaryHTML(subtotal);
  updateMobileBar(subtotal);
}

function updateMobileBar(subtotal) {
  const totalEl = document.getElementById("cart-mobile-total");
  totalEl.textContent = cart.length === 0 ? "" : (subtotal + deliveryCost).toFixed(2) + " €";
}


// ─── CART LOGIC ───────────────────────────────

function findProduct(id) {
  const keys = Object.keys(menuData);
  for (let i = 0; i < keys.length; i++) {
    if (menuData[keys[i]].items[id]) return menuData[keys[i]].items[id];
  }
  return null;
}

function findCartItem(id) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) return cart[i];
  }
  return null;
}

function addToCart(id) {
  const product = findProduct(id);
  if (product === null) return;
  const existingItem = findCartItem(id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
  }
  renderCart();
}

function changeQuantity(id, delta) {
  const item = findCartItem(id);
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
    if (cart[i].id !== id) newCart.push(cart[i]);
  }
  cart = newCart;
  renderCart();
}


// ─── DIALOGS ──────────────────────────────────

function toggleDialog(dialogId, open) {
  const dialog = document.getElementById(dialogId);
  dialog.classList.toggle(dialogId + "--open", open);
  document.body.style.overflow = open ? "hidden" : "";
}

function placeOrder() {
  cart = [];
  renderCart();
  toggleDialog("cart-dialog", false);
  toggleDialog("order-dialog", true);
  setTimeout(function() { toggleDialog("order-dialog", false); }, 5000);
}


// ─── INIT ─────────────────────────────────────

function init() {
  buildCategoryNav();
  buildMenuCategories();
  renderCart();
}

document.addEventListener("DOMContentLoaded", init);
