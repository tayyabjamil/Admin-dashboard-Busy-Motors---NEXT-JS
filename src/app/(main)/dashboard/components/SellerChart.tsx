"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { ChevronDown } from "lucide-react"

import { ChartContainer } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAppSelector } from "@/redux/hooks"

interface SellerChartProps {
    title?: string
    subtitle?: string
}

interface CustomTooltipProps {
    x: number | string
    y: number | string
    width: number | string
    height: string | number
    value: number
}

interface User {
    _id: string
    first_name: string
    last_name: string
    email: string
    phone: string
    is_subscribed: string
    date_created: string
    date_updated: string
}

interface ChartDataItem {
    day: string
    value: number
}

export function SellerChart({ title = "Activity by agent", subtitle = "Agent Signups" }: SellerChartProps) {
    const [timeframe, setTimeframe] = useState("Weekly")
    const [chartData, setChartData] = useState<ChartDataItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Get filtered users from Redux
    const { filteredUsers, loading: reduxLoading } = useAppSelector((state) => state.agents)

    // Function to process user data based on timeframe
    const processData = (users: User[], timeframe: string): ChartDataItem[] => {
        if (!users || users.length === 0) return []

        // Group users by the appropriate time unit
        const groupedData: Record<string, number> = {}

        users.forEach((user) => {
            const date = new Date(user.date_created)
            let key = ""

            if (timeframe === "Daily") {
                // Format as YYYY-MM-DD
                key = date.toISOString().split("T")[0]
            } else if (timeframe === "Weekly") {
                // Get day of week (0-6, where 0 is Sunday)
                const dayOfWeek = date.getDay()
                const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
                key = days[dayOfWeek]
            } else if (timeframe === "Monthly") {
                // Get month (0-11, where 0 is January)
                const month = date.getMonth()
                const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
                key = months[month]
            }

            if (!groupedData[key]) {
                groupedData[key] = 0
            }
            groupedData[key]++
        })

        // Convert grouped data to array format for chart
        let formattedData: ChartDataItem[] = []

        if (timeframe === "Daily") {
            // Sort dates chronologically
            formattedData = Object.entries(groupedData)
                .map(([date, count]) => ({ day: date, value: count }))
                .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime())
                .slice(-7) // Show only last 7 days
        } else if (timeframe === "Weekly") {
            // Order by day of week (starting with Monday)
            const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
            formattedData = days.map((day) => ({
                day,
                value: groupedData[day] || 0,
            }))
        } else if (timeframe === "Monthly") {
            // Order by month
            const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
            formattedData = months.map((month) => ({
                day: month,
                value: groupedData[month] || 0,
            }))
        }

        return formattedData
    }

    // Update chart when filtered users or timeframe changes
    useEffect(() => {
        if (reduxLoading) {
            setLoading(true)
            return
        }

        try {
            // Process data based on the filtered users from Redux
            const processedData = processData(filteredUsers, timeframe)
            setChartData(processedData)
            setLoading(false)
        } catch (err) {
            console.error("Error processing chart data:", err)
            setError("Failed to process chart data")
            setLoading(false)
        }
    }, [filteredUsers, timeframe, reduxLoading])

    // Find the highest value for special styling
    const maxValue = chartData.length > 0 ? Math.max(...chartData.map((item) => item.value)) : 0

    // Chart configuration
    const chartConfig = {
        value: {
            label: "Value",
            color: "#EBF2FF",
        },
        maxValue: {
            label: "Max Value",
            color: "#4263EB",
        },
    }

    // Custom tooltip component for the highest value
    const CustomTooltip = ({ x, y, width, value }: CustomTooltipProps) => {
        // Convert x and width to numbers if they're percentages
        const xValue = typeof x === "string" ? 0 : x
        const widthValue = typeof width === "string" ? 0 : width

        return (
            <g transform={`translate(${xValue + widthValue / 2 - 15}, ${typeof y === "string" ? 0 : y - 40})`}>
                <rect x="0" y="0" width="30" height="30" rx="6" fill="#1E1E30" />
                <text x="15" y="20" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                    {value}
                </text>
            </g>
        )
    }

    return (
        <div className="md:w-[35%] w-full rounded-md border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <h3 className="text-xl font-bold">{subtitle}</h3>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 gap-1 px-3">
                            {timeframe}
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTimeframe("Daily")}>Daily</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTimeframe("Weekly")}>Weekly</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTimeframe("Monthly")}>Monthly</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <p>Loading chart data...</p>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <p className="text-red-500">{error}</p>
                </div>
            ) : (
                <ChartContainer className="min-h-[400px] w-full" config={chartConfig}>
                    <BarChart data={chartData} margin={{ top: 40, right: 10, left: 10, bottom: 20 }}>
                        <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#e5e7eb" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-10} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.value === maxValue && maxValue > 0 ? "#4263EB" : "#EBF2FF"} />
                            ))}
                            {chartData.map((entry, index) =>
                                entry.value === maxValue && maxValue > 0 ? (
                                    <CustomTooltip
                                        key={`tooltip-${index}`}
                                        x={index * (100 / chartData.length) + "%"}
                                        y={0}
                                        width={100 / chartData.length + "%"}
                                        height="100%"
                                        value={entry.value}
                                    />
                                ) : null,
                            )}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            )}
        </div>
    )
}
