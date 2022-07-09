const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pings the bot.'),
    run: async ({ client, interaction }) => {
            await interaction.editReply("pong!");
    },
}