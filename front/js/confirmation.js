// Get orderId
const params = new URL(document.location).searchParams;
const orderId = params.get("orderId");

// Order number display
document.getElementById("orderId").textContent = orderId;
