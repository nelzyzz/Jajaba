// config.js
module.exports = {
  // Facebook App Credentials
  appSecret: 'your_app_secret',
  accessToken: 'your_page_access_token',
  verifyToken: 'pagebot',

  // Server Settings
  port: process.env.PORT || 3001,
  webhookPath: '/webhook',

  // Bot Settings
  greetingText: "Hello! I'm your friendly bot.",
  defaultResponse: "You said: {messageText}"
};
