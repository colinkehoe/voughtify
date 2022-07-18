const { SlashCommandBuilder } = require('@discordjs/builders');
const { Queue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setvolume')
        .setDescription('Changes the volume of the bot.')
        .addNumberOption((option) => option.setName('setting').setDescription('The volume to set the bot to.').setRequired(true)),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue) {
            return interaction.editReply('There are no songs in the queue!');
        }

        const volume = interaction.options.getNumber('setting');
    
        if (volume === queue.volume) {
            return interaction.editReply('The volume is already set to that!');
        }
        if (volume < 0 || volume > 100) return interaction.editReply('Volume must be between 0 and 100!');

        try {
            queue.setVolume(volume);
            interaction.editReply(`Volume set to ${volume}!`);
        } 
        catch (error) {
            console.log(error);
            interaction.editReply("There was an error setting the volume!");
        }
    }
}