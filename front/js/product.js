function idVerification() {
  let url = new URL(window.location.href);
  let searchParams = new URLSearchParams(url.search);
  if (searchParams.has("id")) {
    let id = searchParams.get("id");
    return id;
  } else {
    console.log("Error, no Id found in the URL");
  }
}

async function getInfoById() {
  let id = idVerification();
  try {
    let response = await fetch(`http://localhost:3000/api/products/${id}`);
    return await response.json();
  } catch (error) {
    console.log("Error : " + error);
  }
}

(async function renderItem() {
  let item = await getInfoById();
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
