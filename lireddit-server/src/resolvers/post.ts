import { Post } from '../entities/Post'
import { Arg, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql'
import { MyContext } from '../../types'

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    postGetAll(@Ctx() ctx: MyContext): Promise<Post[]> {
        return ctx.em.find(Post, {})
    }

    @Query(() => Post, { nullable: true })
    postGetById(
        @Arg('id', () => ID) id: number,
        @Ctx() ctx: MyContext,
    ): Promise<Post | null> {
        return ctx.em.findOne(Post, { id })
    }

    @Mutation(() => Post)
    async postCreate(
        @Arg('title') title: string,
        @Ctx() ctx: MyContext,
    ): Promise<Post> {
        const post = ctx.em.create(Post, {
            title,
        })
        await ctx.em.persistAndFlush(post)
        return post
    }

    @Mutation(() => Post, { nullable: true })
    async postUpdate(
        @Arg('id', () => ID) id: number,
        @Arg('title', { nullable: true }) title: string,
        @Ctx() ctx: MyContext,
    ): Promise<Post | null> {
        const post = await ctx.em.findOne(Post, { id })
        if (!post) {
            return null
        }
        if (typeof title !== 'undefined') {
            post.title = title
            await ctx.em.persistAndFlush(post)
        }
        return post
    }

    @Mutation(() => Boolean)
    async postDelete(
        @Arg('id', () => ID) id: number,
        @Ctx() ctx: MyContext,
    ): Promise<Boolean> {
        return await ctx.em.nativeDelete(Post, {
            id,
        }) === 1
    }
}
