
import { DataTableDemo } from "@/components/ui/data-table-demo";
import Image from "next/image";

export default function TablePage() {
    return (
        <div className="w-full px-10 py-8">
            <div className="flex flex-row gap-5 items-center pb-6">
                <Image width={35} height={35} src={"/logo.svg"} alt="Logo" />
                <h1 className="text-2xl font-bold">Welcome to Admin Panel</h1>
            </div>
            <DataTableDemo />
        </div >
    )
}

