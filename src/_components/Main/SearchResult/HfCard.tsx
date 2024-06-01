"use client";
import { SearchResultType } from "@/types/SearchResultType";
import { useAuth } from "@/utils/AuthContext";
import { default as axios } from "@/utils/axios";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Link,
  Pagination,
} from "@nextui-org/react";
import { Heart, MessageSquareText, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HfCardProps {
  item: SearchResultType;
}

export default function HfCard({ item }: HfCardProps) {
  const router = useRouter();

  const [curCommentNum, setCurCommentNum] = useState(0);
  const [curCommentScore, setCurCommentScore] = useState(0.0);
  const [isFav, setIsFav] = useState(false);
  const [reload, setReload] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function getCurCommentData() {
      try {
        const curCommentData = await axios.post(
          "/api/searching/getCommentDataById",
          {
            hfId: item.Id,
          }
        );
        // console.log("🚀 ~ getCurCommentData ~ curCommentData:", curCommentData);

        setCurCommentNum(curCommentData.data.result.CurCommentNum);
        setCurCommentScore(curCommentData.data.result.CurPoint);
      } catch (error) {
        console.log("🚀 ~ getCurCommentData ~ error:", error);
      }
    }

    getCurCommentData();
  }, []);

  useEffect(() => {
    async function getIsFav() {
      try {
        const IsFavRes = await axios.post(
          "/api/user/isFavourite",
          {
            hfId: item.Id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user_token")}`,
            },
          }
        );
        console.log("🚀 ~ getIsFav ~ IsFavRes:", IsFavRes);
        setIsFav(IsFavRes.data.isFav);
      } catch (error) {
        console.log("🚀 ~ getIsFav ~ error:", error);
      }
    }

    getIsFav();
  }, [reload, item.Id]);

  const addFavHandler = async () => {
    try {
      const addFav = axios.post(
        "/api/user/addFavourite",
        {
          hfId: item.Id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );
      setReload(!reload);
    } catch (error) {
      console.log("🚀 ~ addFavHandler ~ error:", error);
    }
  };
  const deleteFavHandler = async () => {
    try {
      const deleteFav = axios.post(
        "/api/user/deleteFavourite",
        {
          hfId: item.Id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );

      setReload(!reload);
    } catch (error) {
      console.log("🚀 ~ addFavHandler ~ error:", error);
    }
  };

  return (
    <div>
      <Card
        shadow="lg"
        key={item.Id}
        isHoverable
        onPress={() => console.log("item pressed")}
        className="w-[450px] h-[750px] mt-4 "
      >
        <CardBody className="overflow-visible p-2">
          <Image
            shadow="sm"
            radius="lg"
            width="100"
            alt={item.Name}
            className="w-full h-[384px] object-cover "
            src={`${
              item.ImgUrl === null ? `/HF_img/${item.Id}.jpg` : `${item.ImgUrl}`
            }`}
          />
          <div className="w-full flex flex-col justify-between flex-1">
            <div className="flex justify-between mt-3 px-1 gap-2">
              <div>Health Food Id: </div>
              <div>{item.Id}</div>
            </div>
            <div className="flex justify-between mt-3 px-1 gap-2">
              <div>Health Food Name: </div>
              <div>{item.Name}</div>
            </div>

            <div className="flex justify-between mt-3 px-1 gap-2">
              <div>Acess Date: </div>
              <div>{item.AcessDate.split("T")[0]}</div>
            </div>
            <div className="flex justify-between mt-3 px-1 gap-2">
              <div>Ingredients : </div>
              <div className="flex flex-col items-end">
                {item.HF_and_Ingredient.map((item, index) => {
                  return (
                    <div key={item.IG.Id}>
                      {item.IG.EnglishName
                        ? `${item.IG.Name}(${item.IG.EnglishName})`
                        : `${item.IG.Name}`}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between mt-3 px-1 gap-2">
              <div>Benefits : </div>
              <div className="flex flex-col items-end">
                {item.HF_and_BF.map((item, index) => {
                  return <div key={item.BF.Id}>{item.BF.Name}</div>;
                })}
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className="text-small justify-between">
          <div className="flex">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-gray-900 dark:fill-gray-50" />
              <div className="font-bold ml-6 ">{curCommentScore}</div>
            </div>
            <div className="flex items-center ml-10">
              <MessageSquareText className="w-4 h-4 fill-gray-900 dark:fill-gray-50" />
              <div className="font-bold ml-6"> {curCommentNum}</div>
            </div>
          </div>
          <p
            className={`${
              item.CF.Id === "C1" || item.CF.Id === "C4"
                ? "text-green-500"
                : "text-red-500"
            } font-bold`}
          >
            {item.CF.Name}
          </p>
          <div className="flex justify-between items-center gap-2">
            {user.isAuth ? (
              isFav ? (
                <>
                  <Button
                    onClick={deleteFavHandler}
                    isIconOnly
                    variant="flat"
                    color="danger"
                  >
                    <Heart fill={"#f31260"}></Heart>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={addFavHandler}
                    isIconOnly
                    variant="flat"
                    color="danger"
                  >
                    <Heart fill={"none"}></Heart>
                  </Button>
                </>
              )
            ) : (
              <>
                <Button
                  onClick={() => {
                    alert(
                      "If you want to join my favorites, please log in as a member first"
                    );
                  }}
                  isIconOnly
                  variant="flat"
                  color="danger"
                >
                  <Heart fill={`none`}></Heart>
                </Button>
              </>
            )}

            <Button
              variant="flat"
              color="primary"
              onClick={() => {
                router.push(`/healthfood/${item.Id}`);
              }}
            >
              more...
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
