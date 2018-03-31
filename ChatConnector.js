// Loads the environment variables from the .env file
require('dotenv').load();

const botbuilder = require('botbuilder'),
    botbuilder_azure = require("botbuilder-azure"),
    restify = require('restify');

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log('%s listening to %s', server.name, server.url);
});

// Bot Storage
let tableName = 'botdata';
let azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
let tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create connector and listen for messages
const connector = new botbuilder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new botbuilder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//==============================================================
// Bot Setup. LUIS model. 'LUIS_MODEL_URL' environment variable
//==============================================================
const recognizer = new botbuilder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

const intents = new botbuilder.IntentDialog({ recognizers: [recognizer] });
intents
    .matches('None', 'None')
    .matches('Registrar', 'Registrar')
    .matches('Consultar', 'Consultar')
    .matches('Bienvenida', 'Bienvenida')
    .onDefault((session, results) => {
        session.send(`Lo siento, no entiendo: ${session.message.text}.`);
        session.beginDialog('/', results);
    });
bot.dialog('/', intents);

bot.on('conversationUpdate', message => {
    if (message.membersAdded) {
        message.membersAdded.forEach(identity => {
            if (identity.id === message.address.bot.id) {
                let reply = new botbuilder.Message()
                    .address(message.address)
                    .text('Hola! Puedo ayudarte con tu consulta.');
                bot.send(reply);
            }
        });
    }
});

module.exports = bot;