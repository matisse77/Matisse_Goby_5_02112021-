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
