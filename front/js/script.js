(function () {
  const itemsContainer = document.getElementById("items");

  async function retrieveAndDisplayProducts() {
    const response = await fetch("http://localhost:3000/api/products/");

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const products = await response.json();
    let productsDisplay = "";

    products.forEach(function (product) {
      productsDisplay += `
      <a href="./product.html?id=${product._id}">
        <article>
         <img src="${product.imageUrl}" alt="${product.altTxt}">
         <h3 class="productName">${product.name}</h3>
         <p class="productDescription">${product.description}</p>
       </article>
      </a>
    `;
    });

    itemsContainer.innerHTML = productsDisplay;
  }

  retrieveAndDisplayProducts();
})();
