import { Query, Resolver } from 'type-graphql'

@Resolver()
export class HelloResolver {
    @Query(() => String)
    posts() {
        return 'Hello world'
    }
}