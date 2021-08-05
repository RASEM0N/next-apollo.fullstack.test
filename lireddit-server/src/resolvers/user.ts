import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from 'type-graphql'
import { User } from '../entities/User'
import { MyContext } from '../../types'
import argon2 from 'argon2'

@InputType()
class UserInput {
    @Field(() => String)
    username: string

    @Field(() => String)
    password: string
}

// болванка
@ObjectType()
class UserOutput {
    @Field(() => Boolean)
    success: boolean

    @Field(() => String, { nullable: true })
    token?: string

    @Field(() => String, { nullable: true })
    error?: string
}

@Resolver()
export class UserResolver {
    @Mutation(() => User)
    async userRegister(
        @Arg('input') { username, password }: UserInput,
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

    @Mutation(() => User, { nullable: true })
    async userLogin(
        @Arg('input') { username, password }: UserInput,
        @Ctx() { em }: MyContext,
    ): Promise<User | null> {
        const user = await em.findOne(User, {
            username,
        })

        if (!user) {
            return null
        }

        const isValid = await argon2.verify(user.password, password)

        if (!isValid) {
            return null
        }

        return user
    }
}