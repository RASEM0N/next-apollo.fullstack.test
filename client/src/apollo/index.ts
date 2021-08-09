import { ApolloClient, concat, gql, HttpLink, InMemoryCache, makeVar } from '@apollo/client'
import { MeDocument, MeQuery } from '../generated/graphql'
import { withApollo as createWithApollo } from 'next-apollo'
import { setContext } from '@apollo/client/link/context'

export const isAuthVar = makeVar<boolean>(false)
export const isAuthLoadingVar = makeVar<boolean>(false)

const cache = new InMemoryCache({
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
                getNumber: {
                    read(_, { variables }) {
                        // console.log(variables)
                        return 1488
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

const authLink = setContext((operation, prevContext) => {
    // достаем header, которые установленны до контекста
    const { headers, canHazPancakes } = prevContext

    // хз шо такое
    if (canHazPancakes) {
        return prevContext
    }

    const token = localStorage.getItem('token') || ' ^*^ /'

    return {
        ...prevContext,
        headers: {
            ...headers,
            __authorization: `Bearer ${token}`,
        },
    }
})

// или createHttpLink
const httpLink = new HttpLink({
    uri: 'http://localhost:5000/graphql',
    credentials: 'include', // если домен разный
    headers: {
        __httpLink: 'header after [authLink]',
    },
})

// httpLink должна быть в конце т.к. после нее
// запрос уже отправлен, и дальнейшие элеметы не выполняются
const link = concat(authLink, httpLink)

export const createClient = (ctx?: any) => {
    return new ApolloClient({
        cache,
        connectToDevTools: true,
        link,
        typeDefs: gql`
            extend type Query {
                getNumber(ban: String): Int!
            }

            #            Хз почему не работает
            #            но Query работает все
            extend type Mutation {
                kavo: Int
            }
        `,
    })
}

export const client = createClient()
export const withApollo = createWithApollo(client)
