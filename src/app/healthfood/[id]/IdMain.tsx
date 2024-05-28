"use client";
import { Card, CardBody, Image } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { default as axios } from "../../../utils/axios";
import { SearchByIdType } from "../../../types/SearchByIdType";

interface IdMainProps {
  id: string;
}

export default function IdMain({ id }: IdMainProps) {
  const [IdData, setIdData] = useState<SearchByIdType>();
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
              src={`/HF_img/${id}.jpg`}
            />
            <div className="w-[50%] px-4">
              <h1>{IdData?.Name}</h1>
              <div className="flex flex-col justify-around">
                <div className="flex justify-between">
                  <div>Id: </div>
                  <div className="max-w-80">{IdData?.Id}</div>
                </div>
                <div className="flex justify-between">
                  <div>Applicant: </div>
                  <div className="max-w-80">{IdData?.Applicant.Name}</div>
                </div>
                <div className="flex justify-between">
                  <div>Certification: </div>
                  <div className="max-w-80">{IdData?.CF.Name}</div>
                </div>
                <div className="flex justify-between">
                  <div>Acess Date: </div>
                  <div className="max-w-80">
                    {IdData?.AcessDate.split("T")[0]}
                  </div>
                </div>
                <div className="flex justify-between  gap-2">
                  <div>Ingredients : </div>
                  <div className="flex flex-col items-end">
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
                <div className="flex justify-between  gap-2">
                  <div>Benefits : </div>
                  <div className="flex flex-col items-end">
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
                  <div>Claims: </div>
                  <div className="max-w-80">{IdData?.Claims}</div>
                </div>
                <div className="flex justify-between">
                  <div>Precautions: </div>
                  <div className="max-w-80">{IdData?.Precautions}</div>
                </div>
                <div className="flex justify-between">
                  <div>Warning: </div>
                  <div className="max-w-80">{IdData?.Warning}</div>
                </div>
                <div className="flex justify-between">
                  <div>Website: </div>
                  <div className="max-w-80">{IdData?.Website}</div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
