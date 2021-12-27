function idVerification() {
  let searchParams = new URLSearchParams(new URL(window.location.href).search);

  if (!searchParams.has("id")) {
    console.error("Error, no Id found in the URL!");
    return;
  }

  return searchParams.get("id");
}

async function getInfoById() {
  let id = idVerification();
  try {
    let response = await fetch(
      `http://localhost:3000/api/products/${idVerification()}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error : " + error);
  }
}

(async function renderItem() {
  const item = await getInfoById();

  document.querySelector(
    ".item__img"
  ).innerHTML += `<img src="${item.imageUrl}" alt="${item.altTxt}">`;
  document.getElementById("title").innerHTML += item.name;
  document.getElementById("price").innerHTML += item.price;
  document.getElementById("description").innerHTML += item.description;

  item.colors.forEach((color) => {
    let htmlContent = `<option value="${color}">${color}</option>`;
    document.getElementById("colors").innerHTML += htmlContent;
  });
})();

const addToCartBtn = document.getElementById("addToCart");
addToCartBtn.addEventListener("click", () => {
  if (document.getElementById("colors").value === "") {
    alert("Il est nécessaire de choisir une couleur");
    return;
  }

  if (document.getElementById("quantity") == 0) {
    alert("Il faut au moins ajouter un Kanap");
    return;
  }

  localStorage.setItem([itemId, itemColor], itemQuantity);
  window.location.href = "./cart.html";
});
