// Loads the environment variables from the .env file
require('dotenv').load();

const
    builder = require('botbuilder'),
    bot = require('./ChatConnector'),
    spellService = require('./spell-service');

//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('None', require('./dialogNone'));
bot.dialog('Registrar', require('./dialogRegistrar'));
bot.dialog('Consultar', require('./dialogConsultar'));
bot.dialog('Bienvenida', require('./dialogBienvenida'));

// Spell Check
if (process.env.IS_SPELL_CORRECTION_ENABLED === 'true') {
    bot.use({
        botbuilder: (session, next) => {
            spellService
                .getCorrectedText(session.message.text)
                .then(text => {
                    session.message.text = text;
                    next();
                })
                .catch(error => {
                    console.error(error);
                    next();
                });
        }
    });
}