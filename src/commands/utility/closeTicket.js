const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord.js');

const CATEGORY = 'yet-another-bot-channel';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close-ticket')
        .setDescription('Close a ticket channel')
        .addChannelOption(option => option.setName('channel_name').setDescription('The name of the ticket channel to close')),

    async execute(interaction) {
        // Check if the user has the "staff" role
        if (!interaction.member.roles.cache.some(role => role.name === 'staff')) {
            return interaction.reply('You do not have the required role to use this command.');
        }
        let channelName = ""
        if(interaction.options.getChannel('channel_name')){
            channelName = interaction.options.getChannel('channel_name').name;
        }
        
        console.log("channel name where command is run:" + interaction.channel.name)
        console.log("channel name provided by option", channelName)

        // If the channel_name option is not provided, use the current channel
        if (!channelName) {
            if (interaction.channel.parent?.name.toLowerCase() !== CATEGORY) {
                return interaction.reply('This command can only be used in channels under the "Tickets" category or provide Ticket channel name as option');
            }
            channelName = interaction.channel.name;
        }


        const ticketsCategory = interaction.guild.channels.cache.find(
            (category) => category.name.toLowerCase() === CATEGORY && category.type === ChannelType.GuildCategory
        );

        if (!ticketsCategory) {
            return interaction.reply('Tickets category not found!');
        }

        // console.log(ticketsCategory.guild.channels.cache)
        const ticketChannels = ticketsCategory.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildText);

        const channelToDelete = ticketChannels.find(
            (channel) => channel.name === channelName
        );

        if (!channelToDelete) {
            return interaction.reply('Ticket channel not found!');
        }

        try {
            await channelToDelete.delete();
            interaction.reply(`Ticket channel "${channelToDelete.name}" deleted successfully!`);
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while deleting the channel.');
        }
    },
};
