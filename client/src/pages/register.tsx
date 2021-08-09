import React from 'react'
import { NextPage } from 'next'
import { Form, Formik } from 'formik'
import { Box, Button } from '@chakra-ui/core'
import { InputField } from 'components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useRegisterMutation } from '../generated/graphql'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { withApollo } from 'apollo'

interface RegisterPageProps {}

const Register: NextPage<RegisterPageProps> = ({}) => {
    const router = useRouter()
    const [register] = useRegisterMutation()

    return (
        <Wrapper variant="small">
            <Head>
                <title>Register</title>
            </Head>
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register({
                        variables: values,
                    })

                    if (response.data?.userRegister) {
                        return router.push('/')
                    }

                    if (response.errors) {
                        setErrors({
                            password: 'Invalid field',
                            username: 'Invalid field',
                        })
                        alert(`Ошибка регистрации`)
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
                            register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default withApollo({ ssr: false })(Register)
