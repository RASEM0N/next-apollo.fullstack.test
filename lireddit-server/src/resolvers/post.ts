import { Post } from '../entities/Post'
import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql'

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    postGetAll(): Promise<Post[]> {
        return Post.find()
    }

    @Query(() => Post, { nullable: true })
    postGetById(@Arg('id', () => ID) id: number): Promise<Post | undefined> {
        return Post.findOne(id)
    }

    @Mutation(() => Post)
    async postCreate(@Arg('title') title: string): Promise<Post> {
        const post = Post.create({
            title,
        })

        await post.save()
        return post
    }

    @Mutation(() => Post, { nullable: true })
    async postUpdate(
        @Arg('id', () => ID) id: number,
        @Arg('title', { nullable: true }) title: string,
    ): Promise<Post | null> {
        const post = await Post.findOne(id)
        if (!post) {
            return null
        }
        if (typeof title !== 'undefined') {
            post.title = title
            await post.save()
        }
        return post
    }

    @Mutation(() => Boolean)
    async postDelete(@Arg('id', () => ID) id: number): Promise<Boolean> {
        await Post.delete(id)
        return true
    }
}
