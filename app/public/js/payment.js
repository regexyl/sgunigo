// Display modal details
// const IP_ADDRESS='http://192.168.137.172';
// const API_KEY_APPLICANT='AYuRJuTIMUUfqYAANsTGJlxX8YVkCwTT';

$(document).on('click', ".payment-btn", (event) => {
  $("#display-school").html(event.target.attributes.value.value)
  $("#display-appId").html(event.target.attributes.appId.value)
  $("#display-price").html(event.target.attributes.price.value)
})

// Get total price of all unpaid apps
let totalArr = []
$('.payment-btn').each(function() { 
    totalArr.push($(this).attr('price')); 
    console.log(`totalArr: ${totalArr}`)
});

$(document).on('click', ".payment-all-btn", (event) => {
    $("#display-school").html(event.target.attributes.value.value)

    let total = 0
    totalArr.forEach(uniPrice => total += Number(uniPrice))

    $("#display-price").html(total)
  })

let individualAppsOn = true

// Toggle between INDIVIDUAL PAYMENTS and PAY TOGETHER
$(document).on('click', "#switch", () => {
    if ($('#switch').is(':checked')) {
        $('#individualApps').hide()
        $('#allApps').show()
        individualAppsOn = false
    } else {
        $('#individualApps').show()
        $('#allApps').hide()
        individualAppsOn = true
    }
})

// Enable tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

// Paypal functions
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
                  if (individualAppsOn) {

                      console.log(`display-appId is ${$("#display-appId")}`)
                      const appId = $("#display-appId").text()
                      const update_application_url = IP_ADDRESS.concat(':8000/application/').concat(appId).concat('?apikey=').concat(API_KEY_APPLICANT);
                      alert(update_application_url)
                      const fetchResponse = fetch(update_application_url, {method: 'PUT'});

                  } else {

                    const userid = $('#userid').val()
                    console.log(`userid is ${userid}`)
                    const update_application_url = 'http://localhost:5001/application/all/'.concat(userid)
                    alert(`UPDATE ALL: ${update_application_url}`)

                    const fetchResponse = fetch(update_application_url, {method: 'PUT'});
                  }
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