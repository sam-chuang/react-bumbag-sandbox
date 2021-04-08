function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useState } from "../snowpack/pkg/react.js";
import ReactDOM from "../snowpack/pkg/react-dom.js";
import { Global, css } from "../snowpack/pkg/@emotion/react.js";
import { Button, Input, InputField, Stack, FieldStack, Code, Card } from "../snowpack/pkg/bumbag.js";
import { useForm, FormProvider, useFormContext } from "../snowpack/pkg/react-hook-form.js";
import { jsx as ___EmotionJSX } from "../snowpack/pkg/@emotion/react.js";

const App = () => {
  let formMethods = useForm();
  let {
    register,
    handleSubmit
  } = formMethods;
  let [formData, setSubmit] = useState({});
  const onSubmit = handleSubmit(data => {
    setSubmit(data);
  });
  let {
    ref: usernameRef,
    ...usernameFormProps
  } = register("username", {
    required: true
  });
  let {
    ref: passwordRef,
    ...passwordFormProps
  } = register("password", {
    required: true
  });
  return ___EmotionJSX(Stack, {
    orientation: "horizontal"
  }, ___EmotionJSX(Card, null, ___EmotionJSX(FormProvider, formMethods, ___EmotionJSX("form", {
    onSubmit: onSubmit
  }, ___EmotionJSX(FieldStack, null, ___EmotionJSX(InputField, _extends({
    label: "Username",
    autoComplete: "username",
    inputRef: usernameRef
  }, usernameFormProps)), ___EmotionJSX(InputField, _extends({
    label: "Password",
    type: "password",
    autoComplete: "current-password",
    inputRef: passwordRef
  }, passwordFormProps)), ___EmotionJSX(Button, {
    type: "submit"
  }, "Submit"))))), ___EmotionJSX(Card, null, ___EmotionJSX(Code, null, JSON.stringify(formData))));
};

export default App;