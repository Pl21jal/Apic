const fetch = require('node-fetch');

const TELEGRAM_BOT_TOKEN = '7887428382:AAEPSoJn_agWn17MEGEM43hStu-pmr6kC5Q';
const CHAT_ID = '7096229986';

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
      body: 'Missing base64 or filename',
    };
  }

  const fileBuffer = Buffer.from(base64, 'base64');

  const formData = new FormData();
  formData.append('chat_id', CHAT_ID);
  formData.append('caption', filename);
  formData.append('photo', new Blob([fileBuffer], { type: 'image/jpeg' }), filename);

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
    method: 'POST',
    body: formData,
  });

  const telegramResponse = await response.json();

  if (!telegramResponse.ok) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send photo to Telegram', telegramResponse }),
    };
  }

  // Ambil file_id untuk digunakan nanti
  const file_id = telegramResponse.result.photo.pop().file_id;

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Photo sent to Telegram', file_id }),
  };
};
