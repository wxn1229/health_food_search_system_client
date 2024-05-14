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
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  return (
    <div className="w-full ">
      <Navbar position="static" className="w-full ">
        <NavbarBrand
          className="cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
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
            <p>
              Hello, <span>{user.isAuth ? user.user_name : "guest"}</span>
            </p>
          </NavbarItem>
          <NavbarItem>
            {user.isAuth ? (
              <Button
                onClick={() => {
                  localStorage.removeItem("user_token");
                  logout();
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
                as={Link}
                color="primary"
                href="/user/login"
                variant="ghost"
              >
                Login
              </Button>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <Divider className=""></Divider>
    </div>
  );
}
