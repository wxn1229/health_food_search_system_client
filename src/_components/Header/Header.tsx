"use client";
import React, { useEffect, useState } from "react";
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
import { default as axios } from "@/utils/axios";

export default function Header() {
  const { login } = useAuth();

  useEffect(() => {
    async function verifyToken() {
      try {
        const isVaild = await axios.get("/api/user/verifyToken", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        });

        if (isVaild) {
          login(isVaild.data.user_name);
          console.log("🚀 ~ verifyToken ~ isVaild:", isVaild);
        }
      } catch (error) {
        console.log("🚀 ~ verifyToken ~ error:", error);
      }
    }
    verifyToken();
  }, [login]);
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
              Hello,{" "}
              {user.isAuth ? (
                <Link
                  isBlock
                  showAnchorIcon
                  href={`/user/settings`}
                  color="primary"
                >
                  {user.user_name}
                </Link>
              ) : (
                <span>guest</span>
              )}
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
