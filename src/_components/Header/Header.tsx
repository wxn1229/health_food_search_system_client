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
  const { login, reload } = useAuth();

  useEffect(() => {
    async function verifyToken() {
      try {
        const isVaild = await axios.get("/api/user/verifyToken", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        });

        if (isVaild) {
          const user = await axios.post("/api/user/searchUserById", {
            userId: isVaild.data.user_id,
          });
          login(user.data.user.Name);
          console.log("🚀 ~ verifyToken ~ isVaild:", isVaild);
        }
      } catch (error) {
        console.log("🚀 ~ verifyToken ~ error:", error);
      }
    }
    verifyToken();
    // console.log("🚀 ~ Header ~ user:", user);
    // console.log(process.env.SERVER_URL);
  }, [reload]);
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
            <Link
              color="foreground"
              onClick={() => {
                router.push("/");
              }}
            >
              Search
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              onClick={() => {
                router.push("/favorite");
              }}
            >
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
                  onClick={() => {
                    router.push("/user/settings");
                  }}
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
                  logout();
                }}
                color="warning"
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
