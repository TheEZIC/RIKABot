import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Guild {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    guildId: string;

    @Column({
        nullable: true,
    })
    matchInfoChannelId: string;

    @Column({
        nullable: true,
    })
    ownerRoleId: string;

    @Column({
        nullable: true,
    })
    refereeRoleId: string;
}