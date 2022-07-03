const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the current queue.'),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue) 
            return await interaction.editReply('There are no songs in the queue to shuffle!');
        
        queue.shuffle();
        await interaction.editReply(`The queue of ${queue.tracks.length} songs has been shuffled.`);
    },
}