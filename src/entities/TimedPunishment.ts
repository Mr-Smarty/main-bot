import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm"

@Entity()
export default class TimedPunishment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 18 })
    user: string

    @Column()
    type: "mute" | "ban"

    @Column()
    end: number
}
