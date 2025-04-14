import { useState } from "react";

const usePwdValidation = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [err, setErr] = useState("");

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handlePasswordConfirmation = (e) => {
    setPasswordConfirmation(e.target.value);
  };

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_./\'":])[A-Za-z\d!@#$%^&*()_./\'":]{8,}$/;

  const validateForm = () => {
    if ([password, passwordConfirmation].some((field) => !field?.trim())) {
      setErr("fill the fields");
      return err;
    } else if (
      password !== passwordConfirmation ||
      !passwordPattern.test(password)
    ) {
      setErr("invalid password");
      return err;
    }
    setErr("");
    return true;
  };

  return {
    password,
    passwordConfirmation,
    setPassword,
    setPasswordConfirmation,
    handlePassword,
    handlePasswordConfirmation,
    validateForm,
    err,
  };
};

export default usePwdValidation;
