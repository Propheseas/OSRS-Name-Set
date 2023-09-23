// Import required packages
import { Client, Events } from 'discord.js';
import winston from 'winston';
import { deleteChannelMessages, findChannelByName, findRoleByName } from './utils';

// Import config
import config from './config.json';

// Create logger
const colorizer = winston.format.colorize();
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YY-MM-DD HH:MM:SS' }),
                winston.format.simple(),
                winston.format.printf(msg =>
                    colorizer.colorize(msg.level, `${msg.timestamp} | ${msg.level.toUpperCase()} | ${msg.message}`)
                )
            ),
        })
    ],
});

// Create a discord bot
const bot = new Client({
    intents: ['Guilds', 'GuildMessages', 'MessageContent']
});

bot.on(Events.ClientReady, async (client) => {
    // Load guild and check permissions
    const guild = client.guilds.cache.get(config.GUILD_ID);
    if (!guild) {
        logger.error("Unable to load guild, guild not found");
        return;
    }
    await guild.members.fetchMe();
    await guild.roles.fetch();
    await guild.channels.fetch();
    if (!guild.members.me?.permissions.has('ManageNicknames', true)) {
        logger.error('Missing permission "ManageNicknames" for guild!');
        return;
    }
    if (!guild.members.me?.permissions.has('ManageRoles', true)) {
        logger.error('Missing permission "ManageRoles" for guild!');
        return;
    }

    // Load channel and check permissions
    const channel = findChannelByName(guild, config.RSN_CHANNEL_NAME);
    if (!channel) {
        logger.error("Unable to load channel, channel not found inside guild");
        return;
    }
    if (!guild.members.me?.permissionsIn(channel).has('ManageMessages')) {
        logger.error('Missing permission "ManageMessages" for channel!');
        return;
    }
    // Load role
    const roleToApply = findRoleByName(guild, config.ROLE_NAME_TO_APPLY);
    if (!roleToApply) throw new Error('Unable to load role to apply');

    // Listen for incoming messages
    client.on(Events.MessageCreate, async (message) => {
        // Check if it's posted in the RSN channel and not posted by the bot
        if (message.channelId !== channel.id) return;
        if (message.author.id === client.user!.id) return;
        if (!message.member) return;

        // Filter out !rsn, !set, ! and #
        const nickname = message.content.replace(/!set|!rsn|!|#/g, '').trim();

        // Check nickname length (RSN can only be 12 characters)
        if (nickname.length > 12) {
            message.channel.send("Maximum character limit: 12 (Name is too long) - ONLY post your Runescape username, NO OTHER TEXT");
            return;
        }

        // Fetch person who posted the message and add the role
        try {
            await message.member.roles.add(roleToApply);
        } catch (e) {
            console.error("Unable to apply new role to member, make sure the bot role is ABOVE the role you're trying to apply.")
        }
        message.member.setNickname(nickname).catch(logger.error);

        // Delete the posted message
        message.delete().catch(logger.error);
    });

    // Schedule deleting messages in that channel every 10 minutes
    setInterval(() => deleteChannelMessages(client, channel), 60000 * 10);

    logger.info("Bot started");
});

bot.login(config.DISCORD_TOKEN);