// config.js
module.exports = {
  // Facebook App Credentials
  appSecret: '4e2a448bb5e5a9494670d34b07213a8e',
  accessToken: 'EAAZAla0AZCCdUBO9oagE7xRRICf3E1KQ2GmZCfKZAFb1tOb7MZBfFw21EYcbZBH36i5JTX0oeUcn6ruZAGjtqyeZA0dAMyhln7WHK78KZBd1cbqqtV8XEIDD8xZAQTCpr03hDa8UOv3R2506ACC3tbvfr4QDHFmQkakfrEof50MjcZAxaLEHwWTIJ3vVggrwb0aY36kuQZDZD',
  verifyToken: 'pagebot',

  // Server Settings
  port: process.env.PORT || 3001,
  webhookPath: '/webhook',

  // Bot Settings
  greetingText: "Hello! I'm your friendly bot.",
  defaultResponse: "You said: {messageText}"
};
