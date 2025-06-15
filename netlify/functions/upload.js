const fetch = require("node-fetch");
const FormData = require("form-data");

exports.handler = async (event) => {
  try {
    const body = event.body;
    const isBase64 = event.isBase64Encoded;

    // Ubah Buffer dari base64 (Shortcut iOS mengirim sebagai file binary base64)
    const buffer = Buffer.from(body, isBase64 ? "base64" : "utf8");

    // Kirim ke Telegram
    const form = new FormData();
    form.append("chat_id", "7096229986"); // Ganti dengan chat ID kamu
    form.append("photo", buffer, {
      filename: "image.jpg",
      contentType: "image/jpeg",
    });

    const telegramResponse = await fetch("https://api.telegram.org/bot7887428382:AAEPSoJn_agWn17MEGEM43hStu-pmr6kC5Q/sendPhoto", {
      method: "POST",
      body: form,
    });

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to send photo to Telegram", telegramResponse: telegramData }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Photo sent to Telegram",
        file_id: telegramData.result.photo.pop().file_id,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
