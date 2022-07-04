/*
*     Play Function
*     Contains 5 subcommands:
*         -song: Play a song from Spotify URL
*         -playlist: Play a playlist from Spotify URL
*         -album: Play an album from Spotify URL
*         -search: Play the top search result from SoundCloud
*         -theboys: Plays a default playlist of songs from The Boys. 
*/

const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")
require('discord-player/smoothVolume');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
        .setDescription("Loads songs to play")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("theboys")
                .setDescription("Plays songs from The Boys.")
        )
		.addSubcommand((subcommand) =>
			subcommand
				.setName("song")
				.setDescription("Loads a single song from a Spotify URL.")
				.addStringOption((option) => option.setName("url").setDescription("The song's Spotify URL").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("playlist")
				.setDescription("Loads a playlist of songs from a Spotify URL.")
				.addStringOption((option) => option.setName("url").setDescription("The playlist's Spotify URL").setRequired(true))
		)
        .addSubcommand((subcommand) =>
			subcommand
				.setName("album")
				.setDescription("Loads songs from an album using a Spotify URL.")
				.addStringOption((option) => option.setName("url").setDescription("The albums's Spotify URL").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("search")
				.setDescription("Searches for song on SoundCloud using search terms. This can be a song title, artist, or album name.")
				.addStringOption((option) =>
					option.setName("searchterms").setDescription("The search keywords").setRequired(true)
				)
        )
        .addSubcommand((subcommand) =>
            subcommand 
                .setName("soundcloud")
                .setDescription("Loads a single song from a SoundCloud URL.")
                .addStringOption((option) => 
                    option.setName("url").setDescription("The song's SoundCloud URL").setRequired(true)
                    )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("sterling")
                .setDescription("Plays Sterling's theme song.")
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName("pressure")
                .setDescription("Plays Pressure by Billy Joel.")
        ),
	run: async ({ client, interaction }) => {
		if (!interaction.member.voice.channel) return interaction.editReply("You need to be in a VC to use this command!")

		const queue = await client.player.createQueue(interaction.guild, {
            metadata: interaction.channel,
            autoSelfDeaf: false
        });
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new MessageEmbed()

//*subcommand handler:
        if (interaction.options.getSubcommand() === "theboys")
        {
            let url = process.env.DEFAULT_PLAYLIST;
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_PLAYLIST
            })
            if (result.tracks.length === 0)
                return interaction.editReply("No results.")
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            const track = queue.current
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue.`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({ text: `Currently Playing: ${track.title} \n Duration: ${track.duration}`})
        }
        else if (interaction.options.getSubcommand() === "song")
        {
            let url = interaction.options.getString("url")
            let result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_SONG
            });
            if (result.tracks.length === 0) {
                return interaction.editReply("No results.");
            }
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
        }
        else if (interaction.options.getSubcommand() === "playlist")
        {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_PLAYLIST
            })
            if (result.tracks.length === 0)
                return interaction.editReply("No results.")
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            const track = queue.current
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue. \n**Playlist author:** [${playlist.author.name}](${playlist.author.url}) \n**Playlist description:** ${playlist.description}`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({ text: `Currently Playing: ${track.title} \nDuration: ${track.duration}`})
        }
        else if (interaction.options.getSubcommand() === "album")
        {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_ALBUM
            })
            if (result.tracks.length === 0)
                return interaction.editReply("No results.")
            const album = result.playlist
            await queue.addTracks(result.tracks)
            const track = queue.current;
            embed
                .setDescription(`**${result.tracks.length} songs from [${album.title}](${album.url})** have been added to the Queue.`)
                .setThumbnail(album.thumbnail)
                .setFooter({ text: `Currently Playing: ${track.title} \n Duration: ${track.duration}`})
        }
        else if (interaction.options.getSubcommand() === "search")
        {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SOUNDCLOUD_SEARCH
            });
            if (result.tracks.length === 0)
                return interaction.editReply("No results.")
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
        }
        else if (interaction.options.getSubcommand() === "soundcloud")
        {
            let url = interaction.options.getString("url");
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SOUNDCLOUD_SEARCH
            });
            if (result.tracks.length === 0)
                return interaction.editReply("No results.");
            const song = result.tracks[0];
            await queue.addTrack(song);
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
        }
        else if (interaction.options.getSubcommand() === "sterling")
        {
            let url = process.env.STERLING;
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_SONG
            });
            if (result.length === 0)
                return interaction.editReply("There was an error.");
            const song = result.tracks[0];
            await queue.addTrack(song);
            embed
                .setDescription(`**Sterling's theme song, [${song.title}](${song.url}),** has been added to the Queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
        }
        else if (interaction.options.getSubcommand() === "pressure")
        {
            let url = process.env.PRESSURE;
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_SONG
            });
            if (result.length === 0)
                return interaction.editReply("There was an error.");
            const song = result.tracks[0];
            await queue.addTrack(song);
            embed
                .setDescription(`**Sterling's theme song, [${song.title}](${song.url}),** has been added to the Queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
        }
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
	},
}