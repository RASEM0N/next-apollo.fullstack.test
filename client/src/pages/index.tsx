import { NextPage } from 'next'
import { NavBar } from '../components/Navbar'
import { PostsQuery, usePostsQuery } from '../generated/graphql'
import {
    gql,
    NetworkStatus,
    useApolloClient,
    useMutation,
    useQuery,
    useReactiveVar,
} from '@apollo/client'
import { isAuthVar, withApollo } from '../apollo'
import Login from './login'

// https://www.apollographql.com/docs/react/api/react/hooks/#usequery
const Index = () => {
    // https://www.apollographql.com/docs/react/api/react/hooks/#usequery
    const { data, loading, error, fetchMore, networkStatus } = usePostsQuery({
        notifyOnNetworkStatusChange: true,
    })
    const { data: dataNumber } = useQuery(
        gql`
            query ($ban: String!) {
                getNumber(ban: $ban) @client
            }
        `,
        {
            variables: {
                ban: 'fsdfds',
            },
        },
    )

    const client = useApolloClient()
    const fetchPosts = async () => {
        await fetchMore({
            variables: {},
        })
    }

    // можно использовать useQuery
    // но тогда придется писать документ
    // query isAuthorized {
    //         isAuth @client
    //     }

    // а можно просто так, но уже
    // через реактивную переменую
    // и нам просто надо где-то меняеть ее

    const isAuth = useReactiveVar(isAuthVar)
    // console.log(isAuth ? 'авторизован' : 'не авторизован')

    // if (networkStatus === NetworkStatus.error) ....
    return (
        <>
            <NavBar />
            <div>Hello world</div>
            {data &&
                data.postGetAll.map((p) => (
                    <div
                        key={p.id}
                        style={{
                            marginTop: 20,
                            border: '1px solid black',
                            display: 'flex',
                        }}
                    >
                        {p.title}
                        <button
                            style={{
                                border: '1px solid chocolate',
                                marginLeft: 40,
                            }}
                            onClick={() => {
                                // одно и тоже
                                console.log(`Post:${p.id}`)
                                console.log(client.cache.identify(p))
                                client.cache.evict({
                                    id: `Post:${p.id}`,
                                    broadcast: true,
                                })
                            }}
                        >
                            удалить
                        </button>
                    </div>
                ))}
        </>
    )
}
// ssr true - usePostQuery на сервере
export default withApollo({ ssr: true })(Index)
