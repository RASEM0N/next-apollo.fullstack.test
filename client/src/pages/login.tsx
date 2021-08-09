import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button } from '@chakra-ui/core'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { MeDocument, RegularUserFragmentDoc, useLoginMutation } from '../generated/graphql'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { NavBar } from '../components/Navbar'
import { useApolloClient, useReactiveVar } from '@apollo/client'
import { isAuthLoadingVar, isAuthVar, withApollo } from '../apollo'

const Login: React.FC<{}> = ({}) => {
    const router = useRouter()
    const [loginMutation, { data }] = useLoginMutation({})

    // на авторизацию
    const isAuth = useReactiveVar(isAuthVar)

    // на начальную загрузку
    // но лучше конечно делать не на loading, а
    // на network статус
    const isAuthLoading = useReactiveVar(isAuthLoadingVar)

    const login = (values: { username: string; password: string }) => {
        return loginMutation({
            variables: {
                input: values,
            },
            update: (cache, { data, errors }, _) => {
                if (data.userLogin) {
                    cache.writeQuery({
                        query: MeDocument,
                        data: { userMe: data.userLogin },
                    })
                }
            },
        })
    }

    return (
        <>
            <NavBar />
            <Wrapper variant="small">
                <Head>
                    <title>Login</title>
                </Head>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    onSubmit={async (values, { setErrors }) => {
                        const response = await login(values)
                        if (response.data?.userLogin) {
                            // return router.push('/')
                        }
                        if (response.errors) {
                            setErrors({
                                password: 'Invalid field',
                                username: 'Invalid field',
                            })
                            alert(`Ошибка авторизации`)
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <InputField name="username" placeholder="username" label="Username" />
                            <Box mt={4}>
                                <InputField
                                    name="password"
                                    placeholder="password"
                                    label="Password"
                                    type="password"
                                />
                            </Box>
                            <Button
                                mt={4}
                                type="submit"
                                isLoading={isSubmitting}
                                variantColor="teal"
                            >
                                login
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </>
    )
}

export default withApollo({ ssr: false })(Login)
