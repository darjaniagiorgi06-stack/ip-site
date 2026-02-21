const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = "8564801194:AAGZggRCK6K7TLGx7_PrDXvvHkTzgZnuQ1Q";
const CHAT_ID = "8245277854";

app.post("/visit", async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const geo = await axios.get(`https://ipapi.co/${ip}/json/`);

    const msg = `
🌍 ახალი ვიზიტორი

IP: ${ip}
ქვეყანა: ${geo.data.country_name}
ქალაქი: ${geo.data.city}
ISP: ${geo.data.org}
    `;

    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: msg
      }
    );

    res.json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ error: "error" });
  }
});

app.listen(3000, () => console.log("Server running"));