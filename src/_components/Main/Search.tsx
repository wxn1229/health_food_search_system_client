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
  Radio,
  RadioGroup,
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
  const [orderBy, setOrderBy] = useState("id");
  const [orderDirection, setOrderDirection] = useState("asc");

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
  useEffect(() => {
    setSearchSetting({ ...searchSetting, orderBy: orderBy });
  }, [orderBy]);
  useEffect(() => {
    setSearchSetting({ ...searchSetting, orderDir: orderDirection });
  }, [orderDirection]);

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
            label="關鍵字"
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
              label={"開始日期"}
              variant={mainvariant}
              value={searchSetting.start_date}
              onChange={(e) => {
                setSearchSetting({ ...searchSetting, start_date: e });
              }}
            />
            <DateInput
              label={"結束日期"}
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
              label="申請公司"
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
              label="核准狀態"
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
              label="成分"
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
              label="功效"
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

          <div className="flex gap-4 overflow-hidden">
            <RadioGroup
              className="flex-1"
              label="排序依據"
              orientation="horizontal"
              defaultValue="male"
              value={orderBy}
              onValueChange={setOrderBy}
            >
              <Radio value="id">id</Radio>
              <Radio value="score">評論分數</Radio>
              <Radio value="commentNumber">評論數量</Radio>
              <Radio value="date">通過日期</Radio>
            </RadioGroup>
            <RadioGroup
              label="升序或降序"
              className="flex-1"
              orientation="horizontal"
              defaultValue="male"
              value={orderDirection}
              onValueChange={setOrderDirection}
            >
              <Radio value="asc">ascending</Radio>
              <Radio value="desc">descending</Radio>
            </RadioGroup>
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
