const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,

    async execute(member) {
        const welcomeChannel = member.guild.channels.cache.find(
            (channel) => channel.name === 'welcome'
        );

        if (welcomeChannel) {
            const welcomeEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`Welcome ${member.user.username}! 👋`)
                .setDescription(`Thank you for joining our server! Please read the <#${member.guild.channels.cache.find(channel => channel.name === '⟦rules⟧⟦📖⟧').id}>, then go to <#${member.guild.channels.cache.find(channel => channel.name === '⟦apply-here⟧⟦✍⟧').id}> to create a ticket!`)
                .setThumbnail('https://cdn.discordapp.com/icons/1087901910494875720/05de99400e063e41dcbe07104f19e50f.png')
                .addFields(
                    // { name: 'Regular field title', value: 'Some value here' },
                    { name: '\u200B', value: '\u200B' },
                )
                .setTimestamp()
                .setFooter({ text: 'WAR⚡ZEALOTS ALLIANCE • Welcoming' });

            const welcomeMessage = `${member.user.toString()} welcome to the WAR⚡ZEALOTS ALLIANCE!`;

            await welcomeChannel.send({ content: welcomeMessage, embeds: [welcomeEmbed] });
        }
    },
};
