"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { ChevronDown } from "lucide-react"

import { ChartContainer } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SellerChartProps {
    title?: string
    subtitle?: string
}

export function SellerChart({ title = "Activity by agent", subtitle = "Average Sellers" }: SellerChartProps) {
    const [timeframe, setTimeframe] = useState("Weekly")

    // Sample data for the chart
    const data = [
        { day: "MON", value: 8 },
        { day: "TUE", value: 4 },
        { day: "WED", value: 9 },
        { day: "THU", value: 5 },
        { day: "FRI", value: 37 },
        { day: "SAT", value: 3 },
        { day: "SUN", value: 8 },
    ]

    // Find the highest value for special styling
    const maxValue = Math.max(...data.map((item) => item.value))
    const maxIndex = data.findIndex((item) => item.value === maxValue)

    // Chart configuration
    const chartConfig = {
        value: {
            label: "Value",
            color: "#EBF2FF",
        },
        maxValue: {
            label: "Max Value",
            color: "#4263EB",
        }
    }

    // Custom tooltip component for the highest value
    const CustomTooltip = ({ x, y, width, height, value }: any) => {
        return (
            <g transform={`translate(${x + width / 2 - 15}, ${y - 40})`}>
                <rect x="0" y="0" width="30" height="30" rx="6" fill="#1E1E30" />
                <text x="15" y="20" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                    {value}
                </text>
            </g>
        )
    }

    return (
        <div className="w-[35%] rounded-md border bg-white p-6 shadow-sm">
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

            <ChartContainer className="min-h-[400px] w-full " config={chartConfig}>
                <BarChart data={data} margin={{ top: 40, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#e5e7eb" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-10} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value === maxValue ? "#4263EB" : "#EBF2FF"} />
                        ))}
                        {data.map((entry, index) =>
                            entry.value === maxValue ? (
                                <CustomTooltip
                                    key={`tooltip-${index}`}
                                    x={index * (100 / data.length) + "%"}
                                    y={0}
                                    width={100 / data.length + "%"}
                                    height="100%"
                                    value={entry.value}
                                />
                            ) : null,
                        )}
                    </Bar>
                </BarChart>
            </ChartContainer>
        </div>
    )
}