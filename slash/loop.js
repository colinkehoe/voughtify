const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { QueryType, QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Begins an autoplay session based on the current song.')
        .addNumberOption((option) => option.setName('mode').addChoices(
                {
                    name: 'off',
                    value: QueueRepeatMode.OFF
                },
                {
                    name: 'song',
                    value: QueueRepeatMode.TRACK
                },
                {
                    name: 'queue',
                    value: QueueRepeatMode.QUEUE
                },
                {
                    name: 'autoplay',
                    value: QueueRepeatMode.AUTOPLAY
                }
            ).setDescription('The loop mode settings.').setRequired(true)),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue) return interaction.editReply('There is no music being played!');

        const loopmode = interaction.options.getNumber('mode');

        try {
            queue.setRepeatMode(loopmode);
            
            if (loopmode === QueueRepeatMode.OFF) {
                interaction.editReply('Autoplay has been disabled.');
            }
            else if (loopmode === QueueRepeatMode.TRACK) {
                interaction.editReply('The current song will now repeat.');
            }
            else if (loopmode === QueueRepeatMode.QUEUE) {
                interaction.editReply('The queue will now repeat.');
            }
            else if (loopmode === QueueRepeatMode.AUTOPLAY) {
                interaction.editReply('Autoplay has now been enabled for the current listening session.');
            }
        } 
        catch (error) {
            console.log(error);
            return interaction.editReply('Something went wrong!');
        }
    }
}