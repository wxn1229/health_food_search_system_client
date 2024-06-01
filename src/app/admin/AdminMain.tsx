"use client";

import AcTab from "@/app/admin/_components/AcTab";
import BfTab from "@/app/admin/_components/BfTab";
import CerTab from "@/app/admin/_components/CerTab";
import HfTab from "@/app/admin/_components/HfTab";
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

                <Tab key="benefit" title="Benefit" className="flex-1">
                  <BfTab></BfTab>
                </Tab>
                <Tab key="applicant" title="Applicant" className="flex-1">
                  <AcTab></AcTab>
                </Tab>
                <Tab key="healthFood" title="Health Food" className="flex-1">
                  <HfTab></HfTab>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
