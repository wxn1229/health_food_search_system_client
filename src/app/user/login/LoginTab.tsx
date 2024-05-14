"use client";

import {
  ForgetInputType,
  LoginInputType,
  SignupInputType,
} from "@/types/LogintType";
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
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";

export default function LoginTab() {
  const [selected, setSelected] = useState<Key>("login");

  const [passwordValid, setPasswordValid] = useState(true);
  const [checkPasswordCorrect, setCheckPasswordCorrect] = useState(false);
  const [loginInput, setLoginInput] = useState<LoginInputType>({
    email: "",
    password: "",
  });
  const [signupInput, setSignupInput] = useState<SignupInputType>({
    name: "",
    email: "",
    password: "",
    checkPassword: "",
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

      if (loginResult.status === 200) {
        localStorage.setItem("user_token", loginResult.data.token);
        console.log("success get user_token");
        login(loginResult.data.user_name);
        alert(`success login ${loginResult.data.user_name}`);
        router.push("/");
      }
      console.log("🚀 ~ loginHandler ~ loginInput:", loginInput);

      console.log("🚀 ~ loginHandler ~ loginResult:", loginResult);
    } catch (error) {
      console.log("🚀 ~ loginHandler ~ error:", error);
    }
  }

  async function signupHandler() {
    try {
      const signupResult = await axios.post("/api/user/signup", {
        email: signupInput.email,
        name: signupInput.name,
        password: signupInput.password,
      });
    } catch (error) {
      console.log("🚀 ~ signupHandler ~ error:", error);
    }
  }

  useEffect(() => {
    console.log("🚀 ~ LoginTab ~ signupInput:", signupInput);
  }, [signupInput]);

  useEffect(() => {
    if (signupInput.password === signupInput.checkPassword) {
      setCheckPasswordCorrect(true);
    } else {
      setCheckPasswordCorrect(false);
    }
  }, [signupInput]);
  useEffect(() => {
    if (signupInput.password.length >= 8) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  }, [signupInput]);

  return (
    <div className="flex flex-col w-full h-full min-h-screen items-center justify-center">
      <Card className="max-w-full w-[50%] mb-20">
        <CardBody className="overflow-hidden">
          <div className="flex w-full">
            <div className="w-[50%]">
              <Image
                isZoomed
                alt="Album cover"
                className="object-cover"
                height={512}
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
                      isRequired
                      label="Name"
                      placeholder="Enter your name"
                      type="name"
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
                      <Button fullWidth color="primary">
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
