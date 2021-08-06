import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql'
import { User } from '../entities/User'
import { MyContext } from '../../types'
import argon2 from 'argon2'
import { validate } from 'class-validator'

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
    @Query(() => User, { nullable: true })
    async userMe(@Ctx() { em, req }: MyContext): Promise<User | null> {
        if (!req.session.userId) {
            return null
        }

        const user = await em.findOne(User, {
            id: req.session.userId,
        })

        if (!user) {
            return null
        }

        return user
    }

    @Mutation(() => User)
    async userRegister(
        @Arg('input', () => UserInput) { username, password }: UserInput,
        @Ctx() { em, req }: MyContext,
    ): Promise<User> {
        const hashedPassword = await argon2.hash(password)
        const user = await em.create(User, {
            username: username,
            password: hashedPassword,
        })

        await em.persistAndFlush(user)

        // store user id session
        // this will set a cookie on the user
        // keep them logged in
        req.session.userId = user.id

        return user
    }

    @Mutation(() => User, { nullable: true })
    async userLogin(
        @Arg('input', () => UserInput) { username, password }: UserInput,
        @Ctx() { em, req }: MyContext,
    ): Promise<User | null> {
        const user = await em.findOne(User, {
            username,
        })

        if (!user) {
            return null
        }
        // валидация class-validator, input не работает
        // await validate(user).then(e => console.log(e))
        const isValid = await argon2.verify(user.password, password)

        if (!isValid) {
            return null
        }

        req.session.userId = user.id

        return user
    }
}