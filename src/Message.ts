import { Message as DsMessage, TextChannel } from "discord.js";

export default class Message {
    public clean: string;
    public command: string;
    public params: string[];

    constructor(
        public message: DsMessage
    ) {
        this.clean = message.content;
        
        const args: string[] = this.clean.split(" ");

        this.command = this.removePrefix(args.shift());
        this.params = args;
    }

    private removePrefix(command: string): string {
        return command.split("").slice(1).join("")?.toLowerCase();
    }

    public get channelsMentions() {
        return this.message.mentions.channels.array();
    }

    public get rolesMentions() {
        return this.message.mentions.roles.array();
    }

    public get authorId() {
        return this.message.author.id;
    }

    public get channelId() {
        return this.message.channel.id;
    }

    public get guildId() {
        return this.message.guild.id;
    }

    public async getAuthorRoles() {
        const author = this.message.author;
        const guildMember = await this.message.guild.members.fetch(author);
        return guildMember.roles.cache.array();
    }

    public async reply(text: string) {
        this.message.channel.send(text);
    }

    public async replyToMatchInfo(text: string, channelId?: string | null | undefined) {
        let channel = channelId 
            ? this.message.guild.channels.cache.get(channelId) as TextChannel
            : this.message.channel;
        
        channel.send(text);
    }
}