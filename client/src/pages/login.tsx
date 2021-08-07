import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button } from '@chakra-ui/core'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { MeDocument, RegularUserFragmentDoc, useLoginMutation } from '../generated/graphql'
import { useRouter } from 'next/router'
import Head from 'next/head'

const Login: React.FC<{}> = ({}) => {
    const router = useRouter()
    const [loginMutation, { data }] = useLoginMutation({})

    const login = (values: { username: string; password: string }) => {
        return loginMutation({
            variables: {
                input: values,
            },
            // updateQueries,
            // https://www.apollographql.com/docs/react/caching/cache-interaction/#using-graphql-queries
            // если использовать writeFragments то все с использованием одного и того же фрагмента
            // обновятся
            update: (cache, { data, errors }, _) => {
                // if (data.userLogin) {
                //     cache.writeQuery({
                //         query: MeDocument,
                //         data: { userMe: data.userLogin },
                //     })
                // }
                // cache.writeFragment({
                //     fragment: RegularUserFragmentDoc,
                //     data: {
                //         ...data.userLogin
                //     }
                // })
            },
        })
    }

    return (
        <Wrapper variant="small">
            <Head>
                <title>Login</title>
            </Head>
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values)
                    if (response.data?.userLogin) {
                        return router.push('/')
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
                        <Button mt={4} type="submit" isLoading={isSubmitting} variantColor="teal">
                            login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default Login
