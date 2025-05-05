"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setSubscriptionFilter } from "@/redux/features/agentSlice"

export function SubscriptionFilter() {
    const dispatch = useAppDispatch()
    const { subscriptionFilter } = useAppSelector((state) => state.agents)

    const handleFilterChange = (value: string) => {
        dispatch(setSubscriptionFilter(value))
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by subscription:</span>
            <Select value={subscriptionFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="h-8 bg-white w-[180px]">
                    <SelectValue placeholder="Select subscription" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Subscriptions</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="Corporate Salvage">Corporate Salvage</SelectItem>
                    <SelectItem value="Scrap Weekly">Scrap Weekly</SelectItem>
                    <SelectItem value="Scrap Monthly">Scrap Monthly</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
