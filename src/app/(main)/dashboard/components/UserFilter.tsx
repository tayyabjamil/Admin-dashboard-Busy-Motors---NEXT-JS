"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
    _id: string
    first_name: string
    last_name: string
    email: string
    phone: string
    is_subscribed: string
    profile_image: string
    date_created: string
    date_updated: string
    // other properties omitted for brevity
}

export default function UserFilter({ users }: { users: User[] }) {
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users)
    const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all")

    useEffect(() => {
        if (subscriptionFilter === "all") {
            setFilteredUsers(users)
        } else {
            setFilteredUsers(users.filter((user) => user.is_subscribed === subscriptionFilter))
        }
    }, [subscriptionFilter, users])

    return (
        <div>
            <div className="mb-4">
                <Select onValueChange={setSubscriptionFilter} defaultValue="all">
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by subscription" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Subscriptions</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Scrap Weekly">Scrap Weekly</SelectItem>
                        <SelectItem value="Scrap Monthly">Scrap Monthly</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-4">
                {filteredUsers.map((user) => (
                    <div key={user._id} className="p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                            <img
                                src={user.profile_image || "/placeholder.svg"}
                                alt={`${user.first_name} ${user.last_name}`}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <h3 className="font-medium">
                                    {user.first_name} {user.last_name}
                                </h3>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <p className="text-xs text-gray-400">Subscription: {user.is_subscribed}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
