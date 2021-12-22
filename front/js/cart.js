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
