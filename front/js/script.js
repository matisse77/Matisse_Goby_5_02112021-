// Get all the information from the API
async function getItems() {
  try {
    let response = await fetch('http://localhost:3000/api/products');
    return await response.json();
  } catch (error) {
    console.error('Error : ' + error);
  }
}

// Handle the render on the HTML
(async function renderItems() {
  const createElementWithClassAndContent = (tag, className, content) => {
    const element = document.createElement(tag);
    element.classList.add(className);
    element.appendChild(document.createTextNode(content));

    return element;
  };

  const items = await getItems();
  const itemsContainer = document.getElementById('items');

  items.forEach((item) => {
    const itemArticle = document.createElement('article');

    const itemImg = document.createElement('img');
    itemImg.setAttribute('src', item.imageUrl);
    itemImg.setAttribute('alt', item.altTxt);
    itemArticle.appendChild(itemImg);

    itemArticle.appendChild(
      createElementWithClassAndContent('h3', 'product-dame', item.name)
    );

    itemArticle.appendChild(
      createElementWithClassAndContent(
        'p',
        'product-description',
        item.description
      )
    );

    const itemContainer = document.createElement('a');
    itemContainer.href = `./product.html?id=${item._id}`;
    itemContainer.appendChild(itemArticle);

    itemsContainer.appendChild(itemContainer);
  });
})();
