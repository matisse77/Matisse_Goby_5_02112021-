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
