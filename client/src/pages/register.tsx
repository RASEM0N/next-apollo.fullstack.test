import React from 'react'
import { NextPage } from 'next'
import { Form, Formik, useFormik } from 'formik'
import { Box, Button } from '@chakra-ui/core'
import { InputField } from 'components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useMutation } from 'urql'
import { useRegisterMutation } from '../generated/graphql'
import { useRouter } from 'next/router'

interface RegisterPageProps {}

const REGISTER_MUTATION = `
    mutation createNewUser($username:String!, $password:String!){
        userRegister(input: {
                username: $username,
                password: $password
        }) {
            id
            username
            createdAt
            updatedAt        
        }
    }
`

const Register: NextPage<RegisterPageProps> = ({}) => {
    const router = useRouter()
    const [, register] = useRegisterMutation()

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={async (values) => {
                    const response = await register(values)

                    if (response.data?.userRegister) {
                        return router.push('/')
                    }

                    if (response.error) {
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

export default Register
