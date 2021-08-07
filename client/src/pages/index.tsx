import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import { NavBar } from '../components/Navbar'
import { createUrqlClient } from '../utils'
import { usePostsQuery } from '../generated/graphql'

const Index: NextPage = () => {
    const [{ data }] = usePostsQuery()
    return (
        <>
            <NavBar />
            <div>Hello world</div>
            {data && data.postGetAll.map((p) => <div>{p.title}</div>)}
        </>
    )
}
// ssr true - usePostQuery на сервере
export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
