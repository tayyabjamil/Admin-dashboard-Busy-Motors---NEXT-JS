"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import { ChartContainer } from "@/components/ui/chart"
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
    const [chartData, setChartData] = useState<ChartDataItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Get filtered users and calendar selections from Redux
    const { filteredUsers, loading: reduxLoading, selectedMonth } = useAppSelector((state) => state.agents)

    // Function to process user data based on selectedMonth
    const processData = (users: User[], month: string): ChartDataItem[] => {
        if (!users || users.length === 0) return []

        // Group users by day of week for the selected month
        const groupedData: Record<string, number> = {}
        const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
        days.forEach((d) => (groupedData[d] = 0))

        users.forEach((user) => {
            const date = new Date(user.date_created)
            const userMonth = date.toLocaleString("en-US", { month: "short" }).toUpperCase()
            const dayOfWeek = date.getDay()
            const dayKey = days[dayOfWeek === 0 ? 6 : dayOfWeek - 1] // Adjust so MON=0, SUN=6
            if (userMonth === month) {
                groupedData[dayKey]++
            }
        })

        // Format for chart
        return days.map((d) => ({ day: d, value: groupedData[d] }))
    }

    // Update chart when filtered users or calendar selections change
    useEffect(() => {
        if (reduxLoading) {
            setLoading(true)
            return
        }
        try {
            const processedData = processData(filteredUsers, selectedMonth)
            setChartData(processedData)
            setLoading(false)
            // Log backend data and processed chart data
            console.log("SellerChart: filteredUsers from backend:", filteredUsers)
            console.log("SellerChart: processed chartData:", processedData)
        } catch {
            setError("Failed to process chart data")
            setLoading(false)
        }
    }, [filteredUsers, selectedMonth, reduxLoading])

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
