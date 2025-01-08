// receiptTemplate.js

const receiptTemplate = (order) => 
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Receipt from Buzzy Sweets</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f8f8;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 5px;
        }
        h1 {
          text-align: center;
          color: #333;
        }
        p {
          color: #555;
        }
        .details, .totals {
          margin-top: 20px;
        }
        .details th, .totals th {
          text-align: left;
        }
        .details td, .totals td {
          text-align: right;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }
        .totals {
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #777;
        }
        .cta {
          text-align: center;
          margin-top: 20px;
        }
        .cta a {
          text-decoration: none;
          background-color: #007BFF;
          color: #ffffff;
          padding: 10px 20px;
          border-radius: 5px;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <h1>Thank you for your order, Paul!</h1>
        <p>We appreciate your business. Below is your receipt for your recent purchase.</p>
        
        <table class="details">
          <tr>
            <th>Order ID:</th>
            <td>${order.id}</td>
          </tr>
          <tr>
            <th>Order Date:</th>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          </tr>
          <tr>
            <th>Reference ID:</th>
            <td>${order.referenceId}</td>
          </tr>
        </table>
        <h2>Order Details</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.lineItems
              .map(
                (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>$${(Number(item.totalMoney.amount)/100).toFixed(2)}</td>
            </tr>`
              )
              .join('')}
          </tbody>
        </table>
    
        <h2>Total</h2>
        <table class="totals">
          <tr>
            <th>Subtotal:</th>
            <td>$${(Number(order.netAmounts.totalMoney.amount)/100).toFixed(2)}</td>
          </tr>
          <tr>
            <th>Tax:</th>
            <td>$${(Number(order.totalTaxMoney.amount) / 100).toFixed(2)}</td>
          </tr>
          <tr>
            <th>Total:</th>
            <td>$${(Number(order.totalMoney.amount)/100).toFixed(2)}</td>
          </tr>
        </table>
    
        <div class="footer">
          <p>Payment Method: ${order.tenders[0].cardDetails.cardBrand} ending in ${order.tenders[0].cardDetails.card.last4}</p>
          <p>Transaction Status: ${order.tenders[0].cardDetails.status}</p>
          <p>If you have any questions, feel free to contact us at <a href="mailto:buzzysweets1@gmail.com">buzzysweets1@gmail.com</a>.</p>
        </div>
        <div class="footer">
          <p>Thank you for choosing Buzzy Sweets!</p>
        </div>
      </div>
    </body>
    </html>
    `;
    
    module.exports = receiptTemplate;
    