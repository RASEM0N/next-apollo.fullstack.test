import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from 'type-graphql'
import { User } from '../entities/User'
import { MyContext } from '../../types'
import argon2 from 'argon2'

@InputType()
class UserCreateInput {
    @Field(() => String)
    username: string

    @Field(() => String)
    password: string
}

// болванка
@ObjectType()
class UserCreateOutput {
    @Field(() => Boolean)
    success: boolean

    @Field(() => String, { nullable: true })
    message: string
}

@Resolver()
export class UserResolver {
    @Mutation(() => User)
    async userCreate(
        @Arg('input') { username, password }: UserCreateInput,
        @Ctx() { em }: MyContext,
    ): Promise<User> {
        const hashedPassword = await argon2.hash(password)
        const user = await em.create(User, {
            username: username,
            password: hashedPassword,
        })

        await em.persistAndFlush(user)
        return user
    }
}