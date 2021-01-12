import Command, { CommandArgs, Permissions } from "../Command";
import Database from "../Database/Database";
import Message from "../Message";

interface IChangeMatchInfoChannelCommandArgs {
    database: Database
}

export default class ChangeMatchInfoChannel extends Command<IChangeMatchInfoChannelCommandArgs> {
    name = "ChangeMatchInfoChannel";
    description = "Change match info channel";
    commandPrefixes = ["changematchinfochannel"];

    args = this.parseArguments([
        CommandArgs.database, 
    ]);

    controller = this.args.database.controllers.guild;

    async run (message: Message) {
        const permission = await this.getPermission(message) === Permissions.Owner;
        if (!permission) return this.throwWrongPermission(message);

        const matchInfoChannelId = message.channelsMentions[0].id;
        const guildId = message.guildId;

        await this.controller.update(guildId, { matchInfoChannelId });

        message.reply(`
            Match info channel had changed to <#${matchInfoChannelId}>
        `);
    }
}