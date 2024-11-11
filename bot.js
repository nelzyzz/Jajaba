const config = require('./config');
const request = require('request');
const fs = require('fs');
const path = require('path');

class Bot {
  constructor(accessToken, verifyToken) {
    this.accessToken = accessToken;
    this.verifyToken = verifyToken;
    this.commands = {}; // Store commands here
    this.loadCommands(); // Load commands from the directory
  }

  // Load commands dynamically from the 'commands' folder
  loadCommands() {
    const commandsDir = path.join(__dirname, 'commands');
    fs.readdir(commandsDir, (err, files) => {
      if (err) {
        console.error("Error reading commands directory:", err);
        return;
      }

      files.forEach(file => {
        const commandName = path.parse(file).name;
        try {
          this.commands[commandName] = require(path.join(commandsDir, file));
          console.log(`Loaded command: ${commandName}`);
        } catch (loadError) {
          console.error(`Failed to load command '${commandName}':`, loadError);
        }
      });
    });
  }

  // Method to handle incoming messages
  processMessage(event) {
    const senderId = event.sender.id;
    const messageText = event.message.text;

    this.handleMessage(senderId, messageText);
  }

  // Method to handle postbacks
  processPostback(event) {
    const senderId = event.sender.id;
    const payload = event.postback.payload;

    this.handlePostback(senderId, payload);
  }

  // Handle messages separately
  handleMessage(senderId, messageText) {
    const command = this.extractCommand(messageText);

    if (command) {
      this.handleCommand(senderId, command);
    } else {
      this.sendMessage(senderId, config.defaultResponse.replace('{messageText}', messageText));
    }
  }

  // Extract the command from the user's message
  extractCommand(messageText) {
    const words = messageText.trim().toLowerCase().split(' ');
    return { command: words[0], args: words.slice(1) };
  }

  // Handle the command
  handleCommand(senderId, command) {
    if (this.commands[command.command]) { // Check if the command exists
      try {
        this.commands[command.command](senderId, command.args); // Call the command function
      } catch (execError) {
        console.error(`Error executing command '${command.command}':`, execError);
        this.sendMessage(senderId, 'An error occurred while processing your command.');
      }
    } else {
      this.sendMessage(senderId, 'Invalid command. Try "help" for a list of commands.');
    }
  }

  // Handle postbacks separately
  handlePostback(senderId, payload) {
    const responseText = `You clicked: ${payload}`;
    this.sendMessage(senderId, responseText);
  }

  // Helper method to send messages
  sendMessage(recipientId, messageText) {
    const messageData = {
      recipient: { id: recipientId },
      message: { text: messageText }
    };

    this.callFacebookAPI('POST', 'me/messages', messageData);
  }

  // Helper method to call the Facebook API
  callFacebookAPI(method, path, data) {
    request({
      uri: `https://graph.facebook.com/v10.0/${path}`,
      qs: { access_token: this.accessToken },
      method: method,
      json: data
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log('Message sent successfully:', body);
      } else {
        console.error('Error sending message:', error || body);
      }
    });
  }
}

// Export an instance of the Bot class
const bot = new Bot(config.accessToken, config.verifyToken);
module.exports = bot;
