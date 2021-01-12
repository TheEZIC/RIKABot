import { BanchoMultiplayerChannel } from "bancho.js";

type teamNameTuple = [
    string | null, 
    string | null,
]

export enum MatchType {
    HeadToHead = 0,
    TagCoop = 1,
    TeamVsTeam = 2,
    TagTeamVsTagTeam = 3,
}

export enum scoreType {
    ScoreV1 = 0,
    Accuracy = 1,
    Combo = 2,
    ScoreV2 = 3,
}

export enum playerTeam {
    Red = "Red",
    Blue = "Blue",
}

export default class Lobby {
    public readonly id: number = this.channel.lobby.id;

    public readonly name: string = this.channel.lobby.name;

    public matchType: MatchType = this.channel.lobby.teamMode;
    public scoreType: scoreType = this.channel.lobby.winCondition;
    
    public readonly team1Name: string | null = this.getTeamsNames(this.name)[0];
    public readonly team2name: string | null = this.getTeamsNames(this.name)[1];

    public team1Score: number = 0;
    public team2Score: number = 0;

    constructor(
        public channel: BanchoMultiplayerChannel,
        public bestOf: number,
    ) {}

    private getTeamsNames(lobbyName: string): teamNameTuple {
        const regexp = /\D+ \((?<team1Name>\D+)\) vs \((?<team2Name>\D+)\)/;

        if (!regexp.test(lobbyName)) return [null, null];

        const { groups: { team1Name, team2Name } } = regexp.exec(lobbyName);

        return [team1Name, team2Name];
    }

    public async updateScore() {
        const scores = this.channel.lobby.scores;

        if (!scores[0].player.team) return;

        const redScores = scores.filter(s => s.player.team === playerTeam.Red);
        const blueScores = scores.filter(s => s.player.team === playerTeam.Blue);

        const redScoresSum = redScores.reduce((a, b) => a + b.score, 0);
        const blueScoresSum = blueScores.reduce((a, b) => a + b.score, 0);

        if (redScoresSum > blueScoresSum) {
            this.team1Score += 1;
        } else if (redScoresSum < blueScoresSum) {
            this.team2Score += 1;
        } else return;
    }
}