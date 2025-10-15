'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  History,
  FileText,
  CircleUser,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/transfer", label: "Transfer", icon: ArrowLeftRight },
  { href: "/dashboard/transactions", label: "Transactions", icon: History },
  { href: "/dashboard/kyc", label: "KYC", icon: FileText },
  { href: "/dashboard/profile", label: "Profile", icon: CircleUser },
];

export function SidebarMenu() {
    const pathname = usePathname();
    return (
        <ul className="space-y-1">
            {menuItems.map((item) => (
                <li key={item.href}>
                    <Link
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                            pathname === item.href && "bg-muted text-primary"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
