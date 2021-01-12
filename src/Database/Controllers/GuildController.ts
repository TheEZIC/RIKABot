import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import Controller from "../Controller";
import Guild from "../Models/Guild";

export default class GuildController extends Controller<Guild> {
    public async create(guildId: string): Promise<Guild> {
        const guild = this.repository.create({ guildId });
        await this.repository.save(guild);
        return guild;
    }

    public async findByGuildId(guildId: string): Promise<Guild> {
        const guild = await this.repository.findOne({ where: { guildId } });
        return guild;
    }

    public async update(
        guildId: string,
        data: QueryDeepPartialEntity<Guild>,
    ): Promise<Guild> {
        await this.repository.update({ guildId }, data);
        const guild = await this.findByGuildId(guildId);
        return guild;
    }
}