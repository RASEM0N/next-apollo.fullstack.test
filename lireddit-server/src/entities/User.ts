import { Field, ID, ObjectType } from 'type-graphql'
import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@ObjectType()
@Entity()
export class User {
    @Field(() => ID)
    @PrimaryKey()
    id!: number

    @Field(() => String)
    @Property({ type: 'date' })
    createdAt: Date = new Date()

    @Field(() => String)
    @Property({ type: 'date', onUpdate: () => new Date() })
    updatedAt: Date = new Date()

    @Field(() => String)
    @Property({ type: 'text', unique: true })
    username!: string

    @Property({ type: 'text' })
    password!: string
}