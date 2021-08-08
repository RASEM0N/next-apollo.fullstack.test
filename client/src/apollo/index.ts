import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client'
import { MeDocument, MeQuery } from '../generated/graphql'

export const isAuthVar = makeVar<boolean>(false)
export const isAuthLoadingVar = makeVar<boolean>(false)

export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                postGetAll: {
                    // keyArgs https://www.apollographql.com/docs/react/pagination/key-args/#gatsby-focus-wrapper
                    keyArgs: [],
                    merge: (existing, incoming) => {
                        if (existing instanceof Array) {
                            return existing.concat(incoming)
                        }
                        return incoming
                    },
                },
                userMe: {
                    read: (existing, _) => {
                        if (existing) {
                            isAuthVar(true)
                        } else {
                            isAuthVar(false)
                        }
                        return existing
                    },
                },
            },
        },
        Mutation: {
            fields: {
                userLogin: {
                    merge: (_, incoming, { cache }) => {
                        // вроде как асинхроно меняет

                        // cache.modify({
                        //     fields: {
                        //         // не прокидываем сам объект, а просто его ссылку
                        //         userMe() {
                        //             return incoming
                        //         },
                        //     },
                        // })
                        return incoming
                    },
                },
                userLogout: {
                    merge: (_, incoming, { cache }) => {
                        const { userMe }: MeQuery = cache.readQuery({
                            query: MeDocument,
                        })

                        cache.evict({
                            id: cache.identify(userMe),
                        })

                        return incoming
                    },
                },
            },
        },
    },
})

export const createClient = (ctx?: any) => {
    return new ApolloClient({
        connectToDevTools: true,
        uri: 'http://localhost:5000/graphql',
        cache,
        credentials: 'include',
    })
}

export const client = createClient()
