import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'
import theme from '../theme'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

// настройка кэша https://www.apollographql.com/docs/react/caching/cache-configuration/
// настройка поведения кэша https://www.apollographql.com/docs/react/caching/cache-field-behavior/
const cache = new InMemoryCache({})

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
