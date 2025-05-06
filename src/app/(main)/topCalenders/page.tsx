"use client"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setSelectedMonth, setSelectedDay } from "@/redux/features/agentSlice"

export default function TopChalenders() {
    const dispatch = useAppDispatch()
    const { totalAgents, subscribedAgents, selectedMonth, selectedDay } = useAppSelector((state) => state.agents)

    // Log the values from Redux
    useEffect(() => {
        console.log("Redux total agents:", totalAgents)
        console.log("Redux subscribed agents:", subscribedAgents)
        console.log("Current month:", selectedMonth)
        console.log("Current day:", selectedDay)
    }, [totalAgents, subscribedAgents, selectedMonth, selectedDay])

    // Sample data for the charts
    const subscriberData = [
        { value: 15 },
        { value: 18 },
        { value: 16 },
        { value: 20 },
        { value: 22 },
        { value: 21 },
        { value: 25 },
        { value: 28 },
    ]

    const yellowChartData = [
        { value: 12 },
        { value: 19 },
        { value: 16 },
        { value: 18 },
        { value: 14 },
        { value: 20 },
        { value: 17 },
        { value: 22 },
    ]

    // Month and day options
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

    return (
        <div className="flex flex-wrap gap-4 py-5">
            {/* Agents Card with Month Dropdown */}
            <Card className="w-48 bg-white">
                <CardContent className="pt-4">
                    <div className=" flex flex-row-reverse w-full">
                        <Select value={selectedMonth} onValueChange={(val) => dispatch(setSelectedMonth(val))}>
                            <SelectTrigger className="w-24 h-8 text-sm border rounded-full mb-4">
                                <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map((month) => (
                                    <SelectItem key={month} value={month}>{month}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="mt-2 ">
                        <h2 className="text-2xl font-semibold text-gray-700">{totalAgents}</h2>
                        <p className="text-sm text-gray-500">Agents </p>
                    </div>
                </CardContent>
            </Card>

            {/* New Subscribers Card with Day Dropdown */}
            <Card className="w-48 bg-white">
                <CardContent className="pt-4">
                    <div className="flex flex-row-reverse w-full">
                        <Select value={selectedDay} onValueChange={(val) => dispatch(setSelectedDay(val))}>
                            <SelectTrigger className="w-24 h-8 text-sm border rounded-full mb-4">
                                <SelectValue placeholder="Day" />
                            </SelectTrigger>
                            <SelectContent>
                                {days.map((day) => (
                                    <SelectItem key={day} value={day}>{day}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="mt-2">
                        <h2 className="text-2xl font-semibold text-gray-700">{subscribedAgents}</h2>
                        <p className="text-sm text-gray-500">New Subscribers</p>
                    </div>
                </CardContent>
            </Card>

            {/* Total Subscribers Card with Blue Chart */}
            <Card className="w-56 bg-white">
                <CardContent className="pt-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700">{subscribedAgents}</h2>
                        <p className="text-sm text-gray-500">Total subscribers</p>
                    </div>
                    <div className="h-12 mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={subscriberData}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#4f46e5"
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={true}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Subscriptions Card with Yellow Chart 1 */}
            <Card className="w-56 bg-white">
                <CardContent className="pt-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700">20+</h2>
                        <p className="text-sm text-gray-500">Subscriptions sold on Salvage</p>
                    </div>
                    <div className="h-12 mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={yellowChartData}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={true}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Subscriptions Card with Yellow Chart 2 (duplicate for demo) */}
            <Card className="w-56 bg-white">
                <CardContent className="pt-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700">20+</h2>
                        <p className="text-sm text-gray-500">Subscriptions sold on Salvage</p>
                    </div>
                    <div className="h-12 mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={yellowChartData}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={true}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
