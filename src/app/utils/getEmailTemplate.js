const getEmailTemplate = (name, message, email) => 
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
        <h3>Contact Message:</h3>
        <h3>${message}</h3>
        <h3>From: ${name} ${email}</h3>
    </body>
    </html>
    `;
    
    module.exports = getEmailTemplate;