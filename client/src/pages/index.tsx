import { NextPage } from 'next'
import { NavBar } from '../components/Navbar'
import { PostsQuery, usePostsQuery } from '../generated/graphql'
import { gql, NetworkStatus, useMutation, useQuery, useReactiveVar } from '@apollo/client'
import { isAuthVar } from '../apollo'

// https://www.apollographql.com/docs/react/api/react/hooks/#usequery
const Index: NextPage = () => {
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

    const [deletePost, {}] = useMutation(gql`
        mutation MutationA {
            kavo @client
        }
    `)
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
                                deletePost({
                                    variables: {
                                        id: p.id,
                                    },
                                    update: (cache, _, { variables }) => {
                                        // одно и тоже
                                        console.log(`Post:${variables.id}`)
                                        console.log(cache.identify(p))

                                        cache.evict({
                                            id: `Post:${variables.id}`,
                                            broadcast: true,
                                        })
                                    },
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
export default Index
