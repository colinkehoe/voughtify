const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('back')
        .setDescription('Go back to the previous song.'),
    run: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guild.id);

        await queue.back();
        const nextTrack = queue.current;
        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setTitle('Now playing')
                    .setDescription(`The queue has returned to **${nextTrack.author} -- ${nextTrack.title}**`)
                    .setThumbnail(queue.current.thumbnail)
                    .setFooter({ text: `Duration: ${nextTrack.duration}` })
            ]
        });
    }
}