// Getting the order Id with the URL
function idRecuperation() {
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  if (searchParams.has("id")) {
    return searchParams.get("id");
  }

  console.error("Error, no order Id found");
}
window.addEventListener("load", () => {
  document.getElementById("orderId").innerText = idRecuperation();
});
