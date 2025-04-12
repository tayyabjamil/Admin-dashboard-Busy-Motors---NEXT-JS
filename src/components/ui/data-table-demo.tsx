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
import { Badge } from "@/components/ui/badge"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { toast } from "sonner"

export type User = {
    _id: string
    profile_image: string
    favorites: string[]
    active_devices: string[]
    first_name: string
    last_name: string
    email: string
    phone: string
    password: string
    is_subscribed: string
    date_created: string
    date_updated: string
    login_attempts: Array<{
        timestamp: string
        deviceId: string
        _id: string
    }>
    __v: number
}

export function DataTableDemo() {
    const [users, setUsers] = React.useState<User[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [pageSize, setPageSize] = React.useState(10)
    const [pageIndex, setPageIndex] = React.useState(0)

    const fetchUsers = async () => {
        try {
            const response = await fetch("https://scrape4you.onrender.com/auth/list-all-agents")
            if (!response.ok) {
                throw new Error("Failed to fetch users")
            }
            const data = await response.json()
            setUsers(data)
        } catch (err) {
            setError("Error fetching users data")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchUsers()
    }, [])

    const deleteUser = async (userId: string) => {
        try {
            const response = await fetch(`https://scrape4you.onrender.com/auth/delete-agent/${userId}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete user")
            }

            // Update the users state by filtering out the deleted user
            setUsers(users.filter((user) => user._id !== userId))

            toast("User deleted sucessfully", {
                description: "User has been successfully removed",
            })
        } catch (err) {
            console.error("Error deleting user:", err)
            toast("Error", {
                description: "Failed to delete user"
            })
        }
    }

    const columns: ColumnDef<User>[] = [
        {
            id: "select",
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
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        User
                        <ArrowDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex items-center gap-2">
                        {/* <Image
                            width={35}
                            height={35}
                            src={user.profile_image || "/placeholder.svg"}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="rounded-full"
                        /> */}
                        <div className="flex flex-col">
                            <span className="font-medium">
                                {user.first_name} {user.last_name}
                            </span>
                            <span className="text-sm text-muted-foreground">{user.email}</span>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "is_subscribed",
            header: "Subscription Type",
            cell: ({ row }) => {
                const subscription = row.original.is_subscribed
                return (
                    <div className="flex items-center">
                        <Badge
                            className={`${subscription !== "None" ? "bg-[rgba(58,88,232,0.1)]" : "bg-gray-100"} text-black px-3 py-1 rounded-full flex items-center gap-2`}
                        >
                            <div className={`h-2 w-2 rounded-full ${subscription !== "None" ? "bg-[#3a58e8]" : "bg-gray-400"}`}></div>
                            {subscription === "None" ? "No Subscription" : subscription}
                        </Badge>
                    </div>
                )
            },
        },
        {
            accessorKey: "phone",
            header: "Contact Number",
            cell: ({ row }) => <div>{row.original.phone}</div>,
        },
        {
            accessorKey: "date_created",
            header: "Date Created",
            cell: ({ row }) => {
                const date = new Date(row.original.date_created)
                return <div>{format(date, "MMM dd, yyyy")}</div>
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex flex-row items-center">
                        <h1 className="text-sm text-gray-500">Remove user</h1>
                        <Button variant="ghost" onClick={() => deleteUser(user._id)}>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H3.5C3.22386 4 3 3.77614 3 3.5ZM3.5 5C3.22386 5 3 5.22386 3 5.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V5.5C12 5.22386 11.7761 5 11.5 5H3.5ZM5 7.5C5 7.22386 5.22386 7 5.5 7C5.77614 7 6 7.22386 6 7.5V10.5C6 10.7761 5.77614 11 5.5 11C5.22386 11 5 10.7761 5 10.5V7.5ZM9 7.5C9 7.22386 9.22386 7 9.5 7C9.77614 7 10 7.22386 10 7.5V10.5C10 10.7761 9.77614 11 9.5 11C9.22386 11 9 10.7761 9 10.5V7.5Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </Button>
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data: users,
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

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading users data...</div>
    }

    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>
    }

    return (
        <div className="w-full">

            <div className="rounded-md border">
                <div className="border-b-[1px] py-4 px-3">
                    <h1 className="text-md font-semibold">Users Information</h1>
                    <h1 className="text-gray-500 text-sm">You can find all the information related to users here</h1>
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
                                        <TableCell className="p-5" key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
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
                                    onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
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
                                    onClick={() => setPageIndex((old) => Math.min(table.getPageCount() - 1, old + 1))}
                                    className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm">Results per page</span>
                    <Select
                        value={String(pageSize)}
                        onValueChange={(value) => {
                            setPageIndex(0)
                            setPageSize(Number(value))
                        }}
                    >
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
