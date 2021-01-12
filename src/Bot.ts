import { Client } from "discord.js";

import { discord } from "../config.json";

import Command from "./Command";
import Message from "./Message";
import Database from "./Database/Database";
import BanchoProcessor from "./BanchoProcessor";

import ChangeMatchInfoChannel from "./Commands/ChangeMatchInfoChannelCommand";
import SetOwnerPermissionCommand from "./Commands/RolesCommands/SetOwnerPermission";
import SetRefereePermissionCommand from "./Commands/RolesCommands/setRefereePermission";
import ListenLobbyCommand from "./Commands/ListenLobby";

export default class Bot {
    public client: Client = new Client();
    public database: Database = new Database();
    public bancho: BanchoProcessor = new BanchoProcessor(this);

    private commands: Command<any>[];

    private initCommands() {
        this.commands = [
            new ChangeMatchInfoChannel(this),
            new SetOwnerPermissionCommand(this),
            new SetRefereePermissionCommand(this),
            new ListenLobbyCommand(this),
        ]
    }

    public async start() {
        this.client.login(discord.token);

        console.log("[Bot] Бот начал работу");

        await this.database.init();
        await this.bancho.init();

        this.initCommands();

        this.client.on("guildCreate", async ctx => {
            const guildController = this.database.controllers.guild;
            const exist = await guildController.findByGuildId(ctx.id);
            
            if (!exist) guildController.create(ctx.id);
        });

        this.client.on("message", msg => {
            const message = new Message(msg);

            if (!message || !message?.clean.startsWith(discord.prefix)) return;

            const command: Command<any> = this.commands.find(c => c.commandPrefixes.includes(message.command));

            command?.run(message);
        });
    }
}