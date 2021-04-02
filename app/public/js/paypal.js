// Note: This is example code. Each server platform and programming language has a different way of handling requests, making HTTP API calls, and serving responses to the browser.

// 1. Set up your server to make calls to PayPal

// 1a. Add your client ID and secret
PAYPAL_CLIENT = 'AXpXwZyIVu2sOIqTaKWz2Qp1jfWZRcYET2PNB6WTJfNAP8pQHktzTj3hDts5bbez57eowOGGAEpxaMBn';
PAYPAL_SECRET = 'EM6Nh_z61DHWWHkmjGVi8DLS9bjSm-HyapJnLedsSn3ZyKmaJa9DB75dT2LseZArNXKNfyJrGv38cN0k';

// 1b. Point your server to the PayPal API
PAYPAL_OAUTH_API = 'https://api-m.sandbox.paypal.com/v1/oauth2/token/';
PAYPAL_ORDER_API = 'https://api-m.sandbox.paypal.com/v2/checkout/orders/';

// 1c. Get an access token from the PayPal API
basicAuth = base64encode(`${ PAYPAL_CLIENT }:${ PAYPAL_SECRET }`);
auth = http.post(PAYPAL_OAUTH_API {
  headers: {
    Accept:        `application/json`,
    Authorization: `Basic ${ basicAuth }`
  },
  data: `grant_type=client_credentials`
});

// 2. Set up your server to receive a call from the client
function handleRequest(request, response) {

  // 2a. Get the order ID from the request body
  orderID = request.body.orderID;

  // 3. Call PayPal to get the transaction details
  details = http.get(PAYPAL_ORDER_API + orderID, {
    headers: {
      Accept:        `application/json`,
      Authorization: `Bearer ${ auth.access_token }`
    }
  });

  // 4. Handle any errors from the call
  if (details.error) {
    return response.send(500);
  }

  // 5. Validate the transaction details are as expected
  if (details.purchase_units[0].amount.value !== '5.77') {
    return response.send(400);
  }

  // 6. Save the transaction in your database
  database.saveTransaction(orderID);

  // 7. Return a successful response to the client
  return response.send(200);
}

function onApprove(data) {
    return fetch('/my-server/get-paypal-transaction', {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        orderID: data.orderID
      })
    }).then(function(res) {
        console.log(res.json);
      return res.json();
    }).then(function(details) {
      alert('Transaction approved by ' + details.payer_given_name);
  
  }