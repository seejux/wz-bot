const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { getClanWarStats } = require('../../api/getClanWarStats');

function calculateRemainingTime(currentTime, endTime) {
    console.log('Current Time:', currentTime);
    console.log('End Time:', endTime);

    // Convert endTime to a string
    const endTimeString = endTime.toString();

    // Parse the endTime from the JSON response
    const parsedEndTime = Date.parse(endTimeString.replace(/-/g, '/').replace('T', ' ').replace(/\.\d+/, ''));
    console.log('Parsed End Time:', parsedEndTime);

    const remainingMilliseconds = parsedEndTime - currentTime;
    console.log('Remaining Milliseconds:', remainingMilliseconds);

    const remainingHours = Math.floor(remainingMilliseconds / 3600000);
    console.log('Remaining Hours:', remainingHours);

    const remainingMinutes = Math.floor((remainingMilliseconds % 3600000) / 60000);
    console.log('Remaining Minutes:', remainingMinutes);

    return `${remainingHours} hours ${remainingMinutes} minutes`;
}



module.exports = {
    data: new SlashCommandBuilder()
        .setName('clanwarstats')
        .setDescription('Get war stats for a clan.')
        .addStringOption(option =>
            option.setName('clantag')
                .setDescription('The clan tag for which to get war stats.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const clanTag = interaction.options.getString('clantag');

        if (!clanTag) {
            return interaction.reply('Please provide a valid clan tag.');
        }

        try {
            const data = await getClanWarStats(clanTag);
            const currentTime = new Date();
            const endTime = new Date(data.endTime);
            const remainingTime = calculateRemainingTime(currentTime, endTime);



            // Create an embed with war stats
            const embed = new EmbedBuilder()
                .setTitle(`War Stats for ${data.clan.name}`)
                .setDescription(`Remaining Time: ${remainingTime}`)
                .setColor('#0099ff') // Set the color as you like
                .addFields(
                    // Add general information fields here
                    { name: 'Team Size', value: `👥 ${data.teamSize}`, inline: true },
                    // Add other general information fields here
                    ...data.clan.members.slice(0, 5).map(member => ({
                        name: `Member: ${member.name}`,
                        value: `Townhall Level: ${member.townhallLevel}\nAttacks Done: ${member.attacks ? member.attacks.length : 0}/2`,
                        inline: true,
                    }))
                );
            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while fetching war stats.');
        }
    },
};
