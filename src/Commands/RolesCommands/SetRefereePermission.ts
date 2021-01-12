import Command, { CommandArgs, Permissions } from "../../Command";
import Database from "../../Database/Database";
import Message from "../../Message";

interface ISetRefereePermissionCommandArgs {
    database: Database
}

export default class SetRefereePermissionCommand extends Command<ISetRefereePermissionCommandArgs> {
    name = "SetRefereePermission";
    description = "Set referee permission";
    commandPrefixes = ["setrefereepermission"];

    args = this.parseArguments([
        CommandArgs.database, 
    ]);

    controller = this.args.database.controllers.guild;

    async run (message: Message) {
        const permission = await this.getPermission(message) === Permissions.Owner;
        if (!permission) return this.throwWrongPermission(message);

        const refereeRoleId = message.rolesMentions[0].id;
        const guildId = message.guildId;

        await this.controller.update(guildId, { refereeRoleId });

        message.reply(`
            Referee permission had gave to <@&${refereeRoleId}>
        `);
    }
}