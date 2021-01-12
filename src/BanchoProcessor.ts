import { BanchoClient, BanchoMultiplayerChannel } from "bancho.js";

import { osu } from "../config.json"
import Bot from "./Bot";
import Lobby, { MatchType } from "./Lobby";
import Message from "./Message";

export default class BanchoProcessor {
    private bancho: BanchoClient = new BanchoClient({ 
        username: osu.username, 
        password: osu.IRCPassword,
        apiKey: osu.APIKey
    });

    private tournamentLobbies: Lobby[] = [];

    constructor(
        private bot: Bot
    ) {}

    public async init() {
        await this.bancho.connect()
        .then(() => console.log("[Bancho] Successfully connected to Bancho"));
    }

    public async addLobby(
        lobbyId: number,
        message: Message,
    ) {
        let channel: BanchoMultiplayerChannel = this.bancho.getChannel(`#mp_${lobbyId}`) as BanchoMultiplayerChannel;

        await channel.join().catch(() => {return message.reply(`
            Error during connection to the lobby. You may had forgotten addref **${osu.username}**
        `)});

        await channel.lobby.updateSettings();

        const lobby = new Lobby(channel, 5);

        this.tournamentLobbies.push(lobby);

        await this.startLobbyListening(lobby, message);
        await message.reply(`Listening of the lobby ${lobby.name} started`);
    }

    public async removeLobby(
        lobbyId: number
    ) {
        await this.tournamentLobbies.find(l => l.channel.lobby.id === lobbyId).channel.leave();
        this.tournamentLobbies = this.tournamentLobbies.filter(l => l.channel.lobby.id !== lobbyId);
    }

    private async startLobbyListening(
        lobby: Lobby,
        message: Message,
    ) {
        const guild = await this.bot.database.controllers.guild.findByGuildId(message.guildId);
        const { matchInfoChannelId } = guild;

        lobby?.channel.lobby.on("matchFinished", async () => {
            await lobby?.channel.lobby.updateSettings();

            if (lobby.matchType === MatchType.TeamVsTeam) {
                lobby?.updateScore();
                message.replyToMatchInfo(`Round between ${lobby.team1Name ?? "team1"} ${lobby.team1Score}:${lobby.team2Score} ${lobby.team2name ?? "team2"} ended.`, matchInfoChannelId);
            } else {
                return message.replyToMatchInfo("Round ended");
            }

            //console.log(lobby.channel.lobby.scores);

            if (
                ((lobby.bestOf + 1) / 2 === lobby.team1Score) ||
                ((lobby.bestOf + 1) / 2 === lobby.team2Score)
            ) {
                await message.replyToMatchInfo(`Round between ${lobby.team1Name} vs ${lobby.team2name} ended`, matchInfoChannelId);
                await this.removeLobby(lobby.id);
            }
        });

        lobby?.channel.lobby.on("matchSettings", async () => {
        })

        lobby?.channel.lobby.on("playerLeft", async ctx => {
            if (ctx.lobby.slots.filter(s => s !== null).length === 0) {
                await this.removeLobby(lobby.id);
            }
        });
    }
}