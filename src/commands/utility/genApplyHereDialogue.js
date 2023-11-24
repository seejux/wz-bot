const { ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('genapplyheredialogue')
        .setDescription('Generate Apply Here Dialogue'),

    async execute(interaction) {
        // Generate the modal component with buttons below it
        const confirmButton = new ButtonBuilder()
            .setCustomId('mainClanInterestButton')
            .setEmoji('⚔️') // Custom emoji for crossed swords
            .setStyle(ButtonStyle.Secondary); // Secondary style (gray)

        const fwaButton = new ButtonBuilder()
            .setCustomId('fwaButton')
            .setEmoji('💎') // Custom emoji for gem
            .setStyle(ButtonStyle.Secondary); // Secondary style (gray)

        const helpButton = new ButtonBuilder()
            .setCustomId('helpButton')
            .setEmoji('❓') // Custom emoji for question
            .setStyle(ButtonStyle.Secondary); // Secondary style (gray)

        const row = new ActionRowBuilder()
            .addComponents([confirmButton, fwaButton, helpButton]);

        const channel = interaction.channel;

        await channel.send({
            content: null,
            embeds: [
                {
                    color: 0x0099FF,
                    title: 'War Zealots Recruitment',
                    description: 'Welcome to War Zealots! If you\'re interested in joining our clans, please click on the corresponding ticket options. For any assistance, please open a Help ticket' +
                        `\`\`\`\n${"⚔️ = Main Clan Interest\n"+ "💎 = FWA Clan Interest\n" +"❓ = Help Ticket"}\n\`\`\``,
                    fields: [
                        { name: '\u200B', value: '\u200B' }, // Empty field with zero-width spaces for spacing
                    ],
                    image: {
                        url: 'https://media.discordapp.net/attachments/786245848455315486/1127868279835344916/war_zealots.png', // Replace with the URL of your image
                    },
                },
            ],
            components: [row],
        });
        interaction.reply({ content: 'Dialogue generated successfully!', ephemeral: true });
    },
};
