const fs = require('fs');

function encodeJsonToBase64(filePath) {
  try {
    const serviceAccount = fs.readFileSync(filePath, 'utf8');
    const encodedServiceAccount = Buffer.from(serviceAccount).toString('base64');
    return encodedServiceAccount;
  } catch (error) {
    console.error('Error encoding JSON:', error);
    return null;
  }
}

const filePath = 'c:\\Users\\ptros\\Downloads\\artwebsite-eebdb-firebase-adminsdk-flxft-17557960f3.json';

const encodedJson = encodeJsonToBase64(filePath);

if (encodedJson) {
  console.log(encodedJson); 
}