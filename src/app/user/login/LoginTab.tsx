"use client";

import {
  ForgetInputType,
  LoginInputType,
  SignupInputType,
} from "@/types/LoginType";
import { useAuth } from "@/utils/AuthContext";
import { default as axios } from "@/utils/axios";
import {
  Tab,
  Tabs,
  Button,
  Card,
  CardBody,
  Input,
  Link,
  Image,
  Slider,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";

export default function LoginTab() {
  const [selected, setSelected] = useState<Key>("login");
  const [passwordValid, setPasswordValid] = useState(true);
  const [checkPasswordCorrect, setCheckPasswordCorrect] = useState(false);
  const [checkName, setCheckName] = useState(true);
  const [userGender, setUserGender] = useState("male");
  const [loginInput, setLoginInput] = useState<LoginInputType>({
    email: "",
    password: "",
  });
  const [signupInput, setSignupInput] = useState<SignupInputType>({
    name: "",
    email: "",
    password: "",
    checkPassword: "",
    gender: true,
    age: 18,
  });
  const [forgetInput, setForgetInput] = useState<ForgetInputType>({
    email: "",
  });

  const { login } = useAuth();
  const router = useRouter();

  async function loginHandler() {
    try {
      const loginResult = await axios.post("/api/user/login", {
        email: loginInput.email,
        password: loginInput.password,
      });
      console.log("🚀 ~ loginHandler ~ loginResult:", loginResult);
      if (loginResult.status === 200) {
        localStorage.setItem("user_token", loginResult.data.token);
        console.log("success get user_token");
        login(loginResult.data.user_name);
        alert(`success login ${loginResult.data.user_name}`);
        router.push("/");
      } else console.log("🚀 ~ loginHandler ~ loginInput:", loginInput);

      console.log("🚀 ~ loginHandler ~ loginResult:", loginResult);
    } catch (error: AxiosError | any) {
      console.log("🚀 ~ loginHandler ~ error:", error);
      console.log("🚀 ~ loginHandler ~ error:", error.response);
      if (error.response.status === 405) {
        alert("Please sign up an account");
        setSelected("sign-up");
      } else if (error.response.status === 401) {
        alert("your password or email is not correct");
      } else {
        alert("server error");
      }
    }
  }

  async function signupHandler() {
    try {
      if (checkPasswordCorrect && passwordValid && checkName) {
        const signupResult = await axios.post("/api/user/signup", {
          email: signupInput.email,
          username: signupInput.name,
          password: signupInput.password,
          age: signupInput.age,
          gender: signupInput.gender,
        });

        if (signupResult) {
          alert("sign up success");
          setSelected("login");
          setSignupInput({
            name: "",
            email: "",
            password: "",
            checkPassword: "",
            gender: true,
            age: 18,
          });
        }
      } else {
        alert(
          "Please make your password conform to the format and confirm that the check password is correct"
        );
      }
    } catch (error: any) {
      console.log("🚀 ~ signupHandler ~ error:", error);
      if (error.response.status === 406) {
        alert("This email address has already been sign up");
      } else if (error.response.status === 407) {
        alert("This user name has already been sign up");
      } else {
        alert("server error");
      }
    }
  }

  useEffect(() => {
    console.log("🚀 ~ LoginTab ~ signupInput:", signupInput);
  }, [signupInput]);

  // checkpassword and password are same
  useEffect(() => {
    if (signupInput.password === signupInput.checkPassword) {
      setCheckPasswordCorrect(true);
    } else {
      setCheckPasswordCorrect(false);
    }
  }, [signupInput]);

  // password.length >= 8
  useEffect(() => {
    if (signupInput.password.length >= 8) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  }, [signupInput]);

  // gender

  useEffect(() => {
    if (userGender === "male") {
      setSignupInput((s) => {
        return { ...s, gender: true };
      });
    } else {
      setSignupInput((s) => {
        return { ...s, gender: false };
      });
    }
  }, [userGender]);

  useEffect(() => {
    if (signupInput.name.length >= 1) {
      setCheckName(true);
    } else {
      setCheckName(false);
    }
  }, [signupInput]);

  return (
    <div className="flex flex-col w-full h-full min-h-screen items-center justify-center">
      <Card className="max-w-full min-w-[1100px] w-[60%] mb-20">
        <CardBody className="overflow-hidden">
          <div className="flex w-full">
            <div className="w-[60%]">
              <Image
                isZoomed
                alt="Album cover"
                className="object-cover"
                shadow="md"
                src="/login_pic.webp"
                width="100%"
              />
            </div>
            <div className="mx-auto pt-5">
              <Tabs
                fullWidth
                size="md"
                aria-label="Tabs form"
                selectedKey={selected.toString()}
                onSelectionChange={setSelected}
              >
                <Tab key="login" title="Login">
                  <form className="flex flex-col gap-4">
                    <Input
                      isRequired
                      label="Email"
                      placeholder="Enter your email"
                      type="email"
                      value={loginInput.email}
                      onChange={(e) => {
                        setLoginInput({
                          ...loginInput,
                          email: e.target.value.trim(),
                        });
                      }}
                    />
                    <Input
                      isRequired
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                      value={loginInput.password}
                      onChange={(e) => {
                        setLoginInput({
                          ...loginInput,
                          password: e.target.value.trim(),
                        });
                      }}
                    />
                    <p className="text-center text-small">
                      Need to create an account?{" "}
                      <Link size="sm" onPress={() => setSelected("sign-up")}>
                        Sign up
                      </Link>
                    </p>
                    <p className="text-center text-small">
                      Forget your password?{" "}
                      <Link size="sm" onPress={() => setSelected("forget")}>
                        Forget Password
                      </Link>
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button fullWidth color="primary" onClick={loginHandler}>
                        Login
                      </Button>
                    </div>
                  </form>
                </Tab>
                <Tab key="sign-up" title="Sign up">
                  <form className="flex flex-col gap-4 h-[300px]">
                    <Input
                      label="Name"
                      placeholder="Enter your name"
                      type="name"
                      isInvalid={!checkName}
                      errorMessage={"Name cannot be empty"}
                      value={signupInput.name}
                      onChange={(e) => {
                        setSignupInput({
                          ...signupInput,
                          name: e.target.value,
                        });
                      }}
                    />
                    <Input
                      isRequired
                      label="Email"
                      placeholder="Enter your email"
                      type="email"
                      value={signupInput.email}
                      onChange={(e) => {
                        setSignupInput({
                          ...signupInput,
                          email: e.target.value,
                        });
                      }}
                    />
                    <Slider
                      label="age"
                      step={1}
                      maxValue={150}
                      minValue={1}
                      defaultValue={18}
                      className="max-w-md"
                      value={signupInput.age}
                      onChange={(e) => {
                        setSignupInput({ ...signupInput, age: e });
                      }}
                    />
                    <RadioGroup
                      label="select your gender"
                      orientation="horizontal"
                      defaultValue="male"
                      value={userGender}
                      onValueChange={setUserGender}
                    >
                      <Radio value="male">male</Radio>
                      <Radio value="female">female</Radio>
                    </RadioGroup>
                    <Input
                      isRequired
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                      isInvalid={!passwordValid}
                      errorMessage={
                        "Password must be at least eight characters"
                      }
                      value={signupInput.password}
                      onChange={(e) => {
                        setSignupInput({
                          ...signupInput,
                          password: e.target.value,
                        });
                      }}
                    />
                    <Input
                      isRequired
                      label="CheckPassword"
                      placeholder="Enter your password again"
                      type="password"
                      value={signupInput.checkPassword}
                      errorMessage={"Not the same as password"}
                      isInvalid={!checkPasswordCorrect}
                      onChange={(e) => {
                        setSignupInput({
                          ...signupInput,
                          checkPassword: e.target.value,
                        });
                      }}
                    />
                    <p className="text-center text-small">
                      Already have an account?{" "}
                      <Link size="sm" onPress={() => setSelected("login")}>
                        Login
                      </Link>
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button fullWidth color="primary" onClick={signupHandler}>
                        Sign up
                      </Button>
                    </div>
                  </form>
                </Tab>
                <Tab key="forget" title="Forget Password">
                  <form className="flex flex-col gap-4 h-[300px]">
                    <Input
                      isRequired
                      label="Email"
                      placeholder="Enter your email"
                      type="email"
                      value={forgetInput.email}
                      onChange={(e) => {
                        setForgetInput({
                          ...forgetInput,
                          email: e.target.value,
                        });
                      }}
                    />

                    <p className="text-center text-small">
                      Already have an account?{" "}
                      <Link size="sm" onPress={() => setSelected("login")}>
                        Login
                      </Link>
                    </p>

                    <div className="flex gap-2 justify-end">
                      <Button fullWidth color="primary">
                        Get Password
                      </Button>
                    </div>
                  </form>
                </Tab>
              </Tabs>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
