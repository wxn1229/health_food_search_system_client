"use client";
import { InitSearchSetting, SearchSettingType } from "@/types/SearchType";
import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Button,
  DateInput,
  Input,
} from "@nextui-org/react";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";

export default function Search() {
  const [searchSetting, setSearchSetting] =
    useState<SearchSettingType>(InitSearchSetting);

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ searchSetting:", searchSetting);
  }, [searchSetting]);
  const mainvariant = "faded";
  const applicants = [
    {
      id: "P1",
      name: "統一",
    },
    {
      id: "P2",
      name: "花一",
    },
    {
      id: "P3",
      name: "條一",
    },
  ];
  const animal = [
    {
      label: "Cat",
      value: "cat",
      description: "The second most popular pet in the world",
    },
    {
      label: "Dog",
      value: "dog",
      description: "The most popular pet in the world",
    },
    {
      label: "Elephant",
      value: "elephant",
      description: "The largest land animal",
    },
    { label: "Lion", value: "lion", description: "The king of the jungle" },
    { label: "Tiger", value: "tiger", description: "The largest cat species" },
    {
      label: "Giraffe",
      value: "giraffe",
      description: "The tallest land animal",
    },
  ];

  return (
    <Accordion variant="shadow" className="w-8/12 overflow-hidden">
      <AccordionItem key="1" aria-label="Accordion 1" title="Search setting ">
        <div className="flex flex-col mt-2 gap-2">
          <Input
            type="text"
            value={searchSetting.keypoint}
            onChange={(e) => {
              setSearchSetting({ ...searchSetting, keypoint: e.target.value });
            }}
            variant={mainvariant}
            label="keypoint"
          ></Input>
          <Input
            type="text"
            variant={mainvariant}
            value={searchSetting.id}
            onChange={(e) => {
              setSearchSetting({ ...searchSetting, id: e.target.value });
            }}
            label="ID"
          ></Input>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 ">
            <DateInput
              label={"Strat date"}
              variant={mainvariant}
              value={searchSetting.start_date}
              onChange={(e) => {
                setSearchSetting({ ...searchSetting, start_date: e });
              }}
            />
            <DateInput
              label={"End date"}
              variant={mainvariant}
              value={searchSetting.end_date}
              onChange={(e) => {
                setSearchSetting({ ...searchSetting, end_date: e });
              }}
            />
          </div>
          <div className="flex gap-4 overflow-hidden">
            <Autocomplete
              variant={mainvariant}
              defaultItems={applicants}
              label="Applicant"
              selectedKey={searchSetting.applicant}
              onSelectionChange={(e) => {
                setSearchSetting(() => {
                  if (e) {
                    return { ...searchSetting, applicant: e.toString() };
                  } else {
                    return { ...searchSetting, applicant: "" };
                  }
                });
              }}
            >
              {applicants.map((item) => {
                return (
                  <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                );
              })}
            </Autocomplete>
            <Autocomplete
              variant={mainvariant}
              defaultItems={animal}
              label="certification"
            >
              {animal.map((item) => {
                return (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                );
              })}
            </Autocomplete>
          </div>
          <div className="flex gap-4 overflow-hidden">
            <Autocomplete
              variant={mainvariant}
              defaultItems={animal}
              label="Ingredient"
              className=""
            >
              {animal.map((item) => {
                return (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                );
              })}
            </Autocomplete>
            <Autocomplete
              variant={mainvariant}
              defaultItems={animal}
              label="Benefit"
            >
              {animal.map((item) => {
                return (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                );
              })}
            </Autocomplete>
          </div>
          <div className="flex gap-4 overflow-hidden">
            <Autocomplete
              variant={mainvariant}
              defaultItems={animal}
              label="start rate point"
              className=""
            >
              {animal.map((item) => {
                return (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                );
              })}
            </Autocomplete>
            <Autocomplete
              variant={mainvariant}
              defaultItems={animal}
              label="end rate point"
            >
              {animal.map((item) => {
                return (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                );
              })}
            </Autocomplete>
          </div>
          <Button color="primary" variant="bordered" endContent={<Send />}>
            Search !
          </Button>
        </div>
      </AccordionItem>
    </Accordion>
  );
}
