import { NextPage } from 'next'
import { NavBar } from '../components/Navbar'
import { PostsQuery, usePostsQuery } from '../generated/graphql'
import { NetworkStatus } from '@apollo/client'

// https://www.apollographql.com/docs/react/api/react/hooks/#usequery
const Index: NextPage = () => {
    // https://www.apollographql.com/docs/react/api/react/hooks/#usequery
    const { data, loading, error, fetchMore, networkStatus } = usePostsQuery({
        notifyOnNetworkStatusChange: true,
        ssr: true,
    })
    const fetchPosts = async () => {
        // updateQuery для пагинации
        // по сути дела к старым данным, добавляем новые
        await fetchMore({
            variables: {},
            // Функция, которая позволяет обновить кэшированный результат запроса без выполнения последующей
            updateQuery: (previousQueryResult, { fetchMoreResult }) => {
                if (!fetchMoreResult) {
                    return previousQueryResult
                }

                return {
                    __typename: 'Query',
                    postGetAll: [...previousQueryResult.postGetAll, ...fetchMoreResult.postGetAll],
                }
            },
        })
    }

    // if (networkStatus === NetworkStatus.error) ....
    return (
        <>
            <NavBar />
            <div>Hello world</div>
            {data && data.postGetAll.map((p) => <div>{p.title}</div>)}
        </>
    )
}
// ssr true - usePostQuery на сервере
export default Index
