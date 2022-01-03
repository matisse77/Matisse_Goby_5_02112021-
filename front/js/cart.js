/*** LOCAL STORAGE & DISPLAY ON CART PAGE ***/
const nameRegex =
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

// Get id from localStorage key(i)
async function getInfoWithId(i) {
  let idColorStr = localStorage.key(i);
  let idColorArray = idColorStr.split(",");
  let itemId = idColorArray[0];
  try {
    let response = await fetch(`http://localhost:3000/api/products/${itemId}`);
    return await response.json();
  } catch (error) {
    console.error("Error : " + error);
  }
}

// Empty cart verification
function checkIfCartEmpty() {
  if (localStorage.length == 0) {
    document.getElementById("cart__items").innerHTML =
      "<p >Il n'y a pas encore de Kanap ici, visitez <a href='./index.html' style=' color:white; font-weight:700'>notre séléction</a>.</p>";
  }
}

// Push dynamically each element on the HTML, then enable associate function to them
(async function renderEachItem() {
  let htmlRender = "";
  const itemContainer = document.getElementById("cart__items");
  // First check if cart is empty
  checkIfCartEmpty();
  // Else begin the loop
  for (let i = 0; i < localStorage.length; i++) {
    let item = await getInfoWithId(i);
    const itemColor = localStorage.key(i).split(",")[1];
    const itemQuantity = localStorage.getItem(localStorage.key(i));

    let htmlContent = `
		<article class="cart__item" data-id="${item._id}" data-color="${itemColor}" data-price="${item.price}">
			<div class="cart__item__img">
				<img src="${item.imageUrl}" alt="${item.altTxt}">
			</div>
			<div class="cart__item__content">
				<div class="cart__item__content__titlePrice">
					<h2>${item.name}</h2>
					<p>${item.price} €</p>
					<p>Coloris : ${itemColor}</p>
				</div>
				<div class="cart__item__content__settings">
					<div class="cart__item__content__settings__quantity">
						<p>Qté : </p>
						<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${itemQuantity}">
					</div>
					<div class="cart__item__content__settings__delete">
						<p class="deleteItem">Supprimer</p>
					</div>
				</div>
			</div>
		</article>
		`;
    htmlRender += htmlContent;
  }
  itemContainer.innerHTML += htmlRender;

  // Enable deleting item function
  deleteItem();
  // Enable quantity modification
  itemQuantityRefresh();
  // Initialise the amount total of article
  totalItemInCartRefresh();
  // Initialise the total price of the cart
  totalPriceRefresh();
})();

/*** ITEMS DATA MANIPULATION ***/

// Actualise the total price of the cart
function totalPriceRefresh() {
  let quantitySelector = document.querySelectorAll(".itemQuantity");
  let totalCartPrice = 0;
  for (let i = 0; i < quantitySelector.length; i++) {
    totalCartPrice +=
      parseInt(quantitySelector[i].value) *
      quantitySelector[i].closest("article").dataset.price;
  }
  let totalPriceDisplay = document.getElementById("totalPrice");
  totalPriceDisplay.innerHTML = totalCartPrice;
}

// Actualise the total amount of article in the cart
function totalItemInCartRefresh() {
  let quantitySelector = document.querySelectorAll(".itemQuantity");
  let itemAmount = 0;
  for (let i = 0; i < quantitySelector.length; i++) {
    itemAmount += parseInt(quantitySelector[i].value);
  }
  const totalQuantityDisplay = document.getElementById("totalQuantity");
  totalQuantityDisplay.innerHTML = itemAmount;

  // Call new total price function on change
  totalPriceRefresh();
  // Check if they'r is no article
  checkIfCartEmpty();
}

// Deleting item work on the DOM and localStorage
function deleteItem() {
  let deleteItemBtns = document.querySelectorAll(".deleteItem");
  for (let i = 0; i < deleteItemBtns.length; i++) {
    deleteItemBtns[i].addEventListener("click", (e) => {
      e.preventDefault();

      let articleDOM = deleteItemBtns[i].closest("article");
      let itemId = articleDOM.dataset.id;
      let itemColor = articleDOM.dataset.color;
      let itemQuantity = localStorage.getItem(localStorage.key(i));
      let localStorageKey = [itemId, itemColor];
      // Deleting in localStorage and in the DOM
      localStorage.removeItem(localStorageKey, itemQuantity);
      articleDOM.remove();

      // Actualising the total amount of item in the cart
      totalItemInCartRefresh();
    });
  }
}

// Modifying item quantity in total and localStorage
function itemQuantityRefresh() {
  let quantitySelector = document.querySelectorAll(".itemQuantity");
  for (let i = 0; i < quantitySelector.length; i++) {
    quantitySelector[i].addEventListener("change", (e) => {
      e.preventDefault();

      let articleDOM = quantitySelector[i].closest("article");
      let itemId = articleDOM.dataset.id;
      let itemColor = articleDOM.dataset.color;
      let localStorageKey = [itemId, itemColor];
      let itemQuantity = e.target.value;
      if (itemQuantity == 0) {
        alert("Il faut au moins ajouter un Kanap");
      }
      localStorage.setItem(localStorageKey, itemQuantity);

      // Actualising the total amount of article
      totalItemInCartRefresh();
    });
  }
}

/*** USER DATA MANIPULATION ***/

// Object for user input
class Form {
  constructor() {
    this.firstName = document.getElementById("firstName").value;
    this.lastName = document.getElementById("lastName").value;
    this.adress = document.getElementById("address").value;
    this.city = document.getElementById("city").value;
    this.email = document.getElementById("email").value;
  }
}

// Analysing user input with regex
function userInputVerification() {
  const userForm = new Form();
  // Firstname
  function firstNameValid() {
    const userFirstName = userForm.firstName;
    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
    if (nameRegex.test(userFirstName)) {
      firstNameErrorMsg.innerText = "";
      return true;
    } else {
      firstNameErrorMsg.innerText =
        "Votre prénom ne peut contenir que des lettres, de 1 à 40 caractères.";
    }
  }
  // Lastname
  function lastNameValid() {
    const userLastName = userForm.lastName;
    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    if (nameRegex.test(userLastName)) {
      lastNameErrorMsg.innerText = "";
      return true;
    } else {
      lastNameErrorMsg.innerText =
        "Votre nom ne peut contenir que des lettres, de 1 à 40 caractères.";
    }
  }
  // Adresse
  function adressValid() {
    const userAdress = userForm.adress;
    const addressErrorMsg = document.getElementById("addressErrorMsg");
    if (/[^§]{5,50}$/.test(userAdress)) {
      addressErrorMsg.innerText = "";
      return true;
    } else {
      addressErrorMsg.innerText = "L'adresse semble incorrect.";
    }
  }
  // City
  function cityValid() {
    const userCity = userForm.city;
    const cityErrorMsg = document.getElementById("cityErrorMsg");
    if (/^[A-Za-z]{2,20}$/.test(userCity)) {
      cityErrorMsg.innerText = "";
      return true;
    } else {
      cityErrorMsg.innerText =
        "La ville ne peut contenir que des lettres, de 2 à 20 caractères.";
    }
  }
  // Email
  function emailValid() {
    const userEmail = userForm.email;
    const emailErrorMsg = document.getElementById("emailErrorMsg");
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userEmail)) {
      emailErrorMsg.innerText = "";
      return true;
    } else {
      emailErrorMsg.innerText = "Il faut renseigner une adresse email valide.";
    }
  }

  if (
    firstNameValid() &&
    lastNameValid() &&
    adressValid() &&
    cityValid() &&
    emailValid()
  ) {
    return true;
  } else {
    console.log("Unvalid form input.");
  }
}

// Push cart products id in an array
function productToSend() {
  let userBasket = [];
  for (let i = 0; i < localStorage.length; i++) {
    let idColor = localStorage.key(i);
    let idColorArray = idColor.split(",");
    let id = idColorArray[0];
    userBasket.push(id);
  }
  return userBasket;
}

// Send info to the back if valid, request orderId
let userFormSubmit = document.getElementById("order");
userFormSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  if (userInputVerification()) {
    const products = productToSend();
    const toSend = {
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
      },
      products,
    };
    // POSTing on the API
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toSend),
    })
      // Storing order Id in the url
      .then((response) => response.json())
      .then((value) => {
        localStorage.clear();
        document.location.href = `./confirmation.html?id=${value.orderId}`;
      })
      .catch((error) => {
        console.log("Error: " + error);
      });
  }
});
