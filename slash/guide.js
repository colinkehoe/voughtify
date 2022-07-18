const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guide')
        .setDescription('Displays a guide to the usage of the Voughtify bot.'),
    
    run: async ({ client, interaction }) => {

        await interaction.editReply({
            embeds: [
                {
                    "type": "rich",
                    "title": `Voughtify Guide`,
                    "description": `A guide to every command available with Voughtify.`,
                    "color": 0x1100ff,
                    "fields": [
                      {
                        "name": `Commands`,
                        "value": "\u200B"
                      },
                      {
                        "name": `/play`,
                        "value": `Plays a song. Optionally, you can specify if you would like to shuffle the queue or change the volume.`
                      },
                      {
                        "name": `/pause`,
                        "value": `Pauses the current song.`
                      },
                      {
                        "name": `/resume`,
                        "value": `Resumes play after a pause.`
                      },
                      {
                        "name": `/quit`,
                        "value": `Cancels all music. Bot will leave the current voice channel.`
                      },
                      {
                        "name": `/queue`,
                        "value": `Displays songs in the current queue. Optionally, you can enter a number to view a certain page.`
                      },
                      {
                        "name": `/info`,
                        "value": `Displays info about current song.`
                      },
                      {
                        "name": `/shuffle`,
                        "value": `Shuffles current selection of songs.`
                      },
                      {
                        "name": `/volume`,
                        "value": `Changes the volume of the current queue, using a number between 0 and 100.`
                      },
                      {
                        "name": `/loop`,
                        "value": `Loops the current song or queue, or begins autoplay.`
                      },
                      {
                        "name": `/skip and /skipto`,
                        "value": `Skip will skip the current song. Skipto will request a number and skip to that song in the queue.`
                      }
                    ],
                    "footer": {
                      "text": `Designed by Colin Kehoe`
                    }
                }
            ]
        });
    }
}