// Get all the information from the API
displayProducts();
async function getProducts() {
  return await fetch("http://localhost:3000/api/products")
    .then(function (res) {
      return res.json();
    })
    .then(function (value) {
      console.log(value);
      return value;
    })
    .catch(function (err) {
      console.error(err);
    });
}

// Handle the render on the HTML
async function displayProducts() {
  const parser = new DOMParser();
  const products = await getProducts();
  console.log("displayProducts", products);
  let productsSection = document.getElementById("items");
  for (i = 0; i < products.length; i++) {
    let productsItems = `
      <a href="./product.html?id=${products[i]._id}">
      <article>
      <img src="${products[i].imageUrl}" alt="${products[i].altTxt}">
      <h3 class="productName">${products[i].name}</h3>
      <p class="productDescription">${products[i].description}</p>
      </article> 
      </a>`;
    const displayShop = parser.parseFromString(productsItems, "text/html");
    productsSection.appendChild(displayShop.body.firstChild);
  }
}
