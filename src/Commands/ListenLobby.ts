import BanchoProcessor from "../BanchoProcessor";
import Bot from "../Bot";
import Command, { CommandArgs, Permissions } from "../Command";
import Database from "../Database/Database";
import Message from "../Message";

interface ITestCommandArgs {
    database: Database;
    bancho: BanchoProcessor;
}

export default class  ListenLobbyCommand extends Command<ITestCommandArgs> {
    name = "listenLobby";
    description = "Listen lobby";
    commandPrefixes = ["listenlobby"];

    args = this.parseArguments([
        CommandArgs.database,
        CommandArgs.bancho,
    ]);

    async run (message: Message) {
        const permission = (
            await this.getPermission(message) === Permissions.Owner ||
            await this.getPermission(message) === Permissions.Referee
        );

        if (!permission) return this.throwWrongPermission(message);

        await this.args.bancho.addLobby(message);
    }
}