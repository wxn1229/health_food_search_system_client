export interface SearchByIdType {
  Id: string;
  Name: string;
  AcessDate: string;
  CFId: string;
  CurCommentNum: number;
  CurPoint: number;
  Claims: string;
  Warning: string;
  Precautions: string;
  Website: string;
  ApplicantId: string;
  HF_and_BF: Array<{ BF: { Name: string } }>;
  HF_and_Ingredient: Array<{ IG: { Name: string; EnglishName: string } }>;
  Applicant: {
    Name: string;
  };
  CF: {
    Name: string;
  };
}
