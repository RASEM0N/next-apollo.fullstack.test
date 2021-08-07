import { Field, ID, ObjectType } from 'type-graphql'
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from 'typeorm'

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date = new Date()

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date

    @Field(() => String)
    @Column({ type: 'text', unique: true })
    username!: string

    @Column({ type: 'text' })
    password!: string
}