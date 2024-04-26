"use client";
import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Spacer,
} from "@nextui-org/react";
import Logo from "./Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Divider } from "@nextui-org/react";

export default function Header() {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <div className="w-full ">
      <Navbar position="static" className="w-full border-b-1">
        <NavbarBrand>
          <Logo />
          <Spacer x={4} />
          <p className="font-bold text-inherit">HFS&CS</p>

          <Spacer x={4} />
          <ThemeSwitcher />
        </NavbarBrand>
        <NavbarContent className="sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="#">
              Search
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="#" aria-current="page">
              like
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Integrations
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            {isLogin ? (
              <Button
                onClick={() => {
                  setIsLogin(false);
                }}
                as={Link}
                color="warning"
                href="#"
                variant="ghost"
              >
                Log out
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setIsLogin(true);
                }}
                as={Link}
                color="primary"
                href="#"
                variant="ghost"
              >
                Sign Up
              </Button>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <Divider className="my-4"></Divider>
    </div>
  );
}
