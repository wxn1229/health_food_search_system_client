"use client";
import { Card, CardBody, Divider, Image, Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { default as axios } from "../../../utils/axios";
import { SearchByIdType } from "../../../types/SearchByIdType";
import { useAuth } from "@/utils/AuthContext";
import { Heart } from "lucide-react";

interface IdMainProps {
  id: string;
}

export default function IdMain({ id }: IdMainProps) {
  const [isFav, setIsFav] = useState(false);
  const { user } = useAuth();
  const [IdData, setIdData] = useState<SearchByIdType>();

  const [reload, setReload] = useState(false);
  useEffect(() => {
    async function getIdData() {
      try {
        const result = await axios.get(`/api/searching/searchById/${id}`);

        console.log("🚀 ~ getIdData ~ IdData:", result.data.result);
        setIdData(result.data.result);
      } catch (e) {
        console.log("🚀 ~ getIdData ~ e:", e);
      }
    }
    getIdData();
  }, [id]);
  useEffect(() => {
    async function getIsFav() {
      try {
        const IsFavRes = await axios.post(
          "/api/user/isFavourite",
          {
            hfId: id,
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
  }, [reload, id]);

  const addFavHandler = async () => {
    try {
      const addFav = axios.post(
        "/api/user/addFavourite",
        {
          hfId: id,
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
          hfId: id,
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
    <div className="w-full h-full flex justify-center items-center my-10">
      <Card className="w-[70%]">
        <CardBody className="w-full">
          <div className="flex w-full">
            <Image
              shadow="sm"
              radius="lg"
              width={500}
              alt="title"
              className="h-full"
              src={`${
                IdData?.ImgUrl === null
                  ? `/HF_img/${IdData?.Id}.jpg`
                  : `${IdData?.ImgUrl}`
              }`}
            />
            <div className="w-[50%] px-10 flex-1">
              <div className="text-3xl font-bold">{IdData?.Name}</div>
              <Divider className="my-4"></Divider>
              <div className="flex flex-col justify-around gap-6">
                <div className="flex justify-between">
                  <div className="w-28">ID: </div>
                  <div className="max-w-80 flex-1">{IdData?.Id}</div>
                </div>
                <div className="flex justify-between">
                  <div className="w-28">申請公司: </div>
                  <div className="max-w-80 flex-1">
                    {IdData?.Applicant.Name}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-28">核准狀態: </div>
                  <div className="max-w-80 flex-1">{IdData?.CF.Name}</div>
                </div>
                <div className="flex justify-between">
                  <div className="w-28">通過日期: </div>
                  <div className="max-w-80 flex-1">
                    {IdData?.AcessDate.split("T")[0]}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-28">成份 : </div>
                  <div className="flex-1 flex flex-col items-start max-w-80">
                    {IdData?.HF_and_Ingredient.map((item, index) => {
                      return (
                        <div key={index} className="max-w-80">
                          {item.IG.EnglishName
                            ? `${item.IG.Name}(${item.IG.EnglishName})`
                            : `${item.IG.Name}`}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-28">功效 : </div>
                  <div className="flex-1 flex flex-col items-start max-w-80">
                    {IdData?.HF_and_BF.map((item, index) => {
                      return (
                        <div className="max-w-80" key={index}>
                          {item.BF.Name}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-28">保健功效宣稱: </div>
                  <div className="max-w-80 flex-1">{IdData?.Claims}</div>
                </div>
                <div className="flex justify-between">
                  <div className="w-28">預防事項: </div>
                  <div className="max-w-80 flex-1">{IdData?.Precautions}</div>
                </div>
                <div className="flex justify-between">
                  <div className="w-28">警語: </div>
                  <div className="max-w-80 flex-1">{IdData?.Warning}</div>
                </div>
                <div className="flex justify-between">
                  <div className="w-28">網站: </div>
                  <div className="max-w-80 flex-1">{IdData?.Website}</div>
                </div>

                <Divider className="mt-4"></Divider>
                <div className="flex justify-between items-center gap-2">
                  {user.isAuth ? (
                    isFav ? (
                      <>
                        <Button
                          onClick={deleteFavHandler}
                          startContent={<Heart fill={"#f31260"}></Heart>}
                          variant="flat"
                          color="danger"
                        >
                          Favorite
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={addFavHandler}
                          startContent={<Heart fill={"none"}></Heart>}
                          variant="flat"
                          color="danger"
                        >
                          Favorite
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
                        startContent={<Heart fill={`none`}></Heart>}
                        variant="flat"
                        color="danger"
                      >
                        Favorite
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
