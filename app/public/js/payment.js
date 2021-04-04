// Display modal details
$(document).on('click', ".payment-btn", (event) => {
  $("#display-school").html(event.target.attributes.value.value)
  $("#display-appId").html(event.target.attributes.appId.value)
  $("#display-price").html(event.target.attributes.price.value)
})

function initPayPalButton() {
      var shipping = 0;
  var quantity = parseInt();
  var quantitySelect = document.querySelector("#smart-button-container #quantitySelect");
  if (!isNaN(quantity)) {
      quantitySelect.style.visibility = "visible";
  }
  var orderDescription = "Please choose the respective University's application fee";
  if(orderDescription === '') {
      orderDescription = 'Item';
  }
  paypal.Buttons({
      style: {
      shape: 'pill',
      color: 'gold',
      layout: 'vertical',
      label: 'paypal',
      
      },
      createOrder: function(data, actions) {
          var selectedItemDescription = $("#display-school").text();
          var selectedItemPrice = parseFloat($("#display-price").text());
          var tax = (0 === 0) ? 0 : (selectedItemPrice * (parseFloat(0)/100));
          if(quantitySelect.options.length > 0) {
              quantity = parseInt(quantitySelect.options[quantitySelect.selectedIndex].value);
          } else {
              quantity = 1;
      }

      tax *= quantity;
      tax = Math.round(tax * 100) / 100;
      var priceTotal = quantity * selectedItemPrice + parseFloat(shipping) + tax;
      priceTotal = Math.round(priceTotal * 100) / 100;
      var itemTotalValue = Math.round((selectedItemPrice * quantity) * 100) / 100;

      return actions.order.create({
          purchase_units: [{
          description: orderDescription,
          amount: {
              currency_code: 'SGD',
              value: priceTotal,
              breakdown: {
              item_total: {
                  currency_code: 'SGD',
                  value: itemTotalValue,
              },
              shipping: {
                  currency_code: 'SGD',
                  value: shipping,
              },
              tax_total: {
                  currency_code: 'SGD',
                  value: tax,
              }
              }
          },
          items: [{
              name: selectedItemDescription,
              unit_amount: {
              currency_code: 'SGD',
              value: selectedItemPrice,
              },
              quantity: quantity
          }]
          }]
      });
      },
      onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {

              alert('Transaction completed by ' + details.payer.name.given_name + '!');
              console.log(details);

              // Update applications database with PAID status
              try {
                  const appId = $("#display-appId").text()
                  const update_application_url = 'http://localhost:5001/application/'.concat(appId)
                  alert(update_application_url)
                  const fetchResponse = fetch(update_application_url, {method: 'PUT'});
                  window.location.href = "/applications";
              } catch (e) {
                  console.log(e);
              }    

          });
      },
      onError: function(err) {
          console.log(err);
      },
  }).render('#paypal-button-container');
  }
  initPayPalButton();