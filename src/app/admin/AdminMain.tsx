"use client";

import CerTab from "@/app/admin/_components/CerTab";
import IgTab from "@/app/admin/_components/IgTab";
import { useAuth } from "@/utils/AuthContext";
import { default as axios } from "@/utils/axios";
import {
  Button,
  Divider,
  Input,
  Modal,
  Radio,
  RadioGroup,
  Slider,
  Tab,
  Tabs,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import { DeleteIcon, EditIcon, EyeIcon, KeyRound, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Key, useCallback, useEffect, useState } from "react";

interface UserDataType {
  email: string;
  name: string;
  age: number | number[];
  gender: boolean;
}

interface changePasswordDataType {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AdminMain() {
  const [isAdmin, setIsAdmin] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useState<Key>("login");

  const { reload } = useAuth();

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
          console.log("🚀 ~ verifyToken ~ isVaild:", isVaild);
        }

        setIsAdmin(isVaild.data.isAdmin);
      } catch (error) {
        console.log("🚀 ~ verifyToken ~ error:", error);
      }
    }
    setIsAdmin(false);
    verifyToken();
    // console.log("🚀 ~ Header ~ user:", user);
    // console.log(process.env.SERVER_URL);
  }, [reload]);

  return (
    <>
      {!isAdmin && (
        <div className="w-full h-full flex-1 flex justify-center items-center">
          <div className="text-6xl">you is not admin</div>
        </div>
      )}

      {isAdmin && (
        <div className="w-full h-full flex-1 px-9 py-2">
          <div className="w-full h-full bg-zinc-100 rounded-md px-8 pt-10 flex flex-col dark:bg-black">
            <div>
              <div className="font-bold text-4xl">Admin Manege</div>
              <div className="mt-2 text-zinc-500">
                Manage this website data.
              </div>

              <Divider className="my-4 "></Divider>
            </div>
            <div className="flex-1 relative">
              <Tabs
                isVertical
                variant="light"
                selectedKey={selected.toString()}
                onSelectionChange={setSelected}
              >
                <Tab
                  key="certification"
                  title="Certification"
                  className="flex-1"
                >
                  <CerTab></CerTab>
                </Tab>

                <Tab key="ingredient" title="Ingredient" className="flex-1">
                  <IgTab></IgTab>
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
                      onChange={(e) => {}}
                    />
                    <div className="font-bold text-2xl my-4">New Password</div>
                    <Input
                      type="password"
                      variant="bordered"
                      className="max-w-xs"
                      errorMessage={
                        "Password must be at least eight characters"
                      }
                      onChange={(e) => {}}
                    />
                    <div className="font-bold text-2xl my-4">
                      Confirm Password
                    </div>
                    <Input
                      type="password"
                      variant="bordered"
                      className="max-w-xs"
                      errorMessage={"Not the same as new password"}
                      onChange={(e) => {}}
                    />
                    <Button
                      color="warning"
                      variant="bordered"
                      startContent={<KeyRound />}
                      onPress={onOpen}
                      className="mt-8"
                    >
                      change passwrod
                    </Button>
                  </div>
                  <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    backdrop="blur"
                  >
                    <ModalContent>
                      {(onClose) => (
                        <>
                          <ModalHeader className="flex flex-col gap-1">
                            double check
                          </ModalHeader>
                          <ModalBody>
                            <p>
                              Are you sure you want to change your password?
                            </p>
                          </ModalBody>
                          <ModalFooter>
                            <Button color="danger" onPress={onClose}>
                              Close
                            </Button>
                            <Button color="primary" onPress={onClose}>
                              Action
                            </Button>
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
