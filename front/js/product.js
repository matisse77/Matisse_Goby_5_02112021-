// Check for the Id parameter in URL
function idVerification() {
  let searchParams = new URLSearchParams(new URL(window.location.href).search);

  if (!searchParams.has("id")) {
    console.error("Error, no Id found in the URL!");
    return;
  }

  return searchParams.get("id");
}

// Only get the information for the specified product
async function getInfoById() {
  try {
    let response = await fetch(
      `http://localhost:3000/api/products/${idVerification()}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error : " + error);
  }
}

// Handle the render on the HTML
(async function renderItem() {
  const item = await getInfoById();

  document.querySelector(
    ".item__img"
  ).innerHTML += `<img src="${item.imageUrl}" alt="${item.altTxt}">`;
  document.getElementById("title").innerHTML += item.name;
  document.getElementById("price").innerHTML += item.price;
  document.getElementById("description").innerHTML += item.description;
  // Choice of item colors
  item.colors.forEach((color) => {
    let htmlContent = `<option value="${color}">${color}</option>`;
    document.getElementById("colors").innerHTML += htmlContent;
  });
})();

// Add to cart & localStorage
const addToCartBtn = document.getElementById("addToCart");
addToCartBtn.addEventListener("click", () => {
  addCurrentItemToCart();

  return redirectToCart();
});

const addCurrentItemToCart = () => {
  const item = {
    color: document.getElementById("colors").value,
    quantity: document.getElementById("quantity").value,
  };

  if (!validateItemColor(item.color)) {
    alert("Il est nécessaire de choisir une couleur");
    return;
  }

  if (!validateItemQuantity(item.quantity)) {
    alert("Il faut au moins ajouter un Kanap");
    return;
  }

  if (itemAlreadyExistsInCart(item)) {
    return updateExistingItem(item);
  }

  addItemInCart(item);
};

const validateItemColor = (color) => {
  return color !== "";
};

const validateItemQuantity = (itemQuantity) => {
  return itemQuantity > 0 && itemQuantity <= 100;
};

const itemAlreadyExistsInCart = (item) => {
  return localStorage.hasItem;
};

const updateExistingItem = () => {
  const sameItem = localStorage.get("...");

  const newQuantity =
    sameItem.quantity + document.getElementById("quantity").value;

  // Update
};

const addItemInCart = (item) => {
  localStorage.setItem([idVerification(), item.color], item.quantity);
};

const redirectToCart = () => {
  window.location.href = "./cart.html";
};
