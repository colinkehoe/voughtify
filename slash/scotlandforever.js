const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scotlandforever')
        .setDescription('Plays Scotland Forever a few times.')
        .addNumberOption((option) => option.setName('number').setDescription('The number of times to play the song.').setRequired(false).setDefaultValue(1)),
    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) return interaction.editReply('You must be in a voice channel to use this command!');

        const queue = await client.player.createQueue(interaction.guild, {
            metadata: interaction.channel,
            autoSelfDeaf: false
        });

        if (!queue.connection) await queue.connect(interaction.member.voice.channel);

        let embed = new MessageEmbed();

        let url = process.env.SCOTLAND_FOREVER_URL;
        let number = interaction.options.getNumber('number');

        let result = await client.player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.SPOTIFY_SONG
        });
        if (result.tracks.length === 0) {
            return interaction.editReply("I wasn't able to grab the song from Spotify!");
        }
        const song = result.tracks[0];

        var i = 0;
        while (i < number){
            await queue.addTrack(song);
            i += 1;
        }
        embed
            .setDescription(`**${song.author} -- [${song.title}](${song.url})** has been added to the Queue. \nRequested by <@${song.requestedBy.id}>`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}` });
    }
}