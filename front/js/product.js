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
    console.log("Error : " + error);
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
  const itemColor = document.getElementById("colors").value;
  const itemQuantity = document.getElementById("quantity").value;

  if (document.getElementById("colors").value === "") {
    alert("Il est nécessaire de choisir une couleur");
    return;
  }

  if (document.getElementById("quantity").value == 0) {
    alert("Il faut au moins ajouter un Kanap");
    return;
  }

  localStorage.setItem([idVerification(), itemColor], itemQuantity);
  window.location.href = "./cart.html";
});
