const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// 🔴 REEMPLAZAR ESTO
const TOKEN = "EAARP2SYt5OABQybczMQcQbU2ZB0UiNtGuVbWuOPGbgbjKvFrM5oDEk5EoYrYCAbND1ikJ5gOfFxZBViwaYgiUonPlEnbEr5JjiwEZAgFg9PHt6XMZBJJtOJc3YzuFtxTiwlz8ZCeGcIbcT5ctbCOYvA3F3ZCeIumUeYTDKFTArXddmI3NJGqRZAAjlyxolZCqZB4SsEYLWjelIe8gWnQ4xxkFSqDZCe0ZBApJlRDbxZB7QZCAfLwy6kRfapLzbSjzbWSWjZBrs5N2cV8Uyr2iDGmCXjQVT1h1z";
const PHONE_ID = "1992340554959841";

// ✅ Token de verificación (el mismo que pusiste en Meta)
const VERIFY_TOKEN = "mi_token_123";

// 👉 Verificación del webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// 👉 Recibir mensajes y responder
app.post("/webhook", async (req, res) => {
  try {
    const mensaje = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (mensaje) {
      const from = mensaje.from;

      await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: {
            body: "Hola 👋 te comunicaste con Convex.\n\n¿Te gustaría recibir más información? 😊"
          }
        })
      });
    }

    res.sendStatus(200);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("Servidor corriendo"));
