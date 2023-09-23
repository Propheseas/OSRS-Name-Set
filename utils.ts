import { Client, Guild, GuildTextBasedChannel } from "discord.js";

/**
 * Find a text based channel within a guild by its name
 */
export function findChannelByName(guild: Guild, channelName: string): GuildTextBasedChannel | undefined {
    return guild.channels.cache
    .find(ch => ch.isTextBased() && !ch.isDMBased() && ch.name == channelName) as GuildTextBasedChannel | undefined
}

/**
* Find a role within a guild by its name
*/
export function findRoleByName(guild: Guild, roleName: string) {
   return guild.roles.cache.find(x => x.name === roleName);
}

/**
 * Delete the last 20 messages in the channel not posted by the bot
 */
export async function deleteChannelMessages(client: Client, channel: GuildTextBasedChannel) {
    if (!client.user) throw new Error('Client not initialized');
    let messages = await channel.messages.fetch({limit: 20});
    if (messages) {
        messages = messages.filter(x => x.author.id === client.user!.id);
    }
}
