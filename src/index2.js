const { Client, IntentsBitField } = require('discord.js');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildsMembers,
        IntentsBitField.Flags.GuildsMessages,
        IntentsBitField.Flags.GuildsMessageContent,],
});

client.login("MTE3NDgwMTc4NDY0MDkxNzUyNAGNcrzVRD7SomxUxmiBkJfznFNGhcq6Sw2WREsGqREpbw");