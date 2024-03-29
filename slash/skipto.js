const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Skips to a specified track number')
        .addNumberOption((option) =>
            option.setName('tracknumber').setDescription('The track to skip to').setMinValue(1).setRequired(true)),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue)
            return await interaction.editReply('There are no songs in the queue');

        const trackNum = interaction.options.getNumber('tracknumber');
        if (trackNum > queue.tracks.length || trackNum < 0)
            return await interaction.editReply('Invalid track number');
        const nextTrack = queue.tracks[trackNum - 1];
        queue.skipTo(trackNum - 1);
        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Now playing: **${nextTrack.author} -- ${nextTrack.title}**`)
                    .setThumbnail(nextTrack.thumbnail)
                    .setFooter({ text: `Duration: ${nextTrack.duration}`})
            ]
        });
    },
}