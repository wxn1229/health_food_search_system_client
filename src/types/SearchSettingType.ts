export type ApplicantType = {
  Id: string;
  Name: string;
};

export type CertificationType = {
  Id: string;
  Name: string;
};

export type IngredientType = {
  Id: string;
  Name: string | undefined;
  EnglishName: string | null;
};

export type BenefitType = {
  Id: string;
  Name: string;
};

export type selecOptionsType = {
  applicants: ApplicantType[];
  certifications: CertificationType[];
  ingredients: IngredientType[];
  benefits: BenefitType[];
};

export const InitSelecOptions = {
  applicants: [],
  certifications: [],
  ingredients: [],
  benefits: [],
};
