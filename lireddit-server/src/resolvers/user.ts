import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql'
import { User } from '../entities/User'
import { MyContext } from '../../types'
import argon2 from 'argon2'
import { COOKIE_NAME } from '../constants'

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
    async userMe(@Ctx() { req }: MyContext): Promise<User | null> {
        if (!req.session.userId) {
            return null
        }

        const user = await User.findOne(req.session.userId)

        if (!user) {
            return null
        }

        return user
    }

    @Mutation(() => User)
    async userRegister(
        @Arg('input', () => UserInput) { username, password }: UserInput,
        @Ctx() { req }: MyContext,
    ): Promise<User> {
        const hashedPassword = await argon2.hash(password)
        const user = await User.create({
            username: username,
            password: hashedPassword,
        })

        await user.save()

        req.session.userId = user.id

        return user
    }

    @Mutation(() => User, { nullable: true })
    async userLogin(
        @Arg('input', () => UserInput) { username, password }: UserInput,
        @Ctx() { req }: MyContext,
    ): Promise<User | null> {
        const user = await User.findOne({
            where: {
                username,
            },
        })

        if (!user) {
            return null
        }

        const isValid = await argon2.verify(user.password, password)

        if (!isValid) {
            return null
        }

        req.session.userId = user.id

        return user
    }

    @Mutation(() => Boolean)
    async userLogout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
        return new Promise((resolve) =>
            req.session.destroy((err: any) => {
                res.clearCookie(COOKIE_NAME)
                if (err) {
                    resolve(false)
                    return
                }
                resolve(true)
            }),
        )
    }
}
