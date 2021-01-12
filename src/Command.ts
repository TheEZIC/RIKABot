import Bot from "./Bot";
import Message from "./Message";

export enum CommandArgs {
    database,
    bancho,
}

export enum Permissions {
    Owner,
    Referee,
    All,
}

export default abstract class Command<T> {
    public abstract name: string;
    public abstract description: string;
    public abstract commandPrefixes: string[];

    constructor(
        protected bot: Bot,
    ) {}

    protected abstract args: T;

    protected async getPermission(message: Message): Promise<Permissions> {
        const authorRoles = await message.getAuthorRoles();
        const guild = await this.bot.database.controllers.guild.findByGuildId(message.guildId);

        const isOwner = (
            message.authorId === message.message.guild.ownerID ||
            authorRoles.find(r => r.id === guild.ownerRoleId)
        );

        const isReferee = authorRoles.find(r => r.id === guild.refereeRoleId)

        if (isOwner) {
            return Permissions.Owner
        } else if (isReferee) {
            return Permissions.Referee
        } else {
            return Permissions.All
        }
    }

    protected throwWrongPermission(message: Message) {
        return message.reply(`
            У <@${message.authorId}> нету прав на использования команды **${this.name}**
        `);
    }

    public parseArguments(args: CommandArgs[]): T {
        const { bot } = this;
        let tempArgs: unknown = { ...bot };

        Object.keys(tempArgs).forEach(a => {
            if (!args.includes(CommandArgs[a])) delete tempArgs[a];
        });

        return tempArgs as T;
    }

    public abstract run(message: Message): void;
}