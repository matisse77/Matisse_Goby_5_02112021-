// Get Id
const str = window.location;
const url = new URL(str);
const productId = url.searchParams.get("id");
const objectURL = "http://localhost:3000/api/products/" + productId;

// Add product in cart
function addToCart(productItem) {
  let cartItems = localStorage.getItem("cartItems");
  // If cart empty
  if (cartItems === null) {
    let items = [productItem];
    console.log(items);
    let itemsStr = JSON.stringify(items);
    localStorage.setItem("cartItems", itemsStr);
    alert("Produit ajouté au panier !");
  } else {
    // If product in cart with the same id and color
    let items = JSON.parse(cartItems);
    const resultat = items.find((product) => {
      if (product.id === productItem.id && product.color === productItem.color)
        return true;

      return false;
    });

    if (resultat != undefined) {
      items = items.map((item, index) => {
        if (item.id === productItem.id && item.color === productItem.color) {
          item.quantity += productItem.quantity;
        }

        return item;
      });
    } else {
      // If cart had different product
      items.push(productItem);
    }
    let itemsStr = JSON.stringify(items);
    localStorage.setItem("cartItems", itemsStr);
    alert("Produit ajouté au panier !");
  }
}

// Get all the information from the API
function displayProduct() {
  fetch("http://localhost:3000/api/products/" + productId)
    .then(function (res) {
      return res.json();
    })
    .catch((err) => {
      console.error("erreur");
    })

    // Handle the render on the HTML
    .then(function (getProduct) {
      const product = getProduct;

      let productTitle = document.querySelector("title");
      productTitle.textContent = `${product.name}`;

      let productImg = document.createElement("img");
      document.querySelector(".item__img").appendChild(productImg);
      productImg.setAttribute("src", `${product.imageUrl}`);
      productImg.setAttribute("alt", `${product.altTxt}`);

      let productName = document.getElementById("title");
      productName.textContent = `${product.name}`;

      let productPrice = document.getElementById("price");
      productPrice.textContent = `${product.price}`;

      let productDescription = document.getElementById("description");
      productDescription.textContent = `${product.description}`;

      document.querySelector("#colors").insertAdjacentHTML(
        "beforeend",
        product.colors.map(
          (color) =>
            `<option id= "valueColor" value="${color}">${color}</option>`
        )
      );
    });

  // Listen to the event on the add to cart button
  const cartButton = document.getElementById("addToCart");
  cartButton.addEventListener("click", (event) => {
    event.preventDefault();
    let productColor = document.getElementById("colors").value;
    let productQuantity = parseInt(document.getElementById("quantity").value);
    // If no colour chosen
    if (productColor == "") {
      alert("Veuillez sélectionner une couleur");
      return;
    }
    // If quantity = 0
    if (productQuantity == 0) {
      alert("Veuillez renseigner une quantité");
      return;
    } else if (productQuantity > 100) {
      alert("La quantité maximale autorisée est de 100");
      return;
    }
    // Creation of array containing the id, color, quantity
    const productOptions = {
      id: productId,
      color: productColor,
      quantity: productQuantity,
    };
    addToCart(productOptions);
  });
}
displayProduct();
