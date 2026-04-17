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
// import { toast } from "sonner"
import Image from "next/image"
import { SellerChart } from "@/app/(main)/dashboard/components/SellerChart"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./alert-dialog"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchAgentsFailure, fetchAgentsStart, fetchAgentsSuccess } from "@/redux/features/agentSlice"

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
    is_blocked: boolean
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
    const dispatch = useAppDispatch()
    const { filteredUsers, loading, error, subscriptionFilter } = useAppSelector((state) => state.agents)
    console.log("Filtered Users", filteredUsers)
    console.log("Subscription filter", subscriptionFilter)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [pageSize, setPageSize] = React.useState(5)
    const [pageIndex, setPageIndex] = React.useState(0)

    const fetchUsers = React.useCallback(async () => {
        try {
            dispatch(fetchAgentsStart())
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/list-all-agents`)
            if (!response.ok) {
                throw new Error("Failed to fetch users")
            }
            const data = await response.json()

            // Calculate total and subscribed agents
            const total = data.length
            const subscribed = data.filter((user: User) => user.is_subscribed !== "None").length

            // Update Redux store
            dispatch(
                fetchAgentsSuccess({
                    totalAgents: total,
                    subscribedAgents: subscribed,
                    allUsers: data,
                }),
            )
        } catch (err) {
            const errorMessage = "Error fetching users data"
            dispatch(fetchAgentsFailure(errorMessage))
            console.error(err)
        }
    }, [dispatch])

    const blockUser = async (userId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/block/${userId}`, {
                method: "POST",
            })

            if (!response.ok) {
                throw new Error("Failed to block user")
            }

            // Refresh data after blocking
            fetchUsers()
        } catch (err) {
            console.error("Error blocking user:", err)
        }
    }

    const unblockUser = async (userId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/unblock/${userId}`, {
                method: "POST",
            })

            if (!response.ok) {
                throw new Error("Failed to unblock user")
            }

            // Refresh data after unblocking
            fetchUsers()
        } catch (err) {
            console.error("Error unblocking user:", err)
        }
    }

    React.useEffect(() => {
        fetchUsers()
    }, [dispatch])

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
                        <Image
                            width={35}
                            height={35}
                            src={user.profile_image && user.profile_image !== "N/A" ? user.profile_image : "/placeholder.svg"}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="rounded-full"
                        />
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
            header: "Blocked Status",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original
                if (user.is_blocked) {
                    return (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white" size="sm">Unblock</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Unblock User?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to unblock this user? They will regain access to their account.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => unblockUser(user._id)}>Unblock</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )
                } else {
                    return (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">Block</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Block User?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to block this user? They will not be able to access their account.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => blockUser(user._id)}>Block</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )
                }
            },
        },
    ]

    const table = useReactTable({
        data: filteredUsers,
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
            <div className="flex flex-col md:flex-row justify-between gap-10 ">
                {/* Users Data table  */}
                <div className="rounded-md border w-full bg-white ">
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
