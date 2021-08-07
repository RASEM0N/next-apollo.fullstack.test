import React from 'react'
import { Box, Link, Flex, Button } from '@chakra-ui/core'
import NextLink from 'next/link'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{ data, fetching }] = useMeQuery({
        pause: isServer(),
    })
    const [{ fetching: fetchingLogout }, logout] = useLogoutMutation()
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
                    onClick={() => {
                        logout()
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
