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

interface CersType {
  Id: string;
  Name: string;
}

export default function CerTab() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [Cers, setCers] = useState<CersType[]>([]);

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
    { name: "ACTIONS", uid: "actions" },
  ];
  useEffect(() => {
    async function getCer() {
      try {
        const CersData = await axios.get("/api/searchsetting/certification");
        setCers(CersData.data.data);
        console.log("🚀 ~ getCer ~ Cers:", CersData);
      } catch (error) {
        console.log("🚀 ~ getCer ~ error:", error);
      }
    }

    getCer();
  }, [reload]);

  const renderCell = useCallback(
    (Cer: CersType, columnKey: Key, Id: string) => {
      const cellValue = Cer[columnKey as keyof CersType];

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

  async function deleteHandler(cerId: string) {
    try {
      console.log("🚀 ~ deleteHandler ~ cerId:", cerId);
      const deleteCer = await axios.post(
        "/api/searchsetting/deleteCer",
        { cerId: cerId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );
      console.log("🚀 ~ deleteHandler ~ deleteCer:", deleteCer);
    } catch (error: any) {
      if (error.response.status === 403) {
        alert("這筆資料被其他資料參考無法刪除");
      }
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
    let filteredCers = [...Cers];

    if (hasSearchFilter) {
      filteredCers = filteredCers.filter((cer) =>
        cer.Id.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredCers;
  }, [Cers, filterValue, reload]);
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by Id..."
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
                setCers([]);
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
            Total {Cers.length} Information
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
    Cers.length,
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
            : `${selectedKeys.size} of ${Cers.length} selected`}
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
            <div className="text-3xl font-bold">Certification Table</div>
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
                      <p>Are you sure you want to delete the certification?</p>
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
          <EditCer
            Id={editId}
            closeEdit={closeEdit}
            reloading={reloading}
          ></EditCer>
        )}

        {addMode && <AddCer closeAdd={closeAdd} reloading={reloading}></AddCer>}
      </div>
    </>
  );
}

interface EditCerProps {
  Id: string;
  closeEdit: () => void;
  reloading: () => void;
}

function EditCer({ Id, closeEdit, reloading }: EditCerProps) {
  const [CerData, setCerData] = useState<CersType>({
    Id: "",
    Name: "",
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function editHandler() {
    try {
      const editCer = await axios.patch(
        "/api/searchsetting/editCer",
        { cerId: Id, name: CerData.Name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );
      console.log("🚀 ~ editHandler ~ editCer:", editCer);
    } catch (error) {
      console.log("🚀 ~ editHandler ~ error:", error);
    }
  }

  useEffect(() => {
    async function getEditData() {
      try {
        const editData = await axios.post(
          "/api/searchsetting/certificationById",
          { Id: Id }
        );
        console.log("🚀 ~ getEditData ~ editData:", editData);
        setCerData(editData.data.data);
      } catch (error) {
        console.log("🚀 ~ getEditData ~ error:", error);
      }
    }
    getEditData();
  }, [Id]);

  return (
    <>
      <div className="text-3xl font-bold">Edit Certification</div>
      <Divider className="my-4"></Divider>

      <div className="font-bold text-2xl my-4">ID</div>
      <Input
        isDisabled
        type="text"
        variant="bordered"
        value={CerData.Id}
        className="max-w-xs"
      />
      <div className="font-bold text-2xl my-4">Name</div>
      <Input
        type="text"
        variant="bordered"
        value={CerData.Name}
        onChange={(e) => {
          setCerData({ ...CerData, Name: e.target.value.trim() });
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
                  <p>Are you sure you want to edit certification?</p>
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

interface AddCerProps {
  closeAdd: () => void;
  reloading: () => void;
}

function AddCer({ closeAdd, reloading }: AddCerProps) {
  const [CerData, setCerData] = useState<CersType>({
    Id: "",
    Name: "",
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function addHandler() {
    try {
      const createCer = await axios.post(
        "/api/searchsetting/createCer",
        { cerId: CerData.Id, name: CerData.Name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
          },
        }
      );
      console.log("🚀 ~ addHandler ~ createCer:", createCer);
    } catch (error) {
      console.log("🚀 ~ editHandler ~ error:", error);
    }
  }

  useEffect(() => {
    async function getEditData() {
      try {
        const lastId = await axios.get("/api/searchsetting/getLastCerId");
        const newId = `C${String(
          parseInt(String(lastId.data.result[0].Id).split("C")[1], 10) + 1
        )}`;
        setCerData({ ...CerData, Id: newId });
      } catch (error) {
        console.log("🚀 ~ getEditData ~ error:", error);
      }
    }
    getEditData();
  }, []);

  return (
    <>
      <div className="text-3xl font-bold">Create Certification</div>
      <Divider className="my-4"></Divider>

      <div className="font-bold text-2xl my-4">ID</div>
      <Input
        isDisabled
        type="text"
        variant="bordered"
        value={CerData.Id}
        className="max-w-xs"
      />
      <div className="font-bold text-2xl my-4">Name</div>
      <Input
        type="text"
        variant="bordered"
        value={CerData.Name}
        onChange={(e) => {
          setCerData({ ...CerData, Name: e.target.value.trim() });
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
                  <p>Are you sure you want to create certification?</p>
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
