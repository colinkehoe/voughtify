const { SlashCommandBuilder } = require('@discordjs/builders');
const { QueryType } = require('discord-player');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song!')
        .addStringOption((option) => 
            option
                .setName('song')
                .setDescription('The song you wish to play.')
                .setRequired(true)
        )
        .addNumberOption((option) => 
            option
                .setName('shuffle')
                .addChoices(
                    {
                        name: 'on',
                        description: 'Shuffle the songs.',
                        value: 1
                    },
                    {
                        name: 'off',
                        description: "Don't shuffle the songs.",
                        value: 0
                    }
                )
                .setDescription('Shuffle the songs.')
                .setRequired(false)
        )
        .addNumberOption((option) =>
            option
                .setName('volume')
                .setDescription('The volume you would like to play at.')
                .setRequired(false)
        ),
    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) return interaction.editReply('You must be in a voice channel to use this command!');

        const queue = await client.player.createQueue(interaction.guild, {
            metadata: interaction.channel,
            autoSelfDeaf: false
        });
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);

        let embed = new MessageEmbed();

        const url = interaction.options.getString('song');
        const volume = interaction.options.getNumber('volume') ?? 100;

//! If somehow the url doesn't exist, then return an error embed.
        if (!url) {
            embed.setTitle('Error');
            embed.setDescription('You must provide a song to play!');
            return interaction.editReply(embed);
        }
//! If the url is a Spotify track url, then search using SPOTIFY_SONG.
        else if (url.includes('spotify.com/track/'))
        {
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_SONG
            });
            if (result.tracks.length === 0) {
                return interaction.editReply("That track wasn't found!");
            }

            const song = result.tracks[0];
            await queue.addTrack(song);
            embed
                .setTitle('Song Added to Queue')
                .setDescription(`**${song.author} -- [${song.title}](${song.url})** has been added to the Queue. \nRequested by <@${song.requestedBy.id}>`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` });
        }
//! Queue Spotify Playlist
        else if (url.includes('spotify.com/playlist/'))
        {
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_PLAYLIST
            });
            if (result.tracks.length === 0) {
                return interaction.editReply("That playlist wasn't found! Please try checking if your playlist is set to private.");
            }

            const playlist = result.playlist;
            await queue.addTracks(result.tracks);
            const track = queue.current;

            embed 
                .setTitle('Playlist Added to Queue')
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue. \n**Playlist author:** [${playlist.author.name}](${playlist.author.url}) \n**Playlist description:** ${playlist.description}`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({ text: `Currently playing: ${track.title} by ${track.author} \nDuration: ${track.duration}` });
        }
//! Handle Spotify album link.
        else if (url.includes('spotify.com/album/'))
        {
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_ALBUM
            });
            if (result.tracks.length === 0) {
                return interaction.editReply("That album wasn't found!");
            }

            const album = result.playlist;
            await queue.addTracks(result.tracks);
            const track = queue.current;

            embed 
                .setTitle('Album Added to Queue')
                .setDescription(`**${result.tracks.length} songs from [${album.title}](${album.url})** have been added to the Queue.`)
                .setThumbnail(album.thumbnail)
                .setFooter({ text: `Currently playing: ${track.title} by ${track.author} \nDuration: ${track.duration}` });
        }
//! If the url is a Youtube link, then explain that youtube is no longer supported by Music bots.
        else if (url.includes('youtube.com' || 'youtu.be'))
        {
            return interaction.editReply('Youtube is not supported on this music bot for legal reasons.');
        }
//! If the url is a SoundCloud link, then explain that SoundCloud is broken at the moment.
        else if (url.includes('soundcloud.com/track/'))
        {
            return interaction.editReply('Soundcloud links are currently unsupported at this time.');
        }
//! Handle default playlist
        else if (url.includes('the boys') || url.includes('theboys') || url.includes('default playlist'))
        {
            const theBoys = process.env.DEFAULT_PLAYLIST;
            if (!theBoys) return interaction.editReply('There was an error pulling up the default playlist!');

            const result = await client.player.search(theBoys, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_PLAYLIST
            });

            const playlist = result.playlist;
            await queue.addTracks(result.tracks);
            const track = queue.current;

            embed 
                .setTitle('Now Playing Default Playlist')
                .setDescription(`**${result.tracks.length}** songs have been added to the Queue.`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({ text: `Currently playing: ${track.title} by ${track.author} \nDuration: ${track.duration}` });
        }
//! Pressure command.
        else if (url.includes('pressure'))
        {
            const pressure = process.env.PRESSURE;
            if (!pressure) return interaction.editReply('Pressure is not yet set up on this server.');

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_SONG
            });

            if (result.tracks.length === 0) {
                return interaction.editReply("That track wasn't found!");
            }

            const song = result.tracks[0];
            await queue.addTrack(song);

            embed
                .setTitle('Song Added to Queue')
                .setDescription(`**${song.author} -- [${song.title}](${song.url})** has been added to the Queue. \nRequested by <@${song.requestedBy.id}>`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` });
        }
//! Sterling Command
        else if (url.includes('sterling'))
        {
            const sterling = process.env.STERLING;
            if (!sterling) return interaction.editReply('Sterling is not yet set up on this server.');

            const result = await client.player.search(sterling, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_SONG
            });

            if (result.tracks.length === 0) {
                return interaction.editReply("That track wasn't found!");
            }

            const song = result.tracks[0];
            await queue.addTrack(song);

            embed
                .setTitle('Song Added to Queue')
                .setDescription(`**${song.author} -- [${song.title}](${song.url})** has been added to the Queue. \nRequested by <@${song.requestedBy.id}>`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` });
        }
//! If the url has gotten past all checks, then search using SOUNDCLOUD_SEARCH.
        else
        {
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SOUNDCLOUD_SEARCH
            });

            if (result.tracks.length === 0) {
                return interaction.editReply("That song wasn't found!");
            }

            const song = result.tracks[0];
            await queue.addTrack(song);
            
            embed
                .setTitle('Song Added to Queue')
                .setDescription(`**${song.author} -- [${song.title}](${song.url})** has been added to the Queue. \nRequested by <@${song.requestedBy.id}>`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` });
        }

        const shuffle = interaction.options.getNumber('shuffle');
        if (shuffle === 1) {
            queue.shuffle();
        }

        if (volume != 100) await queue.setVolume(volume);
        if (!queue.playing) await queue.play();
        await interaction.editReply({
            embeds: [embed]
        });
    }
}
