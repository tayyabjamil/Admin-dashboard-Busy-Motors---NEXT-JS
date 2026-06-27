"use client"

import * as React from "react"
import {
    type ColumnDef,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/alert-dialog"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
    fetchIssuesStart,
    fetchIssuesSuccess,
    fetchIssuesFailure,
    type ReportIssue,
} from "@/redux/features/reportIssuesSlice"

export default function ReportIssuesPage() {
    const dispatch = useAppDispatch()
    const { allIssues, loading, error } = useAppSelector((state) => state.reportIssues)

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [pageSize, setPageSize] = React.useState(10)
    const [pageIndex, setPageIndex] = React.useState(0)

    // GET — fetch all report issues
    const fetchIssues = React.useCallback(async () => {
        try {
            dispatch(fetchIssuesStart())
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/report-issues/all`)
            if (!response.ok) throw new Error("Failed to fetch report issues")
            const data = await response.json()
            dispatch(fetchIssuesSuccess(data))
        } catch (err) {
            dispatch(fetchIssuesFailure("Error fetching report issues"))
            console.error(err)
        }
    }, [dispatch])

    // DELETE — resolve and delete issue
    const resolveIssue = async (issueId: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/report-issues/resolve/${issueId}`,
                { method: "DELETE" }
            )
            if (!response.ok) throw new Error("Failed to resolve issue")
            fetchIssues()
        } catch (err) {
            console.error("Error resolving issue:", err)
        }
    }

    React.useEffect(() => {
        fetchIssues()
    }, [fetchIssues])

    const columns: ColumnDef<ReportIssue>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.name}</span>
                    <span className="text-sm text-muted-foreground">{row.original.email}</span>
                </div>
            ),
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <div className="max-w-[400px] truncate" title={row.original.description}>
                    {row.original.description}
                </div>
            ),
        },
        {
            accessorKey: "created_at",
            header: "Date",
            cell: ({ row }) => (
                <div>{new Date(row.original.created_at).toLocaleDateString()}</div>
            ),
        },
        {
            id: "actions",
            header: "Action",
            cell: ({ row }) => {
                const issue = row.original
                return (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                Resolve
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Resolve Issue?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Mark this issue as resolved? This will notify the user.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => resolveIssue(issue._id)}>
                                    Resolve
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )
            },
        },
    ]

    const table = useReactTable({
        data: allIssues,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnVisibility,
            pagination: { pageIndex, pageSize },
        },
    })

    const totalPages = table.getPageCount()
    const currentPage = pageIndex + 1

    const generatePaginationItems = () => {
        const items: (number | string)[] = []
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) items.push(i)
        } else {
            items.push(1)
            if (currentPage > 3) items.push("ellipsis-start")
            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)
            for (let i = start; i <= end; i++) items.push(i)
            if (currentPage < totalPages - 2) items.push("ellipsis-end")
            items.push(totalPages)
        }
        return items
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading report issues...</div>
    }

    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>
    }

    return (
        <div className="w-full bg-[#8796e11a] px-10 py-8">
            <h1 className="text-2xl font-bold pb-6">Report Issues</h1>

            <div className="rounded-md border w-full bg-white">
                <div className="border-b-[1px] bg-white rounded-t-md py-4 px-3">
                    <h2 className="text-md font-semibold">Reported Issues</h2>
                    <p className="text-gray-500 text-sm">All issues reported by users</p>
                </div>

                <Table className="bg-[#FAFAFA] rounded-b-md">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
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
                                    No issues found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex gap-10 mt-5">
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
                                        className={currentPage === item ? "bg-blue-700 text-white" : "border-[1px]"}
                                    >
                                        {item}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        })}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setPageIndex((prev) => Math.min(table.getPageCount() - 1, prev + 1))}
                                className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>

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
                            {[5, 10, 20, 30, 50].map((size) => (
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
