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
      4: { id: 4, name: "Pizzabrötchen",  description: "mit Käse und Knoblauch",  price: 12.90 },
      5: { id: 5, name: "Knoblauchbrot",  description: "mit Butter und Kräutern", price: 3.50  },
      6: { id: 6, name: "Dip Auswahl",    description: "Ketchup, Mayo oder BBQ",  price: 1.50  },
    }
  },
  getraenke: {
    label: "Getränke",
    banner: "./assets/img/21_italian_57.avif",
    items: {
      7: { id: 7, name: "Cola 0,5l",        description: "eisgekühlt",             price: 2.50 },
      8: { id: 8, name: "Wasser 0,5l",      description: "still oder sprudelnd",   price: 1.90 },
      9: { id: 9, name: "Orangensaft 0,3l", description: "frisch gepresst",        price: 3.20 },
    }
  }
};


let cart = [];
const deliveryCost = 1.99;



function buildCategoryNav() {
  let navHTML = "";
  let isFirst = true;
  let keys = Object.keys(menuData);

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let activeClass = "";

    if (isFirst) {
      activeClass = " category-nav__link--active";
      isFirst = false;
    }

    navHTML += "<a class='category-nav__link" + activeClass + "' href='#" + key + "'>";
    navHTML += menuData[key].label;
    navHTML += "</a>";
  }

  document.getElementById("category-nav").innerHTML = navHTML;
}



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



function buildMenuCategories() {
  let categoriesHTML = "";
  let keys = Object.keys(menuData);

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let category = menuData[key];

    categoriesHTML += "<section class='menu-category' id='" + key + "'>";
    categoriesHTML += "<div class='menu-category__banner'>";
    categoriesHTML += "<img class='menu-category__banner-img' src='" + category.banner + "' alt='" + category.label + "'>";
    categoriesHTML += "</div>";
    categoriesHTML += "<h2 class='menu-category__heading'>" + category.label + "</h2>";
    categoriesHTML += "<ul class='menu-list'>";

    let itemKeys = Object.keys(category.items);
    for (let j = 0; j < itemKeys.length; j++) {
      let itemKey = itemKeys[j];
      categoriesHTML += buildMenuItemHTML(category.items[itemKey]);
    }

    categoriesHTML += "</ul></section>";
  }

  document.getElementById("menu-categories").innerHTML = categoriesHTML;
}



function buildCartItemHTML(item) {
  let html = "<li class='cart__item'>";
  html += "<span class='cart__item-name'>" + item.name + "</span>";
  html += "<div class='cart__item-controls'>";
  html += "<button class='cart__btn' onclick='changeQuantity(" + item.id + ", -1)'>-</button>";
  html += "<span class='cart__item-quantity'>" + item.quantity + "x</span>";
  html += "<button class='cart__btn' onclick='changeQuantity(" + item.id + ", 1)'>+</button>";
  html += "<button class='cart__btn cart__btn--delete' onclick='removeItem(" + item.id + ")'>🗑</button>";
  html += "</div>";
  html += "<span class='cart__item-price'>" + (item.price * item.quantity).toFixed(2) + " €</span>";
  html += "</li>";
  return html;
}



function buildSummaryHTML(subtotal) {
  let total = subtotal + deliveryCost;
  let html = "";
  html += "<div class='cart__summary-row'><span>Zwischensumme</span><span>" + subtotal.toFixed(2) + " €</span></div>";
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



function renderCart() {
  let itemsHTML = "";
  let subtotal = calculateSubtotal();

  if (cart.length === 0) {
    itemsHTML = "<li class='cart__empty'>Der Warenkorb ist leer.</li>";
  } else {
    for (let i = 0; i < cart.length; i++) {
      itemsHTML += buildCartItemHTML(cart[i]);
    }
  }

  document.getElementById("cart__list").innerHTML = itemsHTML;
  document.getElementById("cart__summary").innerHTML = buildSummaryHTML(subtotal);
  document.getElementById("cart__list-mobile").innerHTML = itemsHTML;
  document.getElementById("cart__summary-mobile").innerHTML = buildSummaryHTML(subtotal);

  updateMobileBar(subtotal);
}



function updateMobileBar(subtotal) {
  let totalEl = document.getElementById("cart-mobile-total");
  if (cart.length === 0) {
    totalEl.textContent = "";
  } else {
    totalEl.textContent = (subtotal + deliveryCost).toFixed(2) + " €";
  }
}



function addToCart(id) {
  let product = null;
  let keys = Object.keys(menuData);

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (menuData[key].items[id]) {
      product = menuData[key].items[id];
    }
  }

  if (product === null) return;

  let existingItem = null;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      existingItem = cart[i];
    }
  }

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
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



function placeOrder() {
  cart = [];
  renderCart();
  toggleDialog('cart-dialog', false);
  toggleDialog('order-dialog', true);

  setTimeout(function() {
    toggleDialog('order-dialog', false);
  }, 5000);
}

function toggleDialog(dialogId, open) {
  const dialog = document.getElementById(dialogId);
  dialog.classList.toggle(`${dialogId}--open`, open);
  document.body.style.overflow = open ? 'hidden' : '';
}




function init() {
  buildCategoryNav();
  buildMenuCategories();
  renderCart();
}

document.addEventListener('DOMContentLoaded', init);
