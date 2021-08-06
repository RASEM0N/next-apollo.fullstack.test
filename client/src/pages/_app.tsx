import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'

import { Provider, createClient, dedupExchange, fetchExchange } from 'urql'
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache'
import theme from '../theme'
import {
    MeDocument,
    LoginMutation,
    MeQuery,
    RegisterMutation,
    LogoutMutation,
} from '../generated/graphql'

function betterUpdateQuery<Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: Result, q: Query) => Query,
) {
    return cache.updateQuery(qi, (data) => fn(result, data as any) as any)
}

const client = createClient({
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
        fetchExchange,
    ],
})

function MyApp({ Component, pageProps }) {
    return (
        <Provider value={client}>
            <ThemeProvider theme={theme}>
                <ColorModeProvider>
                    <CSSReset />
                    <Component {...pageProps} />
                </ColorModeProvider>
            </ThemeProvider>
        </Provider>
    )
}

export default MyApp
