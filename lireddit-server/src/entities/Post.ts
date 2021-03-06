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
export class Post extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date

    @Field(() => String)
    @Column({ type: 'text' })
    title!: string
}
