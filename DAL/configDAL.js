var config = {}

config.host = process.env.HOST || "https://interdbbot.documents.azure.com:443/";
config.authKey = process.env.AUTH_KEY || "ZkZzbLb5ohpi6OZKYsA2P9qXdYo1TdY1sxBzNB4lP6Sj0BTFtFhMFoEtcxZFAHXKEeMAmRnJQDUEWQ76wfMsVQ==";
config.databaseId = "InterBotDB";

module.exports = config;