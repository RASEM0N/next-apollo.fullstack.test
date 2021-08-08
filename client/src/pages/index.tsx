import { NextPage } from 'next'
import { NavBar } from '../components/Navbar'
import { PostsQuery, usePostsQuery } from '../generated/graphql'
import { NetworkStatus, useReactiveVar } from '@apollo/client'
import { isAuthVar } from '../apollo'

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

    // можно использовать useQuery
    // но тогда придется писать документ
    // query isAuthorized {
    //         isAuth @client
    //     }

    // а можно просто так, но уже
    // через реактивную переменую
    // и нам просто надо где-то меняеть ее

    const isAuth = useReactiveVar(isAuthVar)
    console.log(isAuth ? 'авторизован' : 'не авторизован')

    // if (networkStatus === NetworkStatus.error) ....
    return (
        <>
            <NavBar />
            <div>Hello world</div>
            {data && data.postGetAll.map((p) => <div key={p.id}>{p.title}</div>)}
        </>
    )
}
// ssr true - usePostQuery на сервере
export default Index
