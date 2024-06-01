"use client";
import { default as axios } from "@/utils/axios";
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
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import {
  DeleteIcon,
  Edit,
  EditIcon,
  PlusIcon,
  RefreshCcw,
  SearchIcon,
  SquareX,
} from "lucide-react";
import React, { Key, useCallback, useEffect, useMemo, useState } from "react";

interface IgsType {
  Id: string;
  Name: string;
  EnglishName: string;
}

export default function IgTab() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [igs, setIgs] = useState<IgsType[]>([]);

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

  const columns = [
    { name: "ID", uid: "Id" },
    { name: "NAME", uid: "Name" },
    { name: "SECONDNAME", uid: "EnglishName" },
    { name: "ACTIONS", uid: "actions" },
  ];
  useEffect(() => {
    async function getCer() {
      try {
        const CersData = await axios.get("/api/searchsetting/ingredient");
        setIgs(CersData.data.data);
        console.log("🚀 ~ getCer ~ Cers:", CersData);
      } catch (error) {
        console.log("🚀 ~ getCer ~ error:", error);
      }
    }

    getCer();
  }, [reload]);

  const renderCell = useCallback((Ig: IgsType, columnKey: Key, Id: string) => {
    const cellValue = Ig[columnKey as keyof IgsType];

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

  async function deleteHandler(igId: string) {
    try {
      const deleteIg = await axios.post(
        "/api/searchsetting/deleteIg",
        { igId: igId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );
      console.log("🚀 ~ deleteHandler ~ deleteIg:", deleteIg);
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
    let filteredIgs = [...igs];

    if (hasSearchFilter) {
      filteredIgs = filteredIgs.filter((ig) => {
        const filterValueLower = filterValue.toLowerCase();
        return (
          ig.Name.toLowerCase().includes(filterValueLower) ||
          ig.EnglishName?.toLowerCase().includes(filterValueLower) ||
          ig.Id.toLowerCase().includes(filterValueLower)
        );
      });
    }

    return filteredIgs;
  }, [igs, filterValue, reload]);
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
                setIgs([]);
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
  }, [page, filteredItems, rowsPerPage, reload]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${igs.length} selected`}
        </span>
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
      <div className="pl-8">
        {!editMode && !addMode && (
          <>
            <div className="text-3xl font-bold">Ingredient Table</div>
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
                      <p>Are you sure you want to delete the ingredient?</p>
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
          <EditIg
            Id={editId}
            closeEdit={closeEdit}
            reloading={reloading}
          ></EditIg>
        )}

        {addMode && <AddIg closeAdd={closeAdd} reloading={reloading}></AddIg>}
      </div>
    </>
  );
}

interface EditCerProps {
  Id: string;
  closeEdit: () => void;
  reloading: () => void;
}

function EditIg({ Id, closeEdit, reloading }: EditCerProps) {
  const [igData, setIgData] = useState<IgsType>({
    Id: "",
    Name: "",
    EnglishName: "",
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function editHandler() {
    try {
      const editIg = await axios.patch(
        "/api/searchsetting/editIg",
        { igId: Id, name: igData.Name, englishName: igData.EnglishName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );
      console.log("🚀 ~ editHandler ~ editIg:", editIg);
    } catch (error) {
      console.log("🚀 ~ editHandler ~ error:", error);
    }
  }

  useEffect(() => {
    async function getEditData() {
      try {
        const editData = await axios.post("/api/searchsetting/IgById", {
          Id: Id,
        });
        console.log("🚀 ~ getEditData ~ editData:", editData);
        setIgData(editData.data.data);
      } catch (error) {
        console.log("🚀 ~ getEditData ~ error:", error);
      }
    }
    getEditData();
  }, [Id]);
  const [editHaveName, setEditHaveName] = useState(false);
  useEffect(() => {
    if (igData.Name.trim() === "") {
      setEditHaveName(false);
    } else {
      setEditHaveName(true);
    }
  }, [igData]);

  return (
    <>
      <div className="text-3xl font-bold">Edit Ingredient</div>
      <Divider className="my-4"></Divider>

      <div className="font-bold text-2xl my-4">ID</div>
      <Input
        isDisabled
        type="text"
        variant="bordered"
        value={igData.Id}
        className="max-w-xs"
      />
      <div className="font-bold text-2xl my-4">Name</div>
      <Input
        isInvalid={!editHaveName}
        errorMessage={"Can not be empty"}
        type="text"
        isRequired
        variant="bordered"
        value={igData.Name}
        onChange={(e) => {
          setIgData({ ...igData, Name: e.target.value.trim() });
        }}
        className="max-w-xs"
      />
      <div className="font-bold text-2xl my-4">SecondName</div>
      <Input
        type="text"
        variant="bordered"
        value={igData.EnglishName}
        onChange={(e) => {
          setIgData({ ...igData, EnglishName: e.target.value.trim() });
        }}
        className="max-w-xs"
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
                  <p>Are you sure you want to edit ingredient?</p>
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
                      reloading();
                      closeEdit();
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

interface AddIgProps {
  closeAdd: () => void;
  reloading: () => void;
}

function AddIg({ closeAdd, reloading }: AddIgProps) {
  const [igData, setIgData] = useState<IgsType>({
    Id: "",
    Name: "",
    EnglishName: "",
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function addHandler() {
    try {
      const createIg = await axios.post(
        "/api/searchsetting/createIg",
        { igId: igData.Id, name: igData.Name, englishName: igData.EnglishName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );
      console.log("🚀 ~ addHandler ~ createIg:", createIg);
    } catch (error) {
      console.log("🚀 ~ editHandler ~ error:", error);
    }
  }

  useEffect(() => {
    async function getEditData() {
      try {
        const lastId = await axios.get("/api/searchsetting/getLastIgId");
        const newId = `I${String(
          parseInt(String(lastId.data.result[0].Id).split("I")[1], 10) + 1
        )}`;
        setIgData({ ...igData, Id: newId });
      } catch (error) {
        console.log("🚀 ~ getEditData ~ error:", error);
      }
    }
    getEditData();
  }, []);

  return (
    <>
      <div className="text-3xl font-bold">Create Ingredient</div>
      <Divider className="my-4"></Divider>

      <div className="font-bold text-2xl my-4">ID</div>
      <Input
        isDisabled
        type="text"
        variant="bordered"
        value={igData.Id}
        className="max-w-xs"
      />
      <div className="font-bold text-2xl my-4">Name</div>
      <Input
        type="text"
        variant="bordered"
        value={igData.Name}
        onChange={(e) => {
          setIgData({ ...igData, Name: e.target.value.trim() });
        }}
        className="max-w-xs"
      />
      <div className="font-bold text-2xl my-4">SecondName</div>
      <Input
        type="text"
        variant="bordered"
        value={igData.EnglishName}
        onChange={(e) => {
          setIgData({ ...igData, EnglishName: e.target.value.trim() });
        }}
        className="max-w-xs"
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
                  <p>Are you sure you want to create ingredient?</p>
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
                      reloading();
                      closeAdd();
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
