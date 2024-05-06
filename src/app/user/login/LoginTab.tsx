"use client";
import ForgetCard from "@/app/user/login/ForgetCard";
import LoginCard from "@/app/user/login/LoginCard";
import SignUpCard from "@/app/user/login/SignUpCard";

import {
  Tab,
  Tabs,
  Button,
  Card,
  CardBody,
  Input,
  Link,
} from "@nextui-org/react";
import { Key, useState } from "react";

export default function LoginTab() {
  const [selected, setSelected] = useState<Key>("login");
  return (
    <div className="flex flex-col w-full h-full min-h-screen items-center justify-center">
      <Card className="max-w-full w-[340px] h-[400px] mb-20">
        <CardBody className="overflow-hidden">
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
                />
                <Input
                  isRequired
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
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
                  <Button fullWidth color="primary">
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
                  type="password"
                />
                <Input
                  isRequired
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                />
                <Input
                  isRequired
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
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
        </CardBody>
      </Card>
    </div>
  );
}
