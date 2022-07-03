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
                        "value": `Has 5 subcommands:\n->theboys will play a default playlist of songs featured in the show.\n->song will ask for a spotify URL which will play the requested song.\n->playlist will ask for a Spotify playlist URL, and it will automatically shuffle.\n->album will ask for a Spotify album URL, and it will shuffle.\n->search will ask for search terms to use, and play the first result. It's recommended that you default to this, and that you put the artist's name first if the song is not the top result.`
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
                        "value": `Displays songs in the current queue. Takes an optional number to display a specific page in the queue.`
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