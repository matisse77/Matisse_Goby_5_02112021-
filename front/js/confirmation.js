// Getting the order Id with the URL
function idRecuperation() {
  let searchParams = new URLSearchParams(new URL(window.location.href).search);

  if (searchParams.has('id')) {
    let id = searchParams.get('id');
    return id;
  }
  console.error('Error, no order Id found');
  return '';
}
window.addEventListener('load', () => {
  document
    .getElementById('orderId')
    .appendChild(document.createTextNode(idRecuperation()));
});
