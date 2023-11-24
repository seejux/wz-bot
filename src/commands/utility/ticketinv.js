const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord.js');

const CATEGORY = 'yet-another-bot-channel';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketinv')
        .setDescription('Invite any user to the ticket channel')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to invite to the ticket channel')
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('user');

    }
}