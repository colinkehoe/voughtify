const { SlashCommandBuilder } = require('@discordjs/builders');
const { AudioFilters } = require('discord-player');

AudioFilters.define("3D", "apulsator=hz=0.128");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('Set the audio filter')
        .addNumberOption((option) =>
            option
                .setName('filter')
                .setDescription('The filter to set')
                .addChoices(
                    {
                        name: 'Clear',
                        value: 0
                    },
                    {
                        name: 'Bass Boost',
                        value: 1
                    },
                    {
                        name: 'Normalizer',
                        value: 2
                    },
                    {
                        name: 'Echo',
                        value: 3
                    },
                    {
                        name: 'vaporwave',
                        value: 4
                    },
                    {
                        name: 'Nightcore',
                        value: 5
                    },
                    {
                        name: 'Chorus',
                        value: 6
                    },
                    {
                        name: 'Surrounding',
                        value: 7
                    },
                    {
                        name: 'Earrape',
                        value: 8
                    }
                )
                .setRequired(true)
    ),
    run: async ({ client, interaction }) => {
        const queue = await client.player.getQueue(interaction.guildId);
        const filter = interaction.options.getNumber('filter');
        const currentFilter = queue.getFiltersEnabled();

        if (!queue) return await interaction.editReply('No queue found!');
        if (!interaction.user.voice.channel) return await interaction.editReply('You must be in the voice channel to use this command!');

        try {
            if (filter === 0) {
                if (!currentFilter) return interaction.reply('No filter is enabled.');
                await queue.setFilters({ currentFilter: false });
                await interaction.editReply('Filter cleared.');
            }
            else if (filter === 1) {
                await queue.setFilters({ currentFilter: false, "bassboost_low": true });
                await interaction.editReply('Bass boost enabled.');
            }
            else if (filter === 2) {
                await queue.setFilters({ currentFilter: false, "normalizer": true });
                await interaction.editReply('Normalizer enabled.');
            }
            else if (filter === 3) {
                await queue.setFilters({ currentFilter: false, "echo": true });
                await interaction.editReply('Echo enabled.');
            }
            else if (filter === 4) {
                await queue.setFilters({ currentFilter: false, "vaporwave": true });
                await interaction.editReply('Vaporwave enabled.');
            } 
            else if (filter === 5) {
                await queue.setFilters({ currentFilter: false, "nightcore": true });
                await interaction.editReply('Nightcore enabled.');
            }
            else if (filter === 6) {
                await queue.setFilters({ currentFilter: false, "chorus": true });
                await interaction.editReply('Chorus enabled.');
            }
            else if (filter === 7) {
                await queue.setFilters({ currentFilter: false, "surrounding": true });
                await interaction.editReply('Surrounding enabled.');
            }
            else if (filter === 8) {
                await queue.setFilters({ currentFilter: false, "earrape": true });
                await interaction.editReply('Earrape enabled.');
            }
        }
        catch (error) {
            console.log(error);
            return await interaction.editReply('An error occurred.');
        }
    }
}