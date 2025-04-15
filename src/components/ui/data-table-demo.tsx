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
import Image from "next/image"
import { SellerChart } from "@/app/(main)/dashboard/components/SellerChart"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog"

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
    const [pageSize, setPageSize] = React.useState(5)
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
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <div className="flex flex-row items-center">
                        <h1 className="text-sm text-gray-500">Remove user</h1>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" className="hover:bg-gray-200 rounded-full">
                                    <Image color="red" src={"/delete.svg"} alt={"Delete user"} width={18} height={18} />
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the
                                        user account and remove their data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteUser(user._id)} className="bg-red-600 hover:bg-red-700">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                );
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
            <div className="flex flex-col md:flex-row justify-between gap-10">
                {/* Users Data table  */}
                <div className="rounded-md border w-full ">
                    <div className="border-b-[1px] bg-white rounded-t-md py-4 px-3">
                        <h1 className="text-md font-semibold">Users Information</h1>
                        <h1 className="text-gray-500 text-sm">You can find all the information related to users here</h1>
                    </div>
                    <Table className="bg-[#FAFAFA] rounded-b-md">
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
                {/* Seller activity chart  */}
                <SellerChart />
            </div>
            <div className="flex gap-10 mt-5 ">
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
