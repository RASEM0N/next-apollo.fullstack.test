import React from 'react'
import { Box, Link, Flex, Button } from '@chakra-ui/core'
import NextLink from 'next/link'
import { MeDocument, MeQuery, useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils'
import { useApolloClient } from '@apollo/client'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const { data, loading: fetching } = useMeQuery({
        skip: isServer(),
    })
    const apolloClient = useApolloClient()
    const [logout, { loading: fetchingLogout }] = useLogoutMutation()
    let body = null

    // data is loading
    if (fetching) {
        // user not logged in
    } else if (!data?.userMe) {
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={2}>login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link>register</Link>
                </NextLink>
            </>
        )
        // user is logged in
    } else {
        body = (
            <Flex>
                <Box mr={2}>{data.userMe.username}</Box>
                <Button
                    onClick={async () => {
                        await logout({
                            update: (cache, { data, errors }) => {
                                // но так в кэше останется user
                                // cache.writeQuery({
                                //     query: MeDocument,
                                //     data: {
                                //         userMe: null,
                                //     },
                                // })

                                // нахоодим нашего пользователя
                                // или просто взять у data (из useMeQuery)
                                const { userMe }: MeQuery = cache.readQuery({
                                    query: MeDocument,
                                })

                                // удаляем из кэша пользователя
                                cache.evict({
                                    id: cache.identify(userMe),
                                })
                            },
                        })

                        // после resetStore заного
                        // запускаются query (которые нужны странице)

                        // работает асинхронно по этому
                        // await apolloClient.resetStore()
                    }}
                    isLoading={fetchingLogout}
                    variant="link"
                >
                    logout
                </Button>
            </Flex>
        )
    }

    return (
        <Flex bg="tan" p={4}>
            <Box ml={'auto'}>{body}</Box>
        </Flex>
    )
}
