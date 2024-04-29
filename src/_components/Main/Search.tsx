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
import { default as axios } from "../../utils/axios";
import {
  InitSelecOptions,
  selecOptionsType,
} from "../../types/SearchSettingType";

interface SearchPropsType {
  sendSearchSetting: (searchSetting: SearchSettingType) => void;
}

export default function Search({ sendSearchSetting }: SearchPropsType) {
  const [searchSetting, setSearchSetting] =
    useState<SearchSettingType>(InitSearchSetting);

  const [selectOptions, setSelectOptions] =
    useState<selecOptionsType>(InitSelecOptions);

  useEffect(() => {
    async function getData() {
      try {
        const applicants = await axios.get("/api/searchsetting/applicant");
        const certifications = await axios.get(
          "/api/searchsetting/certification"
        );
        const ingredients = await axios.get("/api/searchsetting/ingredient");
        const benefits = await axios.get("/api/searchsetting/benefit");

        setSelectOptions({
          applicants: applicants.data.data,
          certifications: certifications.data.data,
          ingredients: ingredients.data.data,
          benefits: benefits.data.data,
        });
      } catch (error) {
        console.log("🚀 ~ getData ~ error:", error);
      }
    }
    getData();
  }, []);

  // onlistening selectOptions
  // useEffect(() => {
  //   console.log("🚀 ~ selectOptions updated:", selectOptions);
  // }, [selectOptions]);

  // onlistening searchSetting
  // useEffect(() => {
  //   console.log("🚀 ~ useEffect ~ searchSetting:", searchSetting);
  // }, [searchSetting]);
  const mainvariant = "faded";

  return (
    <Accordion variant="shadow" className="w-[90%] overflow-hidden">
      <AccordionItem key="1" aria-label="Accordion 1" title="Search setting ">
        <div className="flex flex-col mt-2 gap-2">
          <Input
            type="text"
            value={searchSetting.keypoint}
            onChange={(e) => {
              setSearchSetting({
                ...searchSetting,
                keypoint: e.target.value.trim(),
              });
            }}
            variant={mainvariant}
            label="keypoint"
          ></Input>
          <Input
            type="text"
            variant={mainvariant}
            value={searchSetting.id}
            onChange={(e) => {
              setSearchSetting({ ...searchSetting, id: e.target.value.trim() });
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
              defaultItems={selectOptions.applicants}
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
              {selectOptions.applicants.map((item) => {
                return (
                  <AutocompleteItem key={item.Id} textValue={item.Name}>
                    {item.Name}
                  </AutocompleteItem>
                );
              })}
            </Autocomplete>
            <Autocomplete
              variant={mainvariant}
              defaultItems={selectOptions.certifications}
              label="certification"
              onSelectionChange={(e) => {
                setSearchSetting(() => {
                  if (e) {
                    return { ...searchSetting, certification: e.toString() };
                  } else {
                    return { ...searchSetting, certification: "" };
                  }
                });
              }}
            >
              {selectOptions.certifications.map((item) => {
                return (
                  <AutocompleteItem key={item.Id} textValue={item.Name}>
                    {item.Name}
                  </AutocompleteItem>
                );
              })}
            </Autocomplete>
          </div>
          <div className="flex gap-4 overflow-hidden">
            <Autocomplete
              variant={mainvariant}
              defaultItems={selectOptions.ingredients}
              label="Ingredient"
              onSelectionChange={(e) => {
                setSearchSetting(() => {
                  if (e) {
                    return { ...searchSetting, ingredient: e.toString() };
                  } else {
                    return { ...searchSetting, ingredient: "" };
                  }
                });
              }}
              className=""
            >
              {selectOptions.ingredients.map((item) => {
                return (
                  <AutocompleteItem
                    key={item.Id}
                    textValue={item.Name + "(" + item.EnglishName + ")"}
                  >
                    {item.Name} {item.EnglishName ? "(" : ""}
                    {item.EnglishName ? item.EnglishName : ""}
                    {item.EnglishName ? ")" : ""}
                  </AutocompleteItem>
                );
              })}
            </Autocomplete>
            <Autocomplete
              variant={mainvariant}
              defaultItems={selectOptions.benefits}
              label="Benefit"
              onSelectionChange={(e) => {
                setSearchSetting(() => {
                  if (e) {
                    return { ...searchSetting, benefit: e.toString() };
                  } else {
                    return { ...searchSetting, benefit: "" };
                  }
                });
              }}
            >
              {selectOptions.benefits.map((item) => {
                return (
                  <AutocompleteItem key={item.Id} textValue={item.Name}>
                    {item.Name}
                  </AutocompleteItem>
                );
              })}
            </Autocomplete>
          </div>

          <Button
            onClick={() => {
              sendSearchSetting(searchSetting);
            }}
            color="primary"
            variant="bordered"
            endContent={<Send />}
          >
            Search !
          </Button>
        </div>
      </AccordionItem>
    </Accordion>
  );
}
