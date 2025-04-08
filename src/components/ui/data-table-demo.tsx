"use client"

import * as React from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { Badge } from "./badge"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

const data: Payment[] = [
    {
        id: "1",
        agent: {
            agentsName: "Poenix Baker",
            agentsAccount: "@phoenix",
            agnetsImage: "/users/image1.svg"
        },
        "subscription-type": "Scrap",
        "contact-number": +61412345678,
    },
    {
        id: "2",
        agent: {
            agentsName: "Drew Cano",
            agentsAccount: "@drew",
            agnetsImage: "/users/image2.svg"
        },
        "subscription-type": "Salvage",
        "contact-number": +61412345678,
    },
    {
        id: "3",
        agent: {
            agentsName: "Orlando Diggs",
            agentsAccount: "@orlando",
            agnetsImage: "/users/image3.svg"
        },
        "subscription-type": "Scrap",
        "contact-number": +61412345678,
    },
    {
        id: "4",
        agent: {
            agentsName: "Andi Lane",
            agentsAccount: "@andi",
            agnetsImage: "/users/image4.svg"
        },
        "subscription-type": "Salvage",
        "contact-number": +61412345678,
    },
    {
        id: "5",
        agent: {
            agentsName: "Kate Morrison",
            agentsAccount: "@kate",
            agnetsImage: "/users/image5.svg"
        },
        "subscription-type": "Scrap",
        "contact-number": +61412345678,
    },
    {
        id: "6",
        agent: {
            agentsName: "Kate Morrison",
            agentsAccount: "@kate",
            agnetsImage: "/users/image5.svg"
        },
        "subscription-type": "Scrap",
        "contact-number": +61412345678,
    },
    {
        id: "7",
        agent: {
            agentsName: "Kate Morrison",
            agentsAccount: "@kate",
            agnetsImage: "/users/image5.svg"
        },
        "subscription-type": "Scrap",
        "contact-number": +61412345678,
    },
    {
        id: "8",
        agent: {
            agentsName: "Kate Morrison",
            agentsAccount: "@kate",
            agnetsImage: "/users/image5.svg"
        },
        "subscription-type": "Scrap",
        "contact-number": +61412345678,
    },
    {
        id: "9",
        agent: {
            agentsName: "Kate Morrison",
            agentsAccount: "@kate",
            agnetsImage: "/users/image5.svg"
        },
        "subscription-type": "Scrap",
        "contact-number": +61412345678,
    },
    {
        id: "10",
        agent: {
            agentsName: "Kate Morrison",
            agentsAccount: "@kate",
            agnetsImage: "/users/image5.svg"
        },
        "subscription-type": "Scrap",
        "contact-number": +61412345678,
    }
]

export type Payment = {
    id: string
    agent: {
        agentsName: string
        agentsAccount: string
        agnetsImage: string
    }
    "subscription-type": string
    "contact-number": number
}

export const columns: ColumnDef<Payment>[] = [
    {
        id: "select",
        // header: ({ table }) => (
        //     <Checkbox
        //         checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        //         aria-label="Select all"
        //     />
        // ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "agent",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Agents
                    <ArrowDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const agent = row.original.agent
            return (
                <div className="flex items-center gap-2">
                    <Image width={35} height={35} src={agent.agnetsImage || "/placeholder.svg"} alt={agent.agentsName} className="rounded-full" />
                    <div className="flex flex-col">
                        <span className="font-medium">{agent.agentsName}</span>
                        <span className="text-sm text-muted-foreground">{agent.agentsAccount}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "subscription-type",
        header: "Subscription type",
        cell: ({ row }) => <div className="flex items-center">
            <Badge className="bg-[rgba(58,88,232,0.1)] text-black px-3 py-1 rounded-full flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#3a58e8]"></div>
                {row.getValue("subscription-type")}
            </Badge>
        </div>,
    },
    {
        accessorKey: "contact-number",
        header: "Contact Number",
        cell: ({ row }) => <div className="capitalize">+{row.getValue("contact-number")}</div>,
    },
    {
        accessorKey: "seller-aproached",
        header: "Sellers Aproached",
        cell: ({ row }) => <div className="capitalize">{row.getValue("seller-aproached")}</div>,
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: () => {
            return (
                <div className="flex flex-row items-center">
                    <h1>Remove agent</h1>
                    <Button variant="ghost">
                        <Image src={"/delete.svg"} alt={""} width={15} height={15} />
                    </Button>
                </div>
                // <DropdownMenu>
                //     <DropdownMenuTrigger asChild>
                //         <Button variant="ghost" className="h-8 w-8 p-0">
                //             <span className="sr-only">Open menu</span>
                //             <MoreHorizontal className="h-4 w-4" />
                //         </Button>
                //     </DropdownMenuTrigger>
                //     <DropdownMenuContent align="end">
                //         <DropdownMenuLabel>Actions</DropdownMenuLabel>
                //         <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
                //             Copy payment ID
                //         </DropdownMenuItem>
                //         <DropdownMenuSeparator />
                //         <DropdownMenuItem>View customer</DropdownMenuItem>
                //         <DropdownMenuItem>View payment details</DropdownMenuItem>
                //     </DropdownMenuContent>
                // </DropdownMenu>
            )
        },
    },
]

export function DataTableDemo() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [pageSize, setPageSize] = React.useState(5)
    const [pageIndex, setPageIndex] = React.useState(0)

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex,
                pageSize,
            },
        },
    })

    const totalPages = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex + 1

    const generatePaginationItems = () => {
        const items = []
        const maxVisiblePages = 5
        const ellipsisThreshold = 7

        if (totalPages <= ellipsisThreshold) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(i)
            }
        } else {
            items.push(1)

            if (currentPage > 3) {
                items.push("ellipsis-start")
            }

            const startPage = Math.max(2, currentPage - 1)
            const endPage = Math.min(totalPages - 1, currentPage + 1)

            for (let i = startPage; i <= endPage; i++) {
                items.push(i)
            }

            if (currentPage < totalPages - 2) {
                items.push("ellipsis-end")
            }

            items.push(totalPages)
        }

        return items
    }

    return (
        <div className="w-full">

            {/* <div className="flex items-center py-4">
                <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div> */}
            <div className="rounded-md border">
                <div className="border-b-[1px] py-4 px-3">
                    <h1 className="text-md font-semibold">Agents Information</h1>
                    <h1 className="text-gray-500 text-sm">You can find all the information related to agents activity here</h1>
                </div>
                <Table className="bg-[#FAFAFA]">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow className="" key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell className="p-5 " key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-[55vh] text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex gap-10 mt-5">
                <div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
                                    // disabled={!table.getCanPreviousPage()}
                                    className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                            {generatePaginationItems().map((item, index) => {
                                if (item === "ellipsis-start" || item === "ellipsis-end") {
                                    return (
                                        <PaginationItem key={`ellipsis-${index}`}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )
                                }

                                return (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            isActive={currentPage === item}
                                            onClick={() => setPageIndex(Number(item) - 1)}
                                            className={currentPage === item ? "bg-blue-700 text-white " : "border-[1px]"}
                                        >
                                            {item}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setPageIndex(old => Math.min(table.getPageCount() - 1, old + 1))}
                                    disabled={!table.getCanNextPage()}
                                    className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
                <div className="flex items-center gap-2 ">
                    <span className="text-sm ">Result per page</span>
                    <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

