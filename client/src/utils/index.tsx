import { Cache, cacheExchange, QueryInput } from '@urql/exchange-graphcache'
import { ClientOptions, dedupExchange, fetchExchange } from 'urql'
import {
    LoginMutation,
    LogoutMutation,
    MeDocument,
    MeQuery,
    RegisterMutation,
} from '../generated/graphql'

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))
export const isServer = () => typeof window === 'undefined'

function betterUpdateQuery<Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: Result, q: Query) => Query,
) {
    return cache.updateQuery(qi, (data) => fn(result, data as any) as any)
}

export const createUrqlClient = (ssrExchange: any): ClientOptions => ({
    url: 'http://localhost:5000/graphql',
    fetchOptions: () => ({
        credentials: 'include',
    }),
    exchanges: [
        dedupExchange,
        cacheExchange({
            updates: {
                Mutation: {
                    userLogin: (_result, args, cache, info) => {
                        betterUpdateQuery<LoginMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (!result.userLogin) {
                                    return query
                                } else {
                                    return {
                                        userMe: {
                                            ...result.userLogin,
                                            // username: 'Пользователь авторизации',
                                        },
                                    }
                                }
                            },
                        )
                    },
                    userRegister: (_result, args, cache, info) => {
                        betterUpdateQuery<RegisterMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (!result.userRegister) {
                                    return query
                                } else {
                                    return {
                                        userMe: {
                                            ...result.userRegister,
                                            // username: 'Пользователь регистрации',
                                        },
                                    }
                                }
                            },
                        )
                    },
                    userLogout: (_result, args, cache, info) => {
                        betterUpdateQuery<LogoutMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (!result.userLogout) {
                                    return query
                                } else {
                                    return {
                                        userMe: null,
                                    }
                                }
                            },
                        )
                    },
                },
            },
        }),
        ssrExchange,
        fetchExchange,
    ],
})
