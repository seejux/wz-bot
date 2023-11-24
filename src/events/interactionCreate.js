const { Events, ChannelType, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { getPlayerInfo } = require('../api/getPlayerInformation')

const TICKET_CATEGORY = 'yet-another-bot-channel';
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isButton()) {
			// Handle button interactions
			handleButtonInteraction(interaction);
		} else if (interaction.isChatInputCommand()) {
			// Handle chat command interactions
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		} else if (interaction.isModalSubmit()) {
			if (interaction.customId === 'playerTagModal') {
				respondToPlayerTagModal(interaction)
			}
			await interaction.reply({ content: 'Your submission was received successfully!', ephemeral: true });
		}

	},
};

async function handleButtonInteraction(interaction) {
	const user = interaction.user;
	const guild = interaction.guild;

	// Determine which button was clicked
	switch (interaction.customId) {
		case 'mainClanInterestButton':
			await createTicketChannel(interaction, user, guild, 'Main');
			break;
		case 'fwaButton':
			await createTicketChannel(interaction, user, guild, 'FWA');
			break;
		case 'helpButton':
			await createTicketChannel(interaction, user, guild, 'Help');
			break;
		case 'ticketHowToGetPlayerTagButton':

			break;
		case 'closeTicketButton':
			console.log(interaction.channel.name)
			await closeTicketChannel(interaction);
			break;
		case 'cocTagModalButton':
			await getPlayerTagModal(interaction);
			break;
		default:
			// Handle unknown button
			break;
	}
	// interaction.reply({ content: 'Ticket created successfully!', ephemeral: true });

}
function removeNonLetters(inputString) {
	// Use a regular expression to match only letters and allowed separators
	const lettersWithExceptions = inputString.replace(/^[^a-zA-Z]+|[^a-zA-Z_-]+$/g, '');
	return lettersWithExceptions;
}

function getTicketMessge(userId, guild) {
	return `<@${userId}> Welcome! Thank you for your interest! A <@&${guild.roles.cache.find(role => role.name === '🎫 ⌈ Recruiters ⌋ 🎫').id}> will be with you shortly, in the meanwhile, please answer the following questions.`
}

function getTicketEmbed() {
	const ticketHowToGetPlayerTagButton = new ButtonBuilder()
		.setCustomId('ticketHowToGetPlayerTagButton')
		.setLabel('How to get my playertag?')
		.setStyle(ButtonStyle.Secondary); // Secondary style (gray)

	const closeTicketButton = new ButtonBuilder()
		.setCustomId('closeTicketButton')
		.setLabel('Close ticket (Recruiter Only)')
		.setStyle(ButtonStyle.Secondary); // Secondary style (gray)

	const cocTagModalButton = new ButtonBuilder()
		.setCustomId('cocTagModalButton')
		.setLabel('Submit Tag here')
		.setStyle(ButtonStyle.Primary); // Secondary style (gray)


	const row = new ActionRowBuilder()
		.addComponents([cocTagModalButton, ticketHowToGetPlayerTagButton, closeTicketButton]);


	const ticketEmbed = new EmbedBuilder()
		.setColor(0x0099FF)
		// .setTitle(`Welcome ${user.username}! 👋`)
		.setDescription("1. In-game username\n" +
			"2. Player tag (Click below to see how to copy your playertag)\n" +
			"3. Age\n" +
			"4. Timezone\n" +
			"5. Country\n" +
			"6. What you're looking for in a clan")
		.setThumbnail('https://cdn.discordapp.com/icons/1087901910494875720/05de99400e063e41dcbe07104f19e50f.png')
		.setTimestamp()
		.setFooter({ text: 'Patience is key! A Recruiter will be with you soon.' });

	return { embeds: ticketEmbed, components: row };
}


async function createTicketChannel(interaction, user, guild, category) {
	try {
		// console.log(guild)
		const allChannels = guild.channels.cache;
		// console.log(allChannels.map(channel => channel.name + '-> ' + channel.type));
		// Find the category where you want to create the new channels
		const categoryChannel = allChannels.find((channel) => channel.type === ChannelType.GuildCategory && channel.name === TICKET_CATEGORY);
		if (!categoryChannel) {
			console.error('Category "yet-another-bot-channel" not found');
			return;
		}

		// Create a new channel with the user's name
		const channelNamee = `${category}-${user.username}`;

		// console.log("channelNamee: " + channelNamee)
		guild.channels
			.create({
				name: removeNonLetters(channelNamee),
				type: ChannelType.GuildText, // or 'GUILD_VOICE' for a voice channel
				parent: categoryChannel.id,
				permissionOverwrites: [
					{
						id: guild.roles.everyone,
						deny: [PermissionFlagsBits.ViewChannel],
					},
					{
						id: user.id,
						allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
					},
					// Assuming "admin" is the role name, adjust it if needed
					{
						id: guild.roles.cache.find((role) => role.name === '🎫 ⌈ Recruiters ⌋ 🎫').id,
						allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
					},
				],
			})
			.then(async (channel) => {
				const { embeds, components } = getTicketEmbed()
				channel.send({ content: getTicketMessge(user.id, guild), embeds: [embeds], components: [components] }).then(async (sentMessage) => {
					sentMessage.pin()
				});
				await interaction.reply({ content: `Your Ticket has been created. Plz access it at <#${channel.id}>`, ephemeral: true })
			})
			.catch(console.error);
	} catch (error) {
		console.error('Error creating ticket channel:', error);
	}
}

async function closeTicketChannel(interaction) {
	try {
		const channel = interaction.channel;
		// Get the channel name
		const channelName = channel.name;

		const member = interaction.member;
		if (!member.roles.cache.some(role => role.name === '🎫 ⌈ Recruiters ⌋ 🎫')) {
			return interaction.reply('You do not have the required permissions to close this ticket.');
		}
		// Delete the channel
		await channel.delete();
	} catch (error) {
		console.error('Error handling button interaction:', error);
	}
}

async function getPlayerTagModal(interaction) {
	const modal = new ModalBuilder()
		.setCustomId('playerTagModal')
		.setTitle('Submit your player tag');

	// Add components to modal

	// Create the text input components
	const playerTagInput = new TextInputBuilder()
		.setCustomId('playerTagInput')
		// The label is the prompt the user sees for this input
		.setLabel("What's your player tag?")
		// Short means only a single line of text
		.setStyle(TextInputStyle.Short);

	// const hobbiesInput = new TextInputBuilder()
	// 	.setCustomId('hobbiesInput')
	// 	.setLabel("What's some of your favorite hobbies?")
	// 	// Paragraph means multiple lines of text.
	// 	.setStyle(TextInputStyle.Paragraph);

	// An action row only holds one text input,
	// so you need one action row per text input.
	const firstActionRow = new ActionRowBuilder().addComponents(playerTagInput);
	// Add inputs to the modal
	modal.addComponents(firstActionRow);

	// Show the modal to the user
	await interaction.showModal(modal);
}

const thEmojiID = '<:02:1175214503084970104>'
const barbKingEmojiID = '<:BarbarianKing:1175216749172494408>'
const archerQueenEmojiID = '<:ArcherQueen:1175216691391766558>'
const grandWardenEmojiID = '<:GrandWarden:1175216946736799764>'
const championEmojiID = '<:RoyalChampion:1175216977598488636>'
const xpEmojiID = '<:xp:1175215200111185980>'
const warEmojiID= '<:war_star:1176249191513735279>'
const copterEmojiID = '<:battle_copter:1176248854232961095>'
const battleMachineID = '<:battle_machine:1176248981827883159>'
const capitalGoldID = '<:capital_gold:1176439992164306995>'

function getEmojiForHero(heroName) {
	// Replace this with your own logic to get the emoji based on the hero name
	// For example, you can have a switch statement or a mapping object
	// Return the emoji ID or Unicode representation
	switch (heroName) {
		case 'Barbarian King':
			return barbKingEmojiID;
		case 'Archer Queen':
			return archerQueenEmojiID;
		case 'Grand Warden':
			return grandWardenEmojiID;
		case 'Royal Champion':
			return championEmojiID;
		case 'Battle Machine':
			return battleMachineID;
		case 'Battle Copter':
			return copterEmojiID;
		default:
			return ''; // Handle unknown heroes or return a default emoji
	}
}
async function respondToPlayerTagModal(interaction) {
    const playerTagInput = interaction.fields.getTextInputValue('playerTagInput');
    const data = await getPlayerInfo(playerTagInput);
    console.log(data.name);
    const tagWithoutHash = data.tag.replace('#', '');
    const profileLink = `https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${data.tag}`;
    const embed = new EmbedBuilder()
        .setTitle(`${data.name} (${data.tag})`)
        .setURL(profileLink)
        .setThumbnail(data.league.iconUrls.small)
        .setDescription(`${thEmojiID} ${data.townHallLevel}   ${xpEmojiID} ${data.expLevel}   🔰 ${data.clan ? data.clan.name : 'No Clan'}`)
        .addFields({ name: 'Trophies', value: `🏆 ${data.trophies}`, inline: true })
        .addFields({ name: 'War Stars', value: `${warEmojiID} ${data.warStars}`, inline: true })
        .addFields({ name: 'Attack Win', value: `⚔️ ${data.attackWins}`, inline: true })
        .addFields({ name: 'Defence Win', value: `🛡️ ${data.defenseWins}`, inline: true })
        .addFields({ name: 'FWA Detail', value: `[Open ↗](https://fwa.chocolateclash.com/cc_n/member.php?tag=${tagWithoutHash})`, inline: true })
        .addFields({ name: 'War Attack History', value: `[Open ↗](https://app.clashperk.com/members/%23${tagWithoutHash})` })
        .addFields({ name: 'Heroes', value: data.heroes.map(hero => `${getEmojiForHero(hero.name)} ${hero.level}`).join(' | ') })
        .addFields({ name: 'Clan Capital Contribution', value: `${capitalGoldID} ${data.clanCapitalContributions}` })
        .addFields({ name: 'Donations', value: `Given: \n🔺 ${data.donations}\nReceived: \n🔻 ${data.donationsReceived}` });

    interaction.channel.send({ embeds: [embed] });
}
