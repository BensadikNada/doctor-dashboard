import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
} from "@nextui-org/react";
// Import icons
import { PlusIcon } from "./plus";
import { VerticalDotsIcon } from "./vertical";
import { SearchIcon } from "./search";
import { ChevronDownIcon } from "./chvron";
import { capitalize } from "./utils";

const statusColorMap = {
    Active: "success",
    Block: "danger",
    pending: "warning", 
    Valid: "success", 
    Refused: "danger", 
};


export default function CustomTable({ columns, data ,onAdd ,handleDialogOpen ,handleDialogUsers, handleDelete ,typeInput , dateinput ,dateData}) {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(
        new Set(columns.map((col) => col.uid))
    );
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredData = [...data];

        if (hasSearchFilter) {
            const searchQuery = filterValue.toLowerCase(); // Convert the search term to lowercase once outside the loop for efficiency
            filteredData = filteredData.filter((item) => {
                const nomLower = (item.nom || item.patient?.nom || "").toLowerCase();
                const prenomLower = (item.prenom || item.patient?.prenom || "").toLowerCase();
        
                return nomLower.includes(searchQuery) || prenomLower.includes(searchQuery);
            });
        }
        
        
        if (statusFilter !== "all") {
            filteredData = filteredData.filter((item) =>
                Array.from(statusFilter).includes(item.status)
            );
        }

        return filteredData;
    }, [data, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey];    
        switch (columnKey) {
            case "nom":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: item.image }}
                        description={item.email}
                        name={cellValue}
                    >
                        {item.email}
                    </User>
                );
                case "winner":
                    if (item.winner) { 
                      return (
                        <User
                          avatarProps={{ radius: "lg", src: item.winner.image }} 
                          description={item.winner.email} 
                          name={item.winner.name} 
                        >
                          {item.winner.email} // Optionally display the winner's email
                        </User>
                      );
                    } else {
                      return <div>No Winner</div>;
                    }                  
                case "bilan":
                    return (
                        <div className="flex flex-col">
                            <p className="text-bold text-small capitalize">{cellValue?.description}</p>
                        </div>
                    );
                case "patient":
                    return (
                        <User
                        avatarProps={{ radius: "lg", src: cellValue?.image }}
                        description={cellValue.prenom}
                        name={`${cellValue?.nom} ${cellValue?.prenom}`}
                    >
                      {cellValue?.nom} 
                    </User>
                    );                
                    case "status":
                        return (
                            <Chip
                                className="capitalize"
                                color={statusColorMap[cellValue]} // This is where the error can occur if cellValue is undefined
                                size="md"
                                variant="flat"
                                style={{ backgroundColor: "white" }}
                            >
                                {cellValue}
                            </Chip>
                        );            
                        case "actions":
                            return (
                                <div className="relative flex justify-center items-center gap-2">
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button isIconOnly size="sm" variant="light">
                                                <VerticalDotsIcon className="text-default-300" />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu>
                                            {handleDialogUsers &&
                                                <DropdownItem onClick={() => handleDialogUsers(item)}>Information </DropdownItem>
                                            }
                                            {handleDialogOpen &&
                                                <DropdownItem onClick={() => handleDialogOpen(item)}>Ajoute dans la salle </DropdownItem>
                                            }
                                            <DropdownItem onClick={()=>onAdd(item)}>Modifier</DropdownItem>
                                            <DropdownItem onClick={()=>handleDelete(item.id)}>Supprimer</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            );                        
            default:
                return cellValue;
        }
    }, []);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
      
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
      
        return [year, month, day].join('-');
      }

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    {typeInput ==='date' ?(
                        <Input
                        isClearable
                        type="date"
                        value={formatDate(dateData)} // Ensure dateData is in 'YYYY-MM-DD' format
                        onChange={(e) => dateinput(new Date(e.target.value))} // Convert the string back to a Date object
                        className="w-full sm:max-w-[44%]"
                        placeholder="Sélectionnez une date..."
                        />
                    ):(
                        <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Rechercher par nom..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    )

                    }
                  
                    <div className="flex gap-3">
                        {onAdd !== null &&
                             <Button onClick={()=>onAdd()} className="bg-white text-black" endContent={<PlusIcon />}>
                             Ajouter Nouveau
                         </Button>
                        }
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {filteredItems.length} patients
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                    Lignes par page :
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [filterValue, statusFilter, onRowsPerPageChange, onSearchChange]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "Tous les éléments sélectionnés"
                        : `${selectedKeys.size} sur  ${filteredItems.length} sélectionnés`}
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
                        className="bg-white text-black"
                        onPress={onPreviousPage}
                    >
                        Précédent
                    </Button>
                    <Button
                        isDisabled={pages === 1}
                        size="sm"
                        className="bg-white text-black"
                        variant="flat"
                        onPress={onNextPage}
                    >
                        Suivant
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages]);

    return (
        <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px]",
                header: "bg-white", // Make header background white
                cell: "bg-white", // Make cell background white
                body: "bg-white", // Make body background white
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"No users found"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
