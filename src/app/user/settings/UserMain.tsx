"use client";

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
} from "@nextui-org/react";
import { KeyRound, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";

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

export default function UserMain() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userData, setUserData] = useState<UserDataType>({
    email: "exsample@gmail.com",
    name: "exsample",
    age: 18,
    gender: true,
  });
  const [updateData, setUpdateData] = useState<UserDataType>({
    email: "exsample@gmail.com",
    name: "exsample",
    age: 18,
    gender: true,
  });
  const [changePasswordData, setChangePasswordData] =
    useState<changePasswordDataType>({
      email: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [userGender, setUserGender] = useState("male");
  const { user, reloading, logout } = useAuth();

  const router = useRouter();
  const [selected, setSelected] = useState<Key>("login");

  const [passwordValid, setPasswordValid] = useState(true);
  const [checkPasswordCorrect, setCheckPasswordCorrect] = useState(false);
  const [checkName, setCheckName] = useState(true);

  async function updateHandler() {
    try {
      const updateRequest = await axios.patch(
        "api/user/updateUserByEmail",

        {
          email: updateData.email,
          name: updateData.name,
          age: updateData.age,
          gender: updateData.gender,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );
      console.log("🚀 ~ updateHandler ~ updateRequest:", updateRequest);
      reloading();
      setSelected("profile");
      alert("success edit your profile");
    } catch (error: any) {
      if (error.response.status === 409) {
        alert("名字已經被使用請更換");
      }
      console.log("🚀 ~ updateHandler ~ error:", error);
    }
  }

  async function changePasswordHandler() {
    try {
      if (checkPasswordCorrect && passwordValid) {
        const changePasswordRequest = await axios.patch(
          "api/user/changePassword",

          {
            email: updateData.email,
            oldPassword: changePasswordData.oldPassword,
            newPassword: changePasswordData.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user_token")}`,
            },
          }
        );
        console.log(
          "🚀 ~ changePasswordHandler ~ changePasswordRequest:",
          changePasswordRequest
        );

        logout();
        alert("success change your password, please login again");
        router.push("/user/login");
      } else {
        alert(
          "Please make your New password conform to the format and confirm that the confirm password is correct"
        );
      }
    } catch (error: any) {
      if (error.response.status === 402) {
        alert("your old password is incorrect");
      } else {
        alert("server error");
      }
    }
  }

  useEffect(() => {
    if (updateData.name.length >= 1) {
      setCheckName(true);
    } else {
      setCheckName(false);
    }
  }, [updateData]);
  useEffect(() => {
    if (userGender === "male") {
      setUpdateData((s) => {
        return { ...s, gender: true };
      });
    } else {
      setUpdateData((s) => {
        return { ...s, gender: false };
      });
    }
  }, [userGender]);
  useEffect(() => {
    if (changePasswordData.newPassword === changePasswordData.confirmPassword) {
      setCheckPasswordCorrect(true);
    } else {
      setCheckPasswordCorrect(false);
    }
  }, [changePasswordData]);

  // password.length >= 8
  useEffect(() => {
    if (changePasswordData.newPassword.length >= 8) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  }, [changePasswordData]);
  useEffect(() => {
    async function getUserData() {
      try {
        const userdata = await axios.post("/api/user/searchUserByName", {
          username: user.user_name,
        });
        setUserData((data) => {
          return {
            ...data,
            email: userdata.data.user.Email,
            name: userdata.data.user.Name,
            age: userdata.data.user.Age,
            gender: userdata.data.user.Gender,
          };
        });
        setUpdateData((data) => {
          return {
            ...data,
            email: userdata.data.user.Email,
            name: userdata.data.user.Name,
            age: userdata.data.user.Age,
            gender: userdata.data.user.Gender,
          };
        });
        setChangePasswordData((data) => {
          return {
            ...data,
            email: userdata.data.user.Email,
          };
        });
        console.log("🚀 ~ getUserData ~ userdata:", userdata);
      } catch (error) {
        console.log("🚀 ~ getUserData ~ error:", error);
      }
    }

    if (user.isAuth) {
      getUserData();
    } else {
      console.log("please login ");
    }
  }, [user]);

  return (
    <>
      {!user.isAuth && (
        <div className="w-full h-full flex-1 flex justify-center items-center">
          <div className="text-6xl">Please Login</div>
        </div>
      )}

      {user.isAuth && (
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
              <Tabs
                isVertical
                variant="light"
                selectedKey={selected.toString()}
                onSelectionChange={setSelected}
              >
                <Tab key="profile" title="Show Profile" className="flex-1">
                  <div className="pl-8">
                    <div className="text-3xl font-bold">Profile</div>
                    <div className="mt-2 text-zinc-500">Show your profile</div>
                    <Divider className="my-4"></Divider>
                    <div className="font-bold text-2xl my-4">Email</div>
                    <Input
                      isDisabled
                      type="email"
                      variant="bordered"
                      defaultValue="junior@nextui.org"
                      value={userData.email}
                      className="max-w-xs"
                    />
                    <div className="font-bold text-2xl my-4">Name</div>
                    <Input
                      isDisabled
                      type="text"
                      variant="bordered"
                      defaultValue="junior"
                      value={userData.name}
                      className="max-w-xs"
                    />
                    <div className="font-bold text-2xl my-4">Age</div>
                    <Input
                      isDisabled
                      type="text"
                      variant="bordered"
                      defaultValue="20"
                      value={userData.age.toString()}
                      className="max-w-xs"
                    />
                    <div className="font-bold text-2xl my-4">Gender</div>
                    <Input
                      isDisabled
                      type="text"
                      variant="bordered"
                      defaultValue="male"
                      value={userData.gender ? "male" : "female"}
                      className="max-w-xs"
                    />
                  </div>
                </Tab>

                <Tab
                  key="changeProfile"
                  title="Edit Profile"
                  className="flex-1"
                >
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
                      isInvalid={!checkName}
                      errorMessage={"Name cannot be empty"}
                      value={updateData.name}
                      onChange={(e) => {
                        setUpdateData({ ...updateData, name: e.target.value });
                      }}
                      className="max-w-xs"
                    />
                    <div className="font-bold text-2xl my-4">Age</div>
                    <Slider
                      label="age"
                      step={1}
                      maxValue={150}
                      minValue={1}
                      defaultValue={18}
                      className="max-w-md"
                      value={updateData.age}
                      onChange={(e) => {
                        setUpdateData({ ...updateData, age: e });
                      }}
                    />
                    <div className="font-bold text-2xl my-4">Gender</div>
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
                    <Button
                      color="primary"
                      variant="bordered"
                      startContent={<Pencil />}
                      className="mt-8"
                      onPress={onOpen}
                    >
                      edit profile
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
                            <p>Are you sure you want to edit your profile?</p>
                          </ModalBody>
                          <ModalFooter>
                            <Button color="danger" onPress={onClose}>
                              Close
                            </Button>
                            <Button
                              color="primary"
                              onClick={updateHandler}
                              onPress={onClose}
                            >
                              Action
                            </Button>
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
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
                      value={changePasswordData.oldPassword}
                      onChange={(e) => {
                        setChangePasswordData({
                          ...changePasswordData,
                          oldPassword: e.target.value,
                        });
                      }}
                    />
                    <div className="font-bold text-2xl my-4">New Password</div>
                    <Input
                      type="password"
                      variant="bordered"
                      className="max-w-xs"
                      isInvalid={!passwordValid}
                      errorMessage={
                        "Password must be at least eight characters"
                      }
                      value={changePasswordData.newPassword}
                      onChange={(e) => {
                        setChangePasswordData({
                          ...changePasswordData,
                          newPassword: e.target.value,
                        });
                      }}
                    />
                    <div className="font-bold text-2xl my-4">
                      Confirm Password
                    </div>
                    <Input
                      type="password"
                      variant="bordered"
                      className="max-w-xs"
                      isInvalid={!checkPasswordCorrect}
                      errorMessage={"Not the same as new password"}
                      value={changePasswordData.confirmPassword}
                      onChange={(e) => {
                        setChangePasswordData({
                          ...changePasswordData,
                          confirmPassword: e.target.value,
                        });
                      }}
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
                            <Button
                              color="primary"
                              onClick={changePasswordHandler}
                              onPress={onClose}
                            >
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
