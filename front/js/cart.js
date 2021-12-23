async function getInfoWithId(i) {
  let idColorStr = localStorage.key(i);
  let idColorArray = idColorStr.split(",");
  let itemId = idColorArray[0];
  try {
    let response = await fetch(`http://localhost:3000/api/products/${itemId}`);
    return await response.json();
  } catch (error) {
    console.log("Error : " + error);
  }
}

function checkIfCartEmpty() {
  if (localStorage.length == 0) {
    document.getElementById("cart__items").innerHTML =
      "<p >Il n'y a pas encore de Kanap ici, visitez <a href='./index.html' style=' color:white; font-weight:700'>notre séléction</a>.</p>";
  }
}

(async function renderEachItem() {
  let htmlRender = "";
  const itemContainer = document.getElementById("cart__items");

  checkIfCartEmpty();

  for (let i = 0; i < localStorage.length; i++) {
    let item = await getInfoWithId(i);
    let htmlContent = `
		<article class="cart__item" data-id="${item._id}" data-color="${
      localStorage.key(i).split(",")[1]
    }" data-price="${item.price}">
			<div class="cart__item__img">
				<img src="${item.imageUrl}" alt="${item.altTxt}">
			</div>
			<div class="cart__item__content">
				<div class="cart__item__content__titlePrice">
					<h2>${item.name}</h2>
					<p>${item.price} €</p>
					<p>Coloris : ${localStorage.key(i).split(",")[1]}</p>
				</div>
				<div class="cart__item__content__settings">
					<div class="cart__item__content__settings__quantity">
						<p>Qté : </p>
						<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${localStorage.getItem(
              localStorage.key(i)
            )}">
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
  deleteItem();
  itemQuantityRefresh();
  totalItemInCartRefresh();
  totalPriceRefresh();
})();

function totalPriceRefresh() {
  let quantitySelector = document.querySelectorAll(".itemQuantity");
  let totalCartPrice = 0;
  for (let i = 0; i < quantitySelector.length; i++) {
    let articleDOM = quantitySelector[i].closest("article");
    let individualPrice = articleDOM.dataset.price;
    totalCartPrice += parseInt(quantitySelector[i].value) * individualPrice;
  }
  let totalPriceDisplay = document.getElementById("totalPrice");
  totalPriceDisplay.innerHTML = totalCartPrice;
}

function totalItemInCartRefresh() {
  let quantitySelector = document.querySelectorAll(".itemQuantity");
  let itemAmount = 0;
  for (let i = 0; i < quantitySelector.length; i++) {
    itemAmount += parseInt(quantitySelector[i].value);
  }
  const totalQuantityDisplay = document.getElementById("totalQuantity");
  totalQuantityDisplay.innerHTML = itemAmount;

  totalPriceRefresh();
  checkIfCartEmpty();
}

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

      localStorage.removeItem(localStorageKey, itemQuantity);
      articleDOM.remove();

      totalItemInCartRefresh();
    });
  }
}

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

      totalItemInCartRefresh();
    });
  }
}

class Form {
  constructor() {
    this.firstName = document.getElementById("firstName").value;
    this.lastName = document.getElementById("lastName").value;
    this.adress = document.getElementById("address").value;
    this.city = document.getElementById("city").value;
    this.email = document.getElementById("email").value;
  }
}

function userInputVerification() {
  const userForm = new Form();

  function firstNameValid() {
    const userFirstName = userForm.firstName;
    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
    if (/^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(userFirstName)) {
      firstNameErrorMsg.innerText = "";
      return true;
    } else {
      firstNameErrorMsg.innerText =
        "Votre prénom ne peut contenir que des lettres, de 3 à 20 caractères.";
    }
  }

  function lastNameValid() {
    const userLastName = userForm.lastName;
    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    if (/^[A-Za-z]{2,20}$/.test(userLastName)) {
      lastNameErrorMsg.innerText = "";
      return true;
    } else {
      lastNameErrorMsg.innerText =
        "Votre nom ne peut contenir que des lettres, de 2 à 20 caractères.";
    }
  }
 