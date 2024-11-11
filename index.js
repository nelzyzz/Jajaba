// index.js
const express = require('express');
const bodyParser = require('body-parser');
const bot = require('./bot'); // Import the bot logic
const config = require('./config'); // Import the config file
require('dotenv').config(); // Load environment variables

const app = express();
app.use(bodyParser.json());

// Webhook verification
app.get(config.webhookPath, (req, res) => {
  if (req.query['hub.verify_token'] === config.verifyToken) {
    return res.send(req.query['hub.challenge']);
  }
  res.send('Invalid verify token');
});

// Handle incoming messages from Facebook
app.post(config.webhookPath, (req, res) => {
  // Handle the webhook request
  const body = req.body;
  if (body.object === 'page') {
    body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message) {
          bot.processMessage(event);
        } else if (event.postback) {
          bot.processPostback(event);
        }
      });
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Start the server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});