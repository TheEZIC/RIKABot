import { Connection, createConnection } from "typeorm";

import Guild from "./Models/Guild";

import GuildController from "./Controllers/GuildController";

interface IEntities {
    guild: GuildController;
}

export default class Database {
    private connection: Connection;

    public controllers: IEntities;

    async init () {
        this.connection = await createConnection({
            type: "sqlite",
            database: "./db.db",
            synchronize: true,
            //logging: "all",
            entities: [
                Guild,
            ]
        });

        this.controllers = {
            guild: new GuildController(this.connection.getRepository(Guild)),
        }
    }
}