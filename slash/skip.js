const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song.'),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue) return await interaction.editReply('There are no songs in the queue');

        const currentSong = queue.current;
        const nextTrack = queue.tracks[0];

        try {
            queue.skip();
            await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`**${currentSong.author} -- ${currentSong.title}** has been skipped.\nNow playing: **${nextTrack.author} -- ${nextTrack.title}**`)
                        .setThumbnail(queue.current.thumbnail)
                        .setFooter({ text: `Duration: ${nextTrack.duration}`})
                ]
            });
        }
        catch (error) {
            console.log(error);
            await interaction.editReply("There are no songs in the queue!");
        }
    },
}