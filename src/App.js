import React, { useState } from "react"
import ReactDOM from "react-dom"
import { Global, css } from "@emotion/react"
import {
  Button,
  Input,
  InputField,
  Stack,
  FieldStack,
  Code,
  Card
} from "bumbag"
import { useForm, FormProvider, useFormContext } from "react-hook-form"

const App = () => {
  let formMethods = useForm()
  let { register, handleSubmit } = formMethods

  let [formData, setSubmit] = useState({})

  const onSubmit = handleSubmit((data) => {
    setSubmit(data)
  })

  let { ref: usernameRef, ...usernameFormProps } = register("username", {
    required: true
  })

  let { ref: passwordRef, ...passwordFormProps } = register("password", {
    required: true
  })
  return (
    <Stack orientation="horizontal">
      <Card>
        <FormProvider {...formMethods}>
          <form onSubmit={onSubmit}>
            <FieldStack>
              <InputField
                label="Username"
                autoComplete="username"
                inputRef={usernameRef}
                {...usernameFormProps}
              />
              <InputField
                label="Password"
                type="password"
                autoComplete="current-password"
                inputRef={passwordRef}
                {...passwordFormProps}
              />
              <Button type="submit">Submit</Button>
            </FieldStack>
          </form>
        </FormProvider>
      </Card>
      <Card>
        <Code>{JSON.stringify(formData)}</Code>
      </Card>
    </Stack>
  )
}

export default App
