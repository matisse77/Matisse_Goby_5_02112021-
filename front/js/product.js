const MAX_ITEM_QUANTITY = 100;

// Check for the Id parameter in URL
function getId() {
  let searchParams = new URLSearchParams(new URL(window.location.href).search);

  if (!searchParams.has('id')) {
    console.error('Error, no Id found in the URL!');
    return;
  }

  return searchParams.get('id');
}

// Only get the information for the specified product
async function getInfoById() {
  try {
    let response = await fetch(`http://localhost:3000/api/products/${getId()}`);
    return await response.json();
  } catch (error) {
    console.error('Error : ' + error);
  }
}

// Handle the render on the HTML
(async function renderItem() {
  const item = await getInfoById();
  const img = document.createElement('img');
  img.setAttribute('src', item.imageUrl);
  img.setAttribute('alt', item.altTxt);
  document.querySelector('.item__img').appendChild(img);
  document
    .getElementById('title')
    .appendChild(document.createTextNode(item.name));
  document
    .getElementById('price')
    .appendChild(document.createTextNode(item.price));
  document
    .getElementById('description')
    .appendChild(document.createTextNode(item.description));
  // Choice of item colors
  const colorsSelect = document.getElementById('colors');
  item.colors.forEach((color) => {
    const colorOption = document.createElement('option');
    colorOption.setAttribute('value', color);
    colorOption.appendChild(document.createTextNode(color));
    colorsSelect.appendChild(colorOption);
  });
})();

// Add to cart & localStorage
const addToCartBtn = document.getElementById('addToCart');
addToCartBtn.addEventListener('click', () => {
  //localStorage.clear();
  addCurrentItemToCart();

  return redirectToCart();
});

const addCurrentItemToCart = () => {
  const item = {
    color: document.getElementById('colors').value,
    quantity: document.getElementById('quantity').value,
  };

  if (!validateItemColor(item.color)) {
    alert('Il est nécessaire de choisir une couleur');
    return;
  }

  if (!validateItemQuantity(item.quantity)) {
    return;
  }

  if (itemAlreadyExistsInCart(item.color)) {
    return updateExistingItem(item.quantity, item.color);
  }

  addItemInCart(item);
};

const validateItemColor = (color) => {
  return color !== '';
};

const validateItemQuantity = (itemQuantity) => {
  if (itemQuantity <= 0) {
    alert('Il faut au moins ajouter un Kanap');
    return false;
  }
  if (itemQuantity > MAX_ITEM_QUANTITY) {
    alert(`Le nombre de kanap ne doit pas dépasser ${MAX_ITEM_QUANTITY}`);
    return false;
  }
  return true;
};

const itemAlreadyExistsInCart = (color) => {
  const item = localStorage.getItem(getId() + color);
  console.log(item, color);
  if (item) {
    const itemColor = item.split(',')[0];
    return itemColor === color;
  }
  return false;
};

const updateExistingItem = (quantity, color) => {
  const sameItem = localStorage.getItem(getId() + color);
  const [sameItemColor, sameItemQuantity] = sameItem.split(',');
  let newQuantity = parseInt(sameItemQuantity) + parseInt(quantity);
  if (newQuantity > MAX_ITEM_QUANTITY) {
    alert(
      `Le nombre de kanap dans votre panier ne peut pas dépasser ${MAX_ITEM_QUANTITY}`
    );
    newQuantity = MAX_ITEM_QUANTITY;
  }

  localStorage.setItem(getId() + sameItemColor, [sameItemColor, newQuantity]);
};

const addItemInCart = (item) => {
  localStorage.setItem(getId() + item.color, [item.color, item.quantity]);
};

const redirectToCart = () => {
  window.location.href = './cart.html';
};
