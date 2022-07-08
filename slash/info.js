const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('discord-player/smoothVolume');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Displays information about the current song.'),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue) 
            return await interaction.editReply('There are no songs in the queue!');
        
        let bar = queue.createProgressBar({
            timecodes: true,
            queue: false,
            length: 19
        });

        const song = queue.current;
        await interaction.editReply({
            embeds: [new MessageEmbed()
                .setThumbnail(song.thumbnail)
                .setDescription(`Currently Playing [${song.title}](${song.url})\nBy ${song.author}\n \n` + bar)
                .setFooter({ text: `Duration: ${song.duration}`})
            ],
        });
    }
}