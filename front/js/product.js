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
