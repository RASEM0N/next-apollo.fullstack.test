import React from 'react'
import { NextPage } from 'next'
import { Form, Formik, useFormik } from 'formik'
import { Box, Button } from '@chakra-ui/core'
import { InputField } from 'components/InputField'
import { Wrapper } from '../components/Wrapper'

interface RegisterPageProps {}

interface RegisterForm {
    username: string
    password: string
}

const Register: NextPage<RegisterPageProps> = ({}) => {
    //...
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={(values) => {
                    console.log(values)
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
