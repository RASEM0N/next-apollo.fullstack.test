import React, { useEffect } from 'react'
import { Box, Link, Flex, Button } from '@chakra-ui/core'
import NextLink from 'next/link'
import { MeDocument, MeQuery, useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils'
import { useApolloClient } from '@apollo/client'
import { isAuthLoadingVar, isAuthVar } from '../apollo'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const {
        data,
        loading: fetching,
        networkStatus,
    } = useMeQuery({
        skip: isServer(),
        notifyOnNetworkStatusChange: true,
    })
    const apolloClient = useApolloClient()
    const [logout, { loading: fetchingLogout }] = useLogoutMutation()
    let body = null

    useEffect(() => {
        isAuthLoadingVar(fetching)
    }, [fetching])

    console.log(networkStatus)

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
                <Box mr={2}>{data.userMe.username}</Box>1
                <Button
                    onClick={async () => {
                        await logout()
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
            <NextLink href="/">
                <Link
                    mr={2}
                    style={{
                        fontWeight: 'bolder',
                    }}
                >
                    HOME
                </Link>
            </NextLink>
            <Box ml={'auto'}>{body}</Box>
        </Flex>
    )
}
