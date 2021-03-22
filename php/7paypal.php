<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

    <!-- Paypal API -->
    <div id="smart-button-container">
        <div style="text-align: center;">
        <div id="paypal-button-container"></div>
        </div>
    </div>
    <script src="https://www.paypal.com/sdk/js?client-id=sb&currency=SGD" data-sdk-integration-source="button-factory"></script>
    <script>
        function initPayPalButton() {
        paypal.Buttons({
            style: {
            shape: 'pill',
            color: 'gold',
            layout: 'vertical',
            label: 'paypal',
            
            },

            createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{"description":"University Application Payment","amount":{"currency_code":"SGD","value":10}}]
            });
            },

            onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Transaction completed by ' + details.payer.name.given_name + '!');
            });
            },

            onError: function(err) {
            console.log(err);
            }
        }).render('#paypal-button-container');
        }
        initPayPalButton();
    </script>

</body>
</html>