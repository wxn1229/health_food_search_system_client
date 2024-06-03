"use client";
import {
  BenefitType,
  IngredientType,
  InitSelecOptions,
  selecOptionsType,
} from "@/types/SearchSettingType";
import { InitSearchSetting, SearchSettingType } from "@/types/SearchType";
import { default as axios } from "@/utils/axios";
import {
  CalendarDateTime,
  parseDate,
  CalendarDate,
} from "@internationalized/date";
import {
  Divider,
  useDisclosure,
  Modal,
  ModalContent,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Tooltip,
  Input,
  Pagination,
  Selection,
  ChipProps,
  Chip,
  DateInput,
  Autocomplete,
  AutocompleteItem,
  SelectProps,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { AxiosError } from "axios";
import { access } from "fs";
import {
  CalculatorIcon,
  DeleteIcon,
  Edit,
  EditIcon,
  PlusIcon,
  RefreshCcw,
  SearchIcon,
  SquareX,
} from "lucide-react";
import React, {
  Dispatch,
  Key,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface HfsType {
  Id: string;
  Name: string;
  CfId: string;
  CfName: string;
  AcName: string;
}

export default function HfTab() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [hfs, setHfs] = useState<HfsType[]>([]);

  const [reload, setReload] = useState(false);
  function reloading() {
    setReload(!reload);
  }

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");

  const [deleteId, setDeleteId] = useState("");

  const [addMode, setAddMode] = useState(false);
  function closeEdit() {
    setEditMode(false);
  }
  function closeAdd() {
    setAddMode(false);
  }

  useEffect(() => {
    async function getCer() {
      try {
        const CersData = await axios.get("/api/searchsetting/healthFoodTable");
        setHfs(CersData.data.data);
        console.log("🚀 ~ getCer ~ Cers:", CersData);
      } catch (error) {
        console.log("🚀 ~ getCer ~ error:", error);
      }
    }

    getCer();
  }, [reload]);
  const columns = [
    { name: "ID", uid: "Id" },
    { name: "NAME", uid: "Name" },
    { name: "APPLICANT", uid: "AcName" },

    { name: "CERTIFICATION", uid: "CfName" },
    { name: "ACTIONS", uid: "actions" },
  ];
  const statusColorMap: Record<string, ChipProps["color"]> = {
    C1: "success",
    C4: "success",
    C2: "danger",
    C3: "danger",
    C5: "danger",
  };

  const renderCell = useCallback((Hf: HfsType, columnKey: Key, Id: string) => {
    const cellValue = Hf[columnKey as keyof HfsType];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit">
              <div
                onClick={() => {
                  setEditId(Id);
                  setEditMode(true);
                }}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <EditIcon />
              </div>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <div
                onClick={() => {
                  setDeleteId(Id);
                  onOpen();
                }}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
                <DeleteIcon />
              </div>
            </Tooltip>
          </div>
        );
      case "CfName":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[Hf.CfId]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      default:
        return cellValue;
    }
  }, []);

  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const hasSearchFilter = Boolean(filterValue);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );

  async function deleteHandler(hfId: string) {
    try {
      const deleteHf = await axios.post(
        "/api/searchsetting/deleteHf",
        { hfId: hfId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );
      console.log("🚀 ~ deleteHandler ~ deleteHf:", deleteHf);
    } catch (error) {
      console.log("🚀 ~ deleteCer ~ error:", error);
    }
  }

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);
  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);
  const filteredItems = React.useMemo(() => {
    let filteredHfs = [...hfs];

    if (hasSearchFilter) {
      filteredHfs = filteredHfs.filter((hf) => {
        const filterValueLower = filterValue.toLowerCase();
        return (
          hf.Name.toLowerCase().includes(filterValueLower) ||
          hf.AcName.toLowerCase().includes(filterValueLower) ||
          hf.CfName.toLowerCase().includes(filterValueLower) ||
          hf.Id.toLowerCase().includes(filterValueLower)
        );
      });
    }

    return filteredHfs;
  }, [hfs, filterValue, reload]);
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search ..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button
              color="success"
              endContent={<RefreshCcw />}
              onClick={() => {
                setHfs([]);
                reloading();
              }}
            >
              Refresh
            </Button>
            <Button
              color="primary"
              endContent={<PlusIcon />}
              onClick={() => {
                setAddMode(true);
              }}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {hfs.length} Information
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="3">3</option>
              <option value="5">5</option>

              <option value="10">10</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    onRowsPerPageChange,
    hasSearchFilter,
    hfs.length,
  ]);
  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);
  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage, reload]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <div className="w-[30%] text-small text-default-400">{""}</div>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <>
      <div className="pl-8 max-h-[70vh] overflow-y-auto">
        {!editMode && !addMode && (
          <>
            <div className="text-3xl font-bold">Health Food Table</div>
            <Divider className="my-4"></Divider>

            <Table
              bottomContent={bottomContent}
              bottomContentPlacement="outside"
              topContent={topContent}
              topContentPlacement="outside"
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.uid} align="center">
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={items}>
                {(item) => (
                  <TableRow key={item.Id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCell(item, columnKey, item.Id)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      double check
                    </ModalHeader>
                    <ModalBody>
                      <p>Are you sure you want to delete the benefit?</p>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" onPress={onClose}>
                        Close
                      </Button>
                      <Button
                        color="primary"
                        onPress={onClose}
                        onClick={() => {
                          deleteHandler(deleteId);
                          reloading();
                        }}
                      >
                        Action
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        )}

        {editMode && (
          <EditHf
            Id={editId}
            closeEdit={closeEdit}
            reloading={reloading}
          ></EditHf>
        )}

        {addMode && <AddHf closeAdd={closeAdd} reloading={reloading}></AddHf>}
      </div>
    </>
  );
}
interface HFAndBF {
  HFId: string;
  BFId: string;
}

interface HFAndIngredient {
  HFId: string;
  IGId: string;
}

interface Applicant {
  Id: string;
  Name: string;
}

interface CF {
  Id: string;
  Name: string;
}

interface HealthFoodData {
  Id: string;
  Name: string;
  AcessDate: string; // 可以改成 Date 类型，如果你计划将其解析为 Date 对象
  CFId: string;
  CurCommentNum: number;
  CurPoint: number;
  Claims: string;
  Warning: string;
  Precautions: string;
  Website: string;
  ApplicantId: string;
  ImgUrl: string;
  HF_and_BF: HFAndBF[];
  HF_and_Ingredient: HFAndIngredient[];
  Applicant: Applicant;
  CF: CF;
}
function initializeHealthFoodData(): HealthFoodData {
  return {
    Id: "",
    Name: "",
    AcessDate: "1991-01-01T00:00:00.000Z",
    CFId: "",
    CurCommentNum: 0,
    CurPoint: 0.0,
    Claims: "",
    Warning: "",
    Precautions: "",
    Website: "",
    ApplicantId: "",
    ImgUrl: "",
    HF_and_BF: [],
    HF_and_Ingredient: [],
    Applicant: {
      Id: "",
      Name: "",
    },
    CF: {
      Id: "",
      Name: "",
    },
  };
}

interface EditCerProps {
  Id: string;
  closeEdit: () => void;
  reloading: () => void;
}

function EditHf({ Id, closeEdit, reloading }: EditCerProps) {
  const [hfData, setHfData] = useState<HealthFoodData>(
    initializeHealthFoodData()
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [tmpDate, setTempDate] = useState(parseDate("1991-01-01"));
  useEffect(() => {
    console.log("🚀 ~ EditHf ~ tmpDate:", tmpDate);
    setTempDate(parseDate(formatDate(hfData.AcessDate)));
  }, [hfData]);

  async function editHandler() {
    try {
      if (checkErrors(errors)) {
        const keysArray = Array.from(bfSelectedKeys);
        // 生成 HF_and_BF 陣列
        let HF_and_BF = keysArray.map((item) => ({
          bfId: item,
        }));

        const igkeysArray = Array.from(igSelectedKeys);
        // 生成 HF_and_IG 陣列
        let HF_and_IG = igkeysArray.map((item) => ({
          igId: item,
        }));

        console.log("🚀 ~ editHandler ~ HF_and_IG:", HF_and_IG);
        console.log("🚀 ~ editHandler ~ HF_and_BF:", HF_and_BF);

        const editHf = await axios.patch(
          "/api/searchsetting/editHf",
          {
            hfId: Id,
            name: hfData.Name,
            acId: hfData.ApplicantId,
            cfId: hfData.CFId,
            acessDate: formatDateToISO(tmpDate.toString()),
            claims: hfData.Claims,
            warning: hfData.Warning,
            precautions: hfData.Precautions,
            website: hfData.Website,
            imgUrl: hfData.ImgUrl,
            HF_and_BF: HF_and_BF,
            HF_and_IG: HF_and_IG,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user_token")}`,
            },
          }
        );
        console.log("🚀 ~ editHandler ~ editHf:", editHf);
        reloading();
        closeEdit();
      } else {
        alert("Please confirm whether the information is complete");
      }
    } catch (error) {
      console.log("🚀 ~ editHandler ~ error:", error);
    }
  }

  useEffect(() => {
    async function getEditData() {
      try {
        const editData = await axios.post("/api/searchsetting/HfById", {
          Id: Id,
        });
        console.log("🚀 ~ getEditData ~ editData:", editData);
        setHfData(editData.data.data);
      } catch (error) {
        console.log("🚀 ~ getEditData ~ error:", error);
      }
    }
    getEditData();
  }, [Id]);
  const [editHaveName, setEditHaveName] = useState(false);

  const [errors, setErrors] = useState({
    Name: false,
    Claims: false,
    Warning: false,
    Precautions: false,
    Website: false,
    AcId: false,
    CfId: false,
  });

  useEffect(() => {
    setErrors({
      Name: hfData.Name.trim() === "",
      Claims: hfData.Claims.trim() === "",
      Warning: hfData.Warning.trim() === "",
      Precautions: hfData.Precautions.trim() === "",
      Website: hfData.Website.trim() === "",
      AcId: hfData.ApplicantId.trim() === "",
      CfId: hfData.CFId.trim() === "",
    });
  }, [hfData]);
  useEffect(() => {
    if (hfData.Name.trim() === "") {
      setEditHaveName(false);
    } else {
      setEditHaveName(true);
    }
  }, [hfData]);

  useEffect(() => {
    console.log("🚀 ~ EditHf ~ hfData:", hfData);
  }, [hfData]);

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

  const checkErrors = (errors: any) => {
    const falseKeys = Object.keys(errors).filter((key) => errors[key]);

    if (falseKeys.length === 0) {
      return true;
    } else {
      console.log("These fields are false:", falseKeys);
      return false;
    }
  };
  function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() 返回 0-11，需要加 1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const [igSelectedKeys, setIgSelectedKeys] = useState<Selection>(new Set([]));
  const [bfSelectedKeys, setBfSelectedKeys] = useState<Selection>(new Set([]));

  function formatDateToISO(dateString: string): string {
    const [year, month, day] = dateString.split("-");
    const date = new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day))
    );
    return date.toISOString();
  }
  return (
    <>
      <div className="text-3xl font-bold">Edit Health Food</div>
      <Divider className="my-4"></Divider>

      <div className="font-bold text-2xl my-4">ID</div>
      <Input
        isDisabled
        type="text"
        variant="bordered"
        value={hfData.Id}
        className="max-w-xs"
      />
      <div className="font-bold text-2xl my-4">Name</div>
      <Input
        isInvalid={errors.Name}
        errorMessage={"Can not be empty"}
        type="text"
        isRequired
        variant="bordered"
        value={hfData.Name}
        onChange={(e) => {
          setHfData({ ...hfData, Name: e.target.value.trim() });
        }}
        className="max-w-xs"
      />

      <div className="font-bold text-2xl my-4">Acess Date</div>
      <DateInput
        label={"Acess date"}
        variant="bordered"
        startContent={
          <CalculatorIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        value={tmpDate}
        onChange={(e) => {
          setTempDate(parseDate(e.toString()));
        }}
      />

      <div className="font-bold text-2xl my-4">Applicant</div>
      <Autocomplete
        isRequired
        isInvalid={errors.AcId}
        errorMessage={"Can not be empty"}
        variant="bordered"
        defaultItems={selectOptions.applicants}
        label="Applicant"
        selectedKey={hfData.ApplicantId}
        onSelectionChange={(e: any) => {
          setHfData(() => {
            if (e) {
              return { ...hfData, ApplicantId: e.toString() };
            } else {
              return { ...hfData, ApplicantId: "" };
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
      <div className="font-bold text-2xl my-4">Certification</div>
      <Autocomplete
        isRequired
        isInvalid={errors.CfId}
        errorMessage={"Can not be empty"}
        variant="bordered"
        defaultItems={selectOptions.certifications}
        label="Applicant"
        selectedKey={hfData.CFId}
        onSelectionChange={(e: any) => {
          setHfData(() => {
            if (e) {
              return { ...hfData, CFId: e.toString() };
            } else {
              return { ...hfData, CFId: "" };
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

      <div className="font-bold text-2xl my-4">Ingredient</div>
      <IgTable
        loadIngredients={selectOptions.ingredients}
        oldIg={hfData.HF_and_Ingredient}
        igSelectedKeys={igSelectedKeys}
        setIgSelectedKeys={setIgSelectedKeys}
      ></IgTable>
      <div className="font-bold text-2xl my-4">Ingredient</div>
      <BfTable
        loadBf={selectOptions.benefits}
        oldBf={hfData.HF_and_BF}
        bfSelectedKeys={bfSelectedKeys}
        setBfSelectedKeys={setBfSelectedKeys}
      ></BfTable>
      <div className="font-bold text-2xl my-4">Claims</div>
      <Input
        isInvalid={errors.Claims}
        errorMessage={"Can not be empty"}
        type="text"
        isRequired
        variant="bordered"
        value={hfData.Claims}
        onChange={(e) => {
          setHfData({ ...hfData, Claims: e.target.value });
        }}
      />
      <div className="font-bold text-2xl my-4">Warning</div>
      <Input
        isInvalid={errors.Warning}
        errorMessage={"Can not be empty"}
        type="text"
        isRequired
        variant="bordered"
        value={hfData.Warning}
        onChange={(e) => {
          setHfData({ ...hfData, Warning: e.target.value });
        }}
      />
      <div className="font-bold text-2xl my-4">Precautions</div>
      <Input
        isInvalid={errors.Precautions}
        errorMessage={"Can not be empty"}
        type="text"
        isRequired
        variant="bordered"
        value={hfData.Precautions}
        onChange={(e) => {
          setHfData({ ...hfData, Precautions: e.target.value });
        }}
      />
      <div className="font-bold text-2xl my-4">Website</div>
      <Input
        isInvalid={errors.Website}
        errorMessage={"Can not be empty"}
        type="text"
        isRequired
        variant="bordered"
        value={hfData.Website}
        onChange={(e) => {
          setHfData({ ...hfData, Website: e.target.value.trim() });
        }}
      />
      <div className="font-bold text-2xl my-4">ImgUrl</div>
      <Input
        type="text"
        variant="bordered"
        value={hfData.ImgUrl}
        onChange={(e) => {
          setHfData({ ...hfData, ImgUrl: e.target.value.trim() });
        }}
      />

      <div className="flex">
        <Button
          color="primary"
          variant="bordered"
          onPress={onOpen}
          startContent={<Edit />}
          className="mt-8"
        >
          Submit
        </Button>
        <Button
          color="danger"
          variant="bordered"
          startContent={<SquareX />}
          onClick={() => {
            closeEdit();
          }}
          className="mt-8 ml-6"
        >
          Cancel
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  double check
                </ModalHeader>
                <ModalBody>
                  <p>Are you sure you want to edit health food?</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={onClose}
                    onClick={() => {
                      editHandler();
                    }}
                  >
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

interface AddHfProps {
  closeAdd: () => void;
  reloading: () => void;
}

function AddHf({ closeAdd, reloading }: AddHfProps) {
  const [hfData, setHfData] = useState<HealthFoodData>(
    initializeHealthFoodData()
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function addHandler() {
    try {
      if (checkErrors(errors)) {
        const keysArray = Array.from(bfSelectedKeys);
        // 生成 HF_and_BF 陣列
        let HF_and_BF = keysArray.map((item) => ({
          bfId: item,
        }));

        const igkeysArray = Array.from(igSelectedKeys);
        // 生成 HF_and_IG 陣列
        let HF_and_IG = igkeysArray.map((item) => ({
          igId: item,
        }));

        console.log("🚀 ~ editHandler ~ HF_and_IG:", HF_and_IG);
        console.log("🚀 ~ editHandler ~ HF_and_BF:", HF_and_BF);

        const editHf = await axios.post(
          "/api/searchsetting/createHf",
          {
            hfId: hfData.Id,
            name: hfData.Name,
            acId: hfData.ApplicantId,
            cfId: hfData.CFId,
            acessDate: formatDateToISO(tmpDate.toString()),
            claims: hfData.Claims,
            warning: hfData.Warning,
            precautions: hfData.Precautions,
            website: hfData.Website,
            imgUrl: hfData.ImgUrl,
            HF_and_BF: HF_and_BF,
            HF_and_IG: HF_and_IG,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user_token")}`,
            },
          }
        );
        console.log("🚀 ~ editHandler ~ editHf:", editHf);
        reloading();
        closeAdd();
      } else {
        alert("Please confirm whether the information is complete");
      }
    } catch (error: any) {
      if (error.response.status === 409) {
        alert("health food ID is exist, please change a ID");
      }
      console.log("🚀 ~ editHandler ~ error:", error);
    }
  }

  const [editHaveName, setEditHaveName] = useState(false);

  const [errors, setErrors] = useState({
    Id: false,
    Name: false,
    Claims: false,
    Warning: false,
    Precautions: false,
    Website: false,
    AcId: false,
    CfId: false,
  });

  useEffect(() => {
    setErrors({
      Id: hfData.Id.trim() === "",
      Name: hfData.Name.trim() === "",
      Claims: hfData.Claims.trim() === "",
      Warning: hfData.Warning.trim() === "",
      Precautions: hfData.Precautions.trim() === "",
      Website: hfData.Website.trim() === "",
      AcId: hfData.ApplicantId.trim() === "",
      CfId: hfData.CFId.trim() === "",
    });
  }, [hfData]);
  useEffect(() => {
    if (hfData.Name.trim() === "") {
      setEditHaveName(false);
    } else {
      setEditHaveName(true);
    }
  }, [hfData]);

  useEffect(() => {
    console.log("🚀 ~ EditHf ~ hfData:", hfData);
  }, [hfData]);

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

  const checkErrors = (errors: any) => {
    const falseKeys = Object.keys(errors).filter((key) => errors[key]);

    if (falseKeys.length === 0) {
      return true;
    } else {
      console.log("These fields are false:", falseKeys);
      return false;
    }
  };
  function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() 返回 0-11，需要加 1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const [igSelectedKeys, setIgSelectedKeys] = useState<Selection>(new Set([]));
  const [bfSelectedKeys, setBfSelectedKeys] = useState<Selection>(new Set([]));

  function formatDateToISO(dateString: string): string {
    const [year, month, day] = dateString.split("-");
    const date = new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day))
    );
    return date.toISOString();
  }
  const [tmpDate, setTempDate] = useState(parseDate("1991-01-01"));
  useEffect(() => {
    console.log("🚀 ~ EditHf ~ tmpDate:", tmpDate);
    setTempDate(parseDate(formatDate(hfData.AcessDate)));
  }, [hfData]);
  return (
    <>
      <div className="text-3xl font-bold">Edit Health Food</div>
      <Divider className="my-4"></Divider>

      <div className="font-bold text-2xl my-4">ID</div>
      <Input
        isRequired
        isInvalid={errors.Id}
        errorMessage={"Can not be empty"}
        type="text"
        variant="bordered"
        value={hfData.Id}
        onChange={(e) => {
          setHfData({ ...hfData, Id: e.target.value.trim() });
        }}
        className="max-w-xs"
      />
      <div className="font-bold text-2xl my-4">Name</div>
      <Input
        isInvalid={errors.Name}
        errorMessage={"Can not be empty"}
        type="text"
        isRequired
        variant="bordered"
        value={hfData.Name}
        onChange={(e) => {
          setHfData({ ...hfData, Name: e.target.value.trim() });
        }}
        className="max-w-xs"
      />

      <div className="font-bold text-2xl my-4">Acess Date</div>
      <DateInput
        label={"Acess date"}
        variant="bordered"
        startContent={
          <CalculatorIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        value={tmpDate}
        onChange={(e) => {
          setTempDate(parseDate(e.toString()));
        }}
      />

      <div className="font-bold text-2xl my-4">Applicant</div>
      <Autocomplete
        isRequired
        isInvalid={errors.AcId}
        errorMessage={"Can not be empty"}
        variant="bordered"
        defaultItems={selectOptions.applicants}
        label="Applicant"
        selectedKey={hfData.ApplicantId}
        onSelectionChange={(e: any) => {
          setHfData(() => {
            if (e) {
              return { ...hfData, ApplicantId: e.toString() };
            } else {
              return { ...hfData, ApplicantId: "" };
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
      <div className="font-bold text-2xl my-4">Certification</div>
      <Autocomplete
        isRequired
        isInvalid={errors.CfId}
        errorMessage={"Can not be empty"}
        variant="bordered"
        defaultItems={selectOptions.certifications}
        label="Certification"
        selectedKey={hfData.CFId}
        onSelectionChange={(e: any) => {
          setHfData(() => {
            if (e) {
              return { ...hfData, CFId: e.toString() };
            } else {
              return { ...hfData, CFId: "" };
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

      <div className="font-bold text-2xl my-4">Ingredient</div>
      <IgTable
        loadIngredients={selectOptions.ingredients}
        oldIg={hfData.HF_and_Ingredient}
        igSelectedKeys={igSelectedKeys}
        setIgSelectedKeys={setIgSelectedKeys}
      ></IgTable>
      <div className="font-bold text-2xl my-4">Ingredient</div>
      <BfTable
        loadBf={selectOptions.benefits}
        oldBf={hfData.HF_and_BF}
        bfSelectedKeys={bfSelectedKeys}
        setBfSelectedKeys={setBfSelectedKeys}
      ></BfTable>
      <div className="font-bold text-2xl my-4">Claims</div>
      <Input
        isInvalid={errors.Claims}
        errorMessage={"Can not be empty"}
        type="text"
        isRequired
        variant="bordered"
        value={hfData.Claims}
        onChange={(e) => {
          setHfData({ ...hfData, Claims: e.target.value });
        }}
      />
      <div className="font-bold text-2xl my-4">Warning</div>
      <Input
        isInvalid={errors.Warning}
        errorMessage={"Can not be empty"}
        type="text"
        isRequired
        variant="bordered"
        value={hfData.Warning}
        onChange={(e) => {
          setHfData({ ...hfData, Warning: e.target.value });
        }}
      />
      <div className="font-bold text-2xl my-4">Precautions</div>
      <Input
        isInvalid={errors.Precautions}
        errorMessage={"Can not be empty"}
        type="text"
        isRequired
        variant="bordered"
        value={hfData.Precautions}
        onChange={(e) => {
          setHfData({ ...hfData, Precautions: e.target.value });
        }}
      />
      <div className="font-bold text-2xl my-4">Website</div>
      <Input
        isInvalid={errors.Website}
        errorMessage={"Can not be empty"}
        type="text"
        isRequired
        variant="bordered"
        value={hfData.Website}
        onChange={(e) => {
          setHfData({ ...hfData, Website: e.target.value.trim() });
        }}
      />
      <div className="font-bold text-2xl my-4">ImgUrl</div>
      <Input
        type="text"
        variant="bordered"
        value={hfData.ImgUrl}
        onChange={(e) => {
          setHfData({ ...hfData, ImgUrl: e.target.value.trim() });
        }}
      />

      <div className="flex">
        <Button
          color="primary"
          variant="bordered"
          onPress={onOpen}
          startContent={<Edit />}
          className="mt-8"
        >
          Submit
        </Button>
        <Button
          color="danger"
          variant="bordered"
          startContent={<SquareX />}
          onClick={() => {
            closeAdd();
          }}
          className="mt-8 ml-6"
        >
          Cancel
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  double check
                </ModalHeader>
                <ModalBody>
                  <p>Are you sure you want to edit health food?</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={onClose}
                    onClick={() => {
                      addHandler();
                    }}
                  >
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
interface IgTableType {
  loadIngredients: IngredientType[];
  oldIg: HFAndIngredient[];
  igSelectedKeys: Selection;
  setIgSelectedKeys: Dispatch<SetStateAction<Selection>>;
}

function IgTable({
  loadIngredients,
  oldIg,
  igSelectedKeys,
  setIgSelectedKeys,
}: IgTableType) {
  const [igs, setIgs] = useState<IngredientType[]>([]);

  useEffect(() => {
    setIgs(loadIngredients);
  }, [loadIngredients]);

  useEffect(() => {
    if (oldIg.length > 0) {
      oldIg.map((ig) => {
        setIgSelectedKeys((prevKeys) => {
          const newKeys = new Set(prevKeys);
          newKeys.add(ig.IGId);
          return newKeys;
        });
      });
    }
  }, [oldIg]);

  const columns = [
    { name: "ID", uid: "Id" },
    { name: "NAME", uid: "Name" },
    { name: "SECONDNAME", uid: "EnglishName" },
  ];

  const renderCell = useCallback(
    (Hf: IngredientType, columnKey: Key, Id: string) => {
      const cellValue = Hf[columnKey as keyof IngredientType];

      switch (columnKey) {
        default:
          return cellValue;
      }
    },
    []
  );

  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const hasSearchFilter = Boolean(filterValue);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);
  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);
  const filteredItems = React.useMemo(() => {
    let filteredHfs = [...igs];

    if (hasSearchFilter) {
      filteredHfs = filteredHfs.filter((ig) => {
        const filterValueLower = filterValue.toLowerCase();
        return (
          ig.Name?.toLowerCase().includes(filterValueLower) ||
          ig.EnglishName?.toLowerCase().includes(filterValueLower) ||
          ig.Id.toLowerCase().includes(filterValueLower)
        );
      });
    }

    return filteredHfs;
  }, [igs, filterValue]);
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search ..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {igs.length} Information
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="3">3</option>
              <option value="5">5</option>

              <option value="10">10</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    onRowsPerPageChange,
    hasSearchFilter,
    igs.length,
  ]);
  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);
  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">{""}</span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);
  useEffect(() => {
    console.log("🚀 ~ IgTable ~ igSelectedKeys:", igSelectedKeys);
  }, [igSelectedKeys]);

  return (
    <>
      <Input
        isDisabled
        type="text"
        variant="bordered"
        label={"Selected: "}
        value={`${Array.from(igSelectedKeys).join(", ")}`}
        className="mb-6"
      />
      <p className="text-small text-default-500"></p>
      <Table
        color="primary"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        topContent={topContent}
        topContentPlacement="outside"
        selectionMode="multiple"
        selectedKeys={igSelectedKeys}
        onSelectionChange={setIgSelectedKeys}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align="center">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.Id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey, item.Id)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

interface BfTableType {
  loadBf: BenefitType[];
  oldBf: HFAndBF[];
  bfSelectedKeys: Selection;
  setBfSelectedKeys: Dispatch<SetStateAction<Selection>>;
}

function BfTable({
  loadBf,
  oldBf,
  bfSelectedKeys,
  setBfSelectedKeys,
}: BfTableType) {
  const [bfs, setBfs] = useState<BenefitType[]>([]);

  useEffect(() => {
    setBfs(loadBf);
  }, [loadBf]);

  useEffect(() => {
    if (oldBf.length > 0) {
      oldBf.map((bf) => {
        setBfSelectedKeys((prevKeys) => {
          const newKeys = new Set(prevKeys);
          newKeys.add(bf.BFId);
          return newKeys;
        });
      });
    }
  }, [oldBf]);

  const columns = [
    { name: "ID", uid: "Id" },
    { name: "NAME", uid: "Name" },
  ];

  const renderCell = useCallback(
    (Hf: BenefitType, columnKey: Key, Id: string) => {
      const cellValue = Hf[columnKey as keyof BenefitType];

      switch (columnKey) {
        default:
          return cellValue;
      }
    },
    []
  );

  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const hasSearchFilter = Boolean(filterValue);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);
  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);
  const filteredItems = React.useMemo(() => {
    let filteredHfs = [...bfs];

    if (hasSearchFilter) {
      filteredHfs = filteredHfs.filter((ig) => {
        const filterValueLower = filterValue.toLowerCase();
        return (
          ig.Name.toLowerCase().includes(filterValueLower) ||
          ig.Id.toLowerCase().includes(filterValueLower)
        );
      });
    }

    return filteredHfs;
  }, [bfs, filterValue]);
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search ..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {bfs.length} Information
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="3">3</option>
              <option value="5">5</option>

              <option value="10">10</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    onRowsPerPageChange,
    hasSearchFilter,
    bfs.length,
  ]);
  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);
  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">{}</span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);
  useEffect(() => {
    console.log("🚀 ~ IgTable ~ igSelectedKeys:", bfSelectedKeys);
  }, [bfSelectedKeys]);

  return (
    <>
      <Input
        isDisabled
        type="text"
        variant="bordered"
        label={"Selected: "}
        value={`${Array.from(bfSelectedKeys).join(", ")}`}
        className="mb-6"
      />
      <p className="text-small text-default-500"></p>
      <Table
        color="primary"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        topContent={topContent}
        topContentPlacement="outside"
        selectionMode="multiple"
        selectedKeys={bfSelectedKeys}
        onSelectionChange={setBfSelectedKeys}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align="center">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.Id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey, item.Id)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
