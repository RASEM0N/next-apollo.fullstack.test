import { NextPage } from 'next'
import { NavBar } from '../components/Navbar'
import { PostsQuery, usePostsQuery } from '../generated/graphql'
import { NetworkStatus } from '@apollo/client'

// https://www.apollographql.com/docs/react/api/react/hooks/#usequery
const Index: NextPage = () => {
    // https://www.apollographql.com/docs/react/api/react/hooks/#usequery
    const { data, loading, error, fetchMore, networkStatus } = usePostsQuery({
        notifyOnNetworkStatusChange: true,
    })
    const fetchPosts = async () => {
        await fetchMore({
            variables: {},
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
