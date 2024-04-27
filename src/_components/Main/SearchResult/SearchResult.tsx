"use client";
import { useEffect, useState } from "react";
import { SearchSettingType } from "../../../types/SearchType";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Heart } from "lucide-react";
interface SearchResultPropsType {
  doSearch: SearchSettingType;
}

export default function SearchResult({ doSearch }: SearchResultPropsType) {
  useEffect(() => {
    console.log("🚀 ~ SearchResult ~ doSearch:", doSearch);
  }, [doSearch]);
  const [like, setLike] = useState(false);
  const list = [
    {
      title: "Orange",
      img: "/images/fruit-1.jpeg",
      price: "$5.50",
    },
    {
      title: "Tangerine",
      img: "/images/fruit-2.jpeg",
      price: "$3.00",
    },
    {
      title: "Raspberry",
      img: "/images/fruit-3.jpeg",
      price: "$10.00",
    },
    {
      title: "Lemon",
      img: "/images/fruit-4.jpeg",
      price: "$5.30",
    },
    {
      title: "Avocado",
      img: "/images/fruit-5.jpeg",
      price: "$15.70",
    },
    {
      title: "Lemon 2",
      img: "/images/fruit-6.jpeg",
      price: "$8.00",
    },
    {
      title: "Banana",
      img: "/images/fruit-7.jpeg",
      price: "$7.50",
    },
    {
      title: "Watermelon",
      img: "/images/fruit-8.jpeg",
      price: "$12.20",
    },
  ];

  return (
    <div className="w-[90%] mt-2 gap-2 flex justify-evenly justify-items-center flex-wrap">
      {list.map((item, index) => (
        <Card
          shadow="md"
          key={index}
          isHoverable
          onPress={() => console.log("item pressed")}
          className="w-[300px]"
        >
          <CardBody className="overflow-visible p-2">
            <Image
              shadow="sm"
              radius="lg"
              width="100"
              alt={item.title}
              className="w-full object-cover "
              src={`https://picsum.photos/seed/${item.title}/300/300`}
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <div>{item.title}</div>
            <p className="text-default-500">{item.price}</p>
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
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
