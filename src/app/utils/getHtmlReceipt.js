const getHtmlReceipt = (form, cart) => {
  
  // Generate HTML for cart items
  const itemsHtml = cart.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">
            <img src="${item.image_url}" alt="Artwork Image" style="max-width: 100px; display: block; margin: 0 auto;" />
          </td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${item.name || "Artwork"}</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">$${item.price}</td>
        </tr>
      `
    )
    .join("");

  // Generate the complete HTML receipt
  const htmlReceipt = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Receipt from Your Art Business</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 700px;
          margin: 20px auto;
          background-color: #ffffff;
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h1, h2, h3 {
          text-align: center;
          color: #333;
        }
        p {
          color: #555;
          line-height: 1.2;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th {
          background-color: #f8f8f8;
          color: #333;
          text-align: left;
          padding: 10px;
          border: 1px solid #ddd;
        }
        td {
          padding: 10px;
          border: 1px solid #ddd;
        }
        .totals {
          text-align: left;
          margin-top: 20px;
          font-weight: bold;
          color: #333;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #888;
        }
        .footer a {
          color: #007BFF;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <h1>Your Art Business</h1>
        <h2>Receipt</h2>
        <p>Thank you for your purchase! Below are the details of your order:</p>

        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Item</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <p>Total Price: $${cart.totalPrice}</p>
        </div>

        <h3>Your shipping address:</h3>
        <p>
          <span>${form.firstName} ${form.lastName}</span>
        </p>
        <p>
          <a href="#" style="text-decoration: none; color: inherit; cursor: text;">${form.address}</a>
        </p>
        <p>
          <a href="#" style="text-decoration: none; color: inherit; cursor: text;">${form.city} ${form.state} ${form.zip}</a>
        </p>

        <h3>Your contact information: </h3>
        <p>
          <a href="#" style="text-decoration: none; color: inherit; cursor: text;">${form.email}</a></span>
        </p>
        
        <div class="footer">
          <p>If you have any questions about your order, feel free to <a href="/contact">contact us</a>.</p>
          <p>Thank you for supporting our art business!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return htmlReceipt;
};

module.exports = getHtmlReceipt;
