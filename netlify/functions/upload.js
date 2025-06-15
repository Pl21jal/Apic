const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const body = JSON.parse(event.body);

  const { base64, filename } = body;

  if (!base64 || !filename) {
    return {
      statusCode: 400,
      body: 'Missing data',
    };
  }

  const buffer = Buffer.from(base64, 'base64');

  const filePath = path.join('/tmp', filename);
  fs.writeFileSync(filePath, buffer);

  // Balas berhasil
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'File received', filename }),
  };
};
