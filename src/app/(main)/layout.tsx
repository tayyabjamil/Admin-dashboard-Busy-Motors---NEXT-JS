"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, AlertCircle } from "lucide-react"

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/reportissues", label: "Report Issues", icon: AlertCircle },
]

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-56 bg-white border-r flex flex-col shrink-0">
                <div className="flex items-center gap-3 px-5 py-6 border-b">
                    <Image width={30} height={30} src="/logo.svg" alt="Logo" />
                    <span className="font-semibold text-sm">Admin Panel</span>
                </div>
                <nav className="flex flex-col gap-1 p-3 mt-2">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <Icon size={17} />
                                {label}
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}
