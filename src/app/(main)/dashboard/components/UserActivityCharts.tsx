"use client"

import * as React from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for the chart - you can replace with your actual data
const chartData = [
    { month: "JAN", sellers: 0, scrap: 0, salvage: 0 },
    { month: "FEB", sellers: 500000, scrap: 100000, salvage: 200000 },
    { month: "MAR", sellers: 3000000, scrap: 300000, salvage: 500000 },
    { month: "APR", sellers: 2000000, scrap: 1000000, salvage: 4000000 },
    { month: "MAY", sellers: 200000, scrap: 5000000, salvage: 200000 },
    { month: "JUN", sellers: 300000, scrap: 400000, salvage: 250000 },
    { month: "JUL", sellers: 3000000, scrap: 500000, salvage: 200000 },
    { month: "AUG", sellers: 50000, scrap: 1000000, salvage: 150000 },
    { month: "SEP", sellers: 500000, scrap: 300000, salvage: 200000 },
    { month: "OCT", sellers: 400000, scrap: 800000, salvage: 400000 },
    { month: "NOV", sellers: 200000, scrap: 1000000, salvage: 300000 },
    { month: "DEC", sellers: 0, scrap: 300000, salvage: 100000 },
]

export default function UserActivityCharts() {
    const [timeRange, setTimeRange] = React.useState("12 months")

    return (
        <Card className="w-full my-10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Statistics</div>
                    <CardTitle className="text-xl font-semibold">User Activity report</CardTitle>
                </div>
                <div className="flex flex-row gap-10">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center border px-2 py-1 rounded-sm space-x-1">
                            <div className="h-2 w-2 rounded-full bg-[#8884d8]"></div>
                            <span className="text-xs">sellers approaching agents</span>
                        </div>
                        <div className="flex border px-2 py-1 rounded-sm items-center space-x-1">
                            <div className="h-2 w-2 rounded-full bg-[#ff7c7c]"></div>
                            <span className="text-xs">Scrap</span>
                        </div>
                        <div className="flex border px-2 py-1 rounded-sm items-center space-x-1">
                            <div className="h-2 w-2 rounded-full bg-[#82ca9d]"></div>
                            <span className="text-xs">Salvage</span>
                        </div>
                    </div>
                    <div className="flex rounded-full bg-muted p-1">
                        <button
                            className={`rounded-full px-3 py-1 text-xs ${timeRange === "7 days" ? "bg-background text-foreground" : "text-muted-foreground"}`}
                            onClick={() => setTimeRange("7 days")}
                        >
                            7 days
                        </button>
                        <button
                            className={`rounded-full px-3 py-1 text-xs ${timeRange === "30 days" ? "bg-background text-foreground" : "text-muted-foreground"}`}
                            onClick={() => setTimeRange("30 days")}
                        >
                            30 days
                        </button>
                        <button
                            className={`rounded-full px-3 py-1 text-xs ${timeRange === "12 months" ? "bg-background text-foreground" : "text-muted-foreground"}`}
                            onClick={() => setTimeRange("12 months")}
                        >
                            12 months
                        </button>
                    </div>
                </div>

            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        sellers: {
                            label: "Sellers approaching agents",
                            color: "hsl(240, 60%, 63%)",
                        },
                        scrap: {
                            label: "Scrap",
                            color: "hsl(0, 100%, 75%)",
                        },
                        salvage: {
                            label: "Salvage",
                            color: "hsl(120, 40%, 65%)",
                        },
                    }}
                    className="h-[300px] w-full"
                >
                    <div className="flex h-full w-full flex-col">
                        <div className="flex h-5 items-center text-xs text-muted-foreground">
                            <div className="w-12 text-right">5M</div>
                        </div>
                        <div className="relative flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="sellers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="scrap" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ff7c7c" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ff7c7c" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="salvage" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>

                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                                    <YAxis hide domain={[0, 5000000]} ticks={[0, 50000, 100000, 500000, 1000000, 5000000]} />
                                    <ChartTooltip
                                        content={<ChartTooltipContent formatter={(value) => `${Number(value).toLocaleString()}`} />}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="sellers"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                        strokeDasharray="10 10"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="scrap"
                                        stroke="#ff7c7c"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                        strokeDasharray="10 10"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="salvage"
                                        stroke="#82ca9d"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                        strokeDasharray="10 10"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="absolute left-0 top-0 grid h-full w-12 grid-rows-6 text-xs text-muted-foreground">
                                <div className="flex items-center justify-end">5M</div>

                                <div className="flex items-center justify-end">1M</div>
                                <div className="flex items-center justify-end">500k</div>
                                <div className="flex items-center justify-end">100k</div>
                                <div className="flex items-center justify-end">50k</div>
                                <div className="flex items-center justify-end">0</div>
                            </div>
                        </div>
                    </div>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}