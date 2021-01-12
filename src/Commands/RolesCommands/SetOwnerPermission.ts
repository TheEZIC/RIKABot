import Command, { CommandArgs, Permissions } from "../../Command";
import Database from "../../Database/Database";
import Message from "../../Message";

interface ISetOwnerPermissionCommandArgs {
    database: Database
}

export default class SetOwnerPermissionCommand extends Command<ISetOwnerPermissionCommandArgs> {
    name = "SetOwnerPermission";
    description = "Set owner permission";
    commandPrefixes = ["setownerpermission"];

    args = this.parseArguments([
        CommandArgs.database, 
    ]);

    controller = this.args.database.controllers.guild;

    async run (message: Message) {
        const permission = await this.getPermission(message) === Permissions.Owner;
        if (!permission) return this.throwWrongPermission(message);

        const ownerRoleId = message.rolesMentions[0].id;
        const guildId = message.guildId;

        await this.controller.update(guildId, { ownerRoleId });

        message.reply(`
            Owner permission had gave to <@&${ownerRoleId}>
        `);
    }
}