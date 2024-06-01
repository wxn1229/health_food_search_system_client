export type SearchResultType = {
  Id: string;
  Name: string;
  AcessDate: string;
  ImgUrl: null | string;
  Applicant: {
    Name: string;
  };
  CF: {
    Id: string;
    Name: string;
  };
  HF_and_BF: HealthBenefit[];
  HF_and_Ingredient: Ingredient[];
};

type HealthBenefit = {
  BF: {
    Id: string;
    Name: string;
  };
};

type Ingredient = {
  IG: {
    Id: string;
    Name: string;
    EnglishName: string;
  };
};
