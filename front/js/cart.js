/*** LOCAL STORAGE & DISPLAY ON CART PAGE ***/
const NameRegex =
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
// Get id from localStorage key
async function getInfoWithId(id) {
  try {
    let response = await fetch(`http://localhost:3000/api/products/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error : ' + error);
  }
}

// Empty cart verification
function checkIfCartEmpty() {
  if (localStorage.length === 0) {
    const cartItems = document.getElementById('cart__items');
    cartItems.replaceChildren();
    const cartP = document.createElement('p');
    cartP.appendChild(
      document.createTextNode(`Il n'y a pas encore de Kanap ici, visitez `)
    );
    const cartA = document.createElement('a');
    cartA.setAttribute('href', './index.html');
    cartA.style.color = 'white';
    cartA.style['font-weight'] = '700';
    cartA.appendChild(document.createTextNode('notre séléction'));
    cartP.appendChild(cartA);
    console.log(cartItems);
    cartItems.appendChild(cartP);
    console.log(cartItems);
  }
}

// Push dynamically each element on the HTML, then enable associate function to them
(async function renderEachItem() {
  const itemContainer = document.getElementById('cart__items');
  // First check if cart is empty
  checkIfCartEmpty();
  //
  const allIds = Object.keys(localStorage);
  // Else begin the loop
  for (let i = 0; i < allIds.length; i++) {
    // id du local storage
    let idStorage = allIds[i];
    const [itemColor, itemQuantity] = localStorage
      .getItem(idStorage)
      .split(',');
    const realId = idStorage.replace(itemColor, '');
    let item = await getInfoWithId(realId);

    // create article
    const itemArticle = document.createElement('article');
    // add class to article
    itemArticle.classList.add('cart__item');
    // add atributes to article
    itemArticle.setAttribute('data-id', item._id);
    itemArticle.setAttribute('data-color', itemColor);
    itemArticle.setAttribute('data-price', item.price);

    // create div of img
    const divItemImg = document.createElement('div');
    divItemImg.classList.add('cart__item__img');
    // create img
    const itemImg = document.createElement('img');
    itemImg.setAttribute('src', item.imageUrl);
    itemImg.setAttribute('alt', item.altTxt);
    // set itemImg as child of divItemImg
    divItemImg.appendChild(itemImg);
    // set divItemImg as child of itemArticle
    itemArticle.appendChild(divItemImg);

    // create div of itemContent
    const itemContent = document.createElement('div');
    itemContent.classList.add('cart__item__content');
    // set itemContent as child itemArticle
    itemArticle.appendChild(itemContent);

    // create div for descritpion
    const divDesc = document.createElement('div');
    divDesc.classList.add('cart__item__content__description');
    // create h2
    const itemName = document.createElement('h2');
    itemName.appendChild(document.createTextNode(item.name));
    // create coloris
    const itemColoris = document.createElement('p');
    itemColoris.appendChild(document.createTextNode(itemColor));
    // create price
    const itemPrice = document.createElement('p');
    itemPrice.appendChild(document.createTextNode(`${item.price} €`));
    // set attributes to divDesc
    divDesc.appendChild(itemName);
    divDesc.appendChild(itemPrice);
    divDesc.appendChild(itemColoris);
    // set itemName as child of divTitlePrice
    itemContent.appendChild(divDesc);

    // create div for settings
    const divSet = document.createElement('div');
    divSet.classList.add('cart__item__content__settings');
    // create div settings quantity
    const divSetQuant = document.createElement('div');
    divSetQuant.classList.add('cart__item__content__settings__quantity');
    // create p
    const itemP = document.createElement('p');
    itemP.appendChild(document.createTextNode('Qté : '));
    // create input
    const itemInput = document.createElement('input');
    itemInput.setAttribute('type', 'number');
    itemInput.classList.add('item-quantity');
    itemInput.setAttribute('min', 1);
    itemInput.setAttribute('max', 100);
    itemInput.setAttribute('value', itemQuantity);
    // set attributes
    divSetQuant.appendChild(itemP);
    divSetQuant.appendChild(itemInput);
    // set divSetQuant as child of divSet
    divSet.appendChild(divSetQuant);

    // create div for settings delete
    const divSetDel = document.createElement('div');
    divSetDel.classList.add('cart__item__content__settings__delete');
    // create p
    const itemsP = document.createElement('p');
    itemsP.classList.add('delete-item');
    itemsP.appendChild(document.createTextNode('Supprimer'));
    // set itemsP as child of divSetDel
    divSetDel.appendChild(itemsP);
    // set divSetDel as child of divSet
    divSet.appendChild(divSetDel);

    // set divSet as a child of itemContent
    itemContent.appendChild(divSet);

    // set itemContent as a child of itemArticle
    itemArticle.appendChild(itemContent);
    itemContainer.appendChild(itemArticle);
  }
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
async function totalPriceRefresh() {
  let totalCartPrice = 0;
  const allIds = Object.keys(localStorage);
  // Else begin the loop
  for (let i = 0; i < allIds.length; i++) {
    // id du local storage
    let idStorage = allIds[i];
    const [itemColor, itemQuantity] = localStorage
      .getItem(idStorage)
      .split(',');
    const realId = idStorage.replace(itemColor, '');
    let item = await getInfoWithId(realId);
    totalCartPrice += parseInt(itemQuantity) * item.price;
  }
  const totalPrice = document.getElementById('totalPrice');
  // Delete children (current price if existing) to avoid concatenation of the prices
  totalPrice.replaceChildren();
  totalPrice.appendChild(document.createTextNode(totalCartPrice));
}

// Actualise the total amount of article in the cart
async function totalItemInCartRefresh() {
  let itemAmount = 0;
  const allIds = Object.keys(localStorage);
  for (let i = 0; i < allIds.length; i++) {
    let idStorage = allIds[i];
    const itemQuantity = localStorage.getItem(idStorage).split(',')[1];
    itemAmount += parseInt(itemQuantity);
  }
  const totalQuantity = document.getElementById('totalQuantity');
  // Delete children (current articles if existing) to avoid concatenation of the articles
  totalQuantity.replaceChildren();
  totalQuantity.appendChild(document.createTextNode(itemAmount));

  // Call new total price function on change
  totalPriceRefresh();
  // Check if they'r is no article
  checkIfCartEmpty();
}

// Deleting item work on the DOM and localStorage
function deleteItem() {
  let deleteItemBtns = document.getElementsByClassName('delete-item');
  for (let i = 0; i < deleteItemBtns.length; i++) {
    deleteItemBtns[i].addEventListener('click', (e) => {
      e.preventDefault();

      let articleDOM = deleteItemBtns[i].closest('article');
      let itemId = articleDOM.dataset.id;
      let itemColor = articleDOM.dataset.color;
      // Deleting in localStorage and in the DOM
      localStorage.removeItem(itemId + itemColor);
      articleDOM.remove();

      // Actualising the total amount of item in the cart
      totalItemInCartRefresh();
    });
  }
}

// Modifying item quantity in total and localStorage
function itemQuantityRefresh() {
  let quantitySelector = document.getElementsByClassName('item-quantity');
  for (let i = 0; i < quantitySelector.length; i++) {
    quantitySelector[i].addEventListener('change', (e) => {
      e.preventDefault();

      let articleDOM = quantitySelector[i].closest('article');
      let itemId = articleDOM.dataset.id;
      let itemColor = articleDOM.dataset.color;
      let localStorageKey = itemId + itemColor;
      let itemQuantity = e.target.value;
      if (itemQuantity == 0) {
        alert('Il faut au moins ajouter un Kanap');
      }
      localStorage.setItem(localStorageKey, [itemColor, itemQuantity]);

      // Actualising the total amount of article
      totalItemInCartRefresh();
    });
  }
}

/*** USER DATA MANIPULATION ***/

// Object for user input
class Form {
  constructor() {
    this.firstName = document.getElementById('firstName').value;
    this.lastName = document.getElementById('lastName').value;
    this.adress = document.getElementById('address').value;
    this.city = document.getElementById('city').value;
    this.email = document.getElementById('email').value;
  }
}

// Analysing user input with regex
function userInputVerification() {
  const userForm = new Form();
  // Firstname
  function firstNameValid() {
    const userFirstName = userForm.firstName;
    const firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
    if (NameRegex.test(userFirstName)) {
      firstNameErrorMsg.replaceChildren();
      return true;
    }
    firstNameErrorMsg.appendChild(
      document.createTextNode(
        'Votre prénom ne peut contenir que des lettres, de 3 à 20 caractères.'
      )
    );
  }
  // Lastname
  function lastNameValid() {
    const userLastName = userForm.lastName;
    const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
    if (NameRegex.test(userLastName)) {
      lastNameErrorMsg.replaceChildren();
      return true;
    }
    lastNameErrorMsg.appendChild(
      document.createTextNode(
        'Votre nom ne peut contenir que des lettres, de 2 à 20 caractères.'
      )
    );
  }
  // Adresse
  function adressValid() {
    const userAdress = userForm.adress;
    const addressErrorMsg = document.getElementById('addressErrorMsg');
    if (/[^§]{5,50}$/.test(userAdress)) {
      addressErrorMsg.replaceChildren();
      return true;
    }
    addressErrorMsg.appendChild(
      document.createTextNode("L'adresse semble incorrect.")
    );
  }
  // City
  function cityValid() {
    const userCity = userForm.city;
    const cityErrorMsg = document.getElementById('cityErrorMsg');
    if (/^[A-Za-z]{2,20}$/.test(userCity)) {
      cityErrorMsg.replaceChildren();
      return true;
    }
    cityErrorMsg.appendChild(
      document.createTextNode(
        'La ville ne peut contenir que des lettres, de 2 à 20 caractères.'
      )
    );
  }
  // Email
  function emailValid() {
    const userEmail = userForm.email;
    const emailErrorMsg = document.getElementById('emailErrorMsg');
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userEmail)) {
      emailErrorMsg.replaceChildren();
      return true;
    }
    emailErrorMsg.appendChild(
      document.createTextNode('Il faut renseigner une adresse email valide.')
    );
  }

  return (
    (firstNameValid() &&
      lastNameValid() &&
      adressValid() &&
      cityValid() &&
      emailValid()) ||
    console.error('Unvalid form input.')
  );
}

// Push cart products id in an array
function productToSend() {
  return Object.keys(localStorage).map((id) => {
    return id.replace(localStorage[id].split(',')[0], '');
  });
}

// Send info to the back if valid, request orderId
let userFormSubmit = document.getElementById('order');
userFormSubmit.addEventListener('click', (e) => {
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
    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
        console.error('Error: ' + error);
      });
  }
});
