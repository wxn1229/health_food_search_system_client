"use client";
import { useEffect, useState } from "react";
import { SearchSettingType } from "../../../types/SearchType";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Link,
} from "@nextui-org/react";
import { Heading1, Heart } from "lucide-react";
import { default as axios } from "../../../utils/axios";
import { SearchResultType } from "../../../types/SearchResultType";
import { useRouter } from "next/navigation";
interface SearchResultPropsType {
  doSearch: SearchSettingType;
}

export default function SearchResult({ doSearch }: SearchResultPropsType) {
  const [searchResult, setSearchResult] = useState<SearchResultType[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function getSearchResult() {
      try {
        const result = await axios.post(
          "/api/searching/multisearching",
          doSearch
        );
        console.log("🚀 ~ getSearchResult ~ result:", result);
        setSearchResult(result.data.results);
      } catch (e) {
        console.log("🚀 ~ getSearchResult ~ e:", e);
      }
    }
    getSearchResult();
  }, [doSearch]);

  useEffect(() => {
    console.log("🚀 ~ SearchResult ~ doSearch:", doSearch);
  }, [doSearch]);
  useEffect(() => {
    console.log("🚀 ~ SearchResult ~ searchResult:", searchResult);
  }, [searchResult]);
  const [like, setLike] = useState(false);

  return (
    <div className="w-[90%] mt-4 gap-2 flex justify-around   flex-wrap">
      {searchResult.length === 0 && <div>Not Found Result</div>}
      {searchResult.map((item, index) => (
        <Card
          shadow="lg"
          key={item.Id}
          isHoverable
          onPress={() => console.log("item pressed")}
          className="w-[400px] mt-4 "
        >
          <CardBody className="overflow-visible p-2">
            <Image
              shadow="sm"
              radius="lg"
              width="100"
              alt={item.Name}
              className="w-full h-[384px] object-cover "
              src={`/HF_img/${item.Id}.jpg`}
            />
            <div className="flex justify-between mt-3 px-1 gap-2">
              <div>Health Food Id: </div>
              <div>{item.Id}</div>
            </div>
            <div className="flex justify-between mt-3 px-1 gap-2">
              <div>Health Food Name: </div>
              <div>{item.Name}</div>
            </div>
            <div className="flex justify-between mt-3 px-1 gap-2">
              <div>Certification : </div>
              <div>{item.CF.Name}</div>
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
          </CardBody>
          <CardFooter className="text-small justify-between">
            <div>{item.Name}</div>
            <p className="text-default-500">{item.CF.Name}</p>
            <div className="flex justify-between items-center gap-2">
              <Button
                onClick={() => {
                  setLike(!like);
                }}
                isIconOnly
                variant="flat"
                color="danger"
              >
                <Heart fill={`${like ? "#f31260" : "none"}`}></Heart>
              </Button>
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
      ))}
    </div>
  );
}
