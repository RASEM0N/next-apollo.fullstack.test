import { ApolloClient, concat, from, gql, HttpLink, InMemoryCache, makeVar } from '@apollo/client'
import { MeDocument, MeQuery } from '../generated/graphql'
import { withApollo as createWithApollo } from 'next-apollo'
import { setContext } from '@apollo/client/link/context'
import { isServer } from '../utils'
import { onError } from '@apollo/client/link/error'
import { BatchHttpLink } from '@apollo/client/link/batch-http'

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

const authMiddleware = setContext((operation, prevContext) => {
    // достаем header, которые установленны до контекста
    const { headers, canHazPancakes } = prevContext

    // хз шо такое
    if (canHazPancakes) {
        return prevContext
    }

    let token: string

    // если не сделать, то магия ssr не получится
    // т.к. window нету на сервере
    if (isServer()) {
        token = ' ^*^ /'
    } else {
        token = localStorage.getItem('token') || '* ^*^ /'
    }

    return {
        ...prevContext,
        headers: {
            ...headers,
            authorization: `Bearer ${token}`,
        },
    }
})

// конечная link
// или createHttpLink
const httpLink = new HttpLink({
    uri: 'http://localhost:5000/graphql',
    credentials: 'include', // если домен разный
})

// конечная link
// объединяет несколько graphql операций в 1 http запрос
const batchLink = new BatchHttpLink({
    headers: {
        bathLink: 'yes yes yes',
    },
    uri: 'http://localhost:5000/graphql',
    // максимально кол-во операций
    batchMax: 5,
    // интервал ожидания в мс (т.е. с 1 операций ждет и накапливает до 5 операций 20мс)
    batchInterval: 20,
    batchDebounce: true, // интервал сбрасывает каждый, когда добавляется новая операция
})

// если ошибка в ответе
const errorMiddleware = onError((error) => {
    const { statusCode, message } = error.networkError as any
    if (statusCode === 500) {
        console.log(`Server has error a ${message}`)
    }
})

// https://www.apollographql.com/docs/react/networking/advanced-http-networking/#modifying-response-data
// также можно сделать и на изменение ответа до того, как закэшируется

// httpLink должна быть в конце т.к. после нее
// запрос уже отправлен, и дальнейшие элеметы не выполняются

// через from
// как middlewares получается
const link = from([
    authMiddleware,
    errorMiddleware,
    // httpLink,
    batchLink,
])

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
