"use client";

import {
  Button,
  Divider,
  Input,
  Listbox,
  ListboxItem,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { KeyRound, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

interface UserMainProps {
  user_name: string;
}

export default function UserMain({ user_name }: UserMainProps) {
  const [selectedKeys, setSelectedKeys] = useState("text");
  useEffect(() => {
    console.log("🚀 ~ UserMain ~ selectedKeys:", selectedKeys);
  }, [selectedKeys]);

  return (
    <div className="w-full h-full flex-1 px-9 py-2">
      <div className="w-full h-full bg-zinc-100 rounded-md px-8 pt-10 flex flex-col dark:bg-black">
        <div>
          <div className="font-bold text-4xl">Setting</div>
          <div className="mt-2 text-zinc-500">
            Manage your account settings.
          </div>

          <Divider className="my-4 "></Divider>
        </div>
        <div className="flex-1 relative">
          <Tabs isVertical variant="light">
            <Tab key="profile" title="profile" className="flex-1">
              <div className="pl-8">
                <div className="text-3xl font-bold">Profile</div>
                <div className="mt-2 text-zinc-500">Show your profile</div>
                <Divider className="my-4"></Divider>
                <div className="font-bold text-2xl my-4">Email</div>
                <Input
                  isReadOnly
                  type="email"
                  variant="bordered"
                  defaultValue="junior@nextui.org"
                  className="max-w-xs"
                />
                <div className="font-bold text-2xl my-4">Name</div>
                <Input
                  isReadOnly
                  type="text"
                  variant="bordered"
                  defaultValue="junior"
                  className="max-w-xs"
                />
                <div className="font-bold text-2xl my-4">Age</div>
                <Input
                  isReadOnly
                  type="text"
                  variant="bordered"
                  defaultValue="20"
                  className="max-w-xs"
                />
                <div className="font-bold text-2xl my-4">Gender</div>
                <Input
                  isReadOnly
                  type="text"
                  variant="bordered"
                  defaultValue="male"
                  className="max-w-xs"
                />
              </div>
            </Tab>

            <Tab key="changeProfile" title="Edit Profile" className="flex-1">
              <div className="pl-8">
                <div className="text-3xl font-bold">Edit Profile</div>
                <div className="mt-2 text-zinc-500">
                  You can Edit your profile
                </div>
                <Divider className="my-4"></Divider>

                <div className="font-bold text-2xl my-4">Name</div>
                <Input
                  type="text"
                  variant="bordered"
                  defaultValue="junior"
                  className="max-w-xs"
                />
                <div className="font-bold text-2xl my-4">Age</div>
                <Input
                  type="text"
                  variant="bordered"
                  defaultValue="20"
                  className="max-w-xs"
                />
                <div className="font-bold text-2xl my-4">Gender</div>
                <Input
                  type="text"
                  variant="bordered"
                  defaultValue="male"
                  className="max-w-xs"
                />
                <Button
                  color="primary"
                  variant="bordered"
                  startContent={<Pencil />}
                  className="mt-8"
                >
                  edit profile
                </Button>
              </div>
            </Tab>
            <Tab
              key="changePassword"
              title="Change Password"
              className="flex-1"
            >
              <div className="pl-8">
                <div className="text-3xl font-bold">Change Password</div>
                <div className="mt-2 text-zinc-500">
                  You can change your password
                </div>
                <Divider className="my-4"></Divider>

                <div className="font-bold text-2xl my-4">Old Password</div>
                <Input
                  type="password"
                  variant="bordered"
                  className="max-w-xs"
                />
                <div className="font-bold text-2xl my-4">New Password</div>
                <Input
                  type="passwrod"
                  variant="bordered"
                  className="max-w-xs"
                />
                <div className="font-bold text-2xl my-4">Confirm Password</div>
                <Input
                  type="password"
                  variant="bordered"
                  className="max-w-xs"
                />
                <Button
                  color="warning"
                  variant="bordered"
                  startContent={<KeyRound />}
                  className="mt-8"
                >
                  change passwrod
                </Button>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
