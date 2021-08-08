import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'
import theme from '../theme'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { MeDocument, MeQuery } from '../generated/graphql'

// настройка кэша https://www.apollographql.com/docs/react/caching/cache-configuration/
// настройка поведения кэша https://www.apollographql.com/docs/react/caching/cache-field-behavior/
const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                postGetAll: {
                    keyArgs: [],
                    merge: (existing, incoming) => {
                        if (existing instanceof Array) {
                            return existing.concat(incoming)
                        }
                        return incoming
                    },
                },
            },
        },
        Mutation: {
            fields: {
                userLogin: {
                    merge: (_, incoming, { cache }) => {
                        cache.modify({
                            fields: {
                                // не прокидываем сам объект, а просто его ссылку
                                userMe() {
                                    return incoming
                                },
                            },
                        })
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

const client = new ApolloClient({
    connectToDevTools: true,
    uri: 'http://localhost:5000/graphql',
    cache,
    credentials: 'include',
})

function MyApp({ Component, pageProps }) {
    return (
        <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
                <ColorModeProvider>
                    <CSSReset />
                    <Component {...pageProps} />
                </ColorModeProvider>
            </ThemeProvider>
        </ApolloProvider>
    )
}

export default MyApp
