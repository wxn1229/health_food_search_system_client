import { parseDate } from "@internationalized/date";
import { DateValue } from "@nextui-org/react";
import { Key } from "react";

export type SearchSettingType = {
  keypoint: string;
  id: string;
  start_date: DateValue;
  end_date: DateValue;
  applicant: string;
  certification: string;
  ingredient: string;
  benefit: string;
  orderBy: string;
  orderDir: string;
};

export const InitSearchSetting: SearchSettingType = {
  keypoint: "",
  id: "",
  start_date: parseDate("1990-01-01"),
  end_date: parseDate("2025-12-31"),
  applicant: "",
  certification: "",
  ingredient: "",
  benefit: "",
  orderBy: "id",
  orderDir: "asc",
};
