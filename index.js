const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const TOKEN = "TU_TOKEN";
const PHONE_ID = "TU_PHONE_NUMBER_ID";

app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "mi_token_123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  const mensaje = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (mensaje) {
    const from = mensaje.from;
    const texto = mensaje.text?.body?.toLowerCase();

    if (texto && texto.includes("crear mi usuario")) {
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
            body: "Hola 👋 soy Sofi, tu cajera de Ganamos.\n\n¿Me dirías tu nombre o qué usuario te gustaría usar? 😊"
          }
        })
      });
    }
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Servidor corriendo"));
