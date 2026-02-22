"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export type Payment = {
  id: string;
  amount: number;
  username: string;
  email: string;
  status: "pending" | "processing" | "success" | "failed";
};

const statusStyles = {
  pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  processing: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  success: "bg-green-500/20 text-green-400 border border-green-500/30",
  failed: "bg-red-500/20 text-red-400 border border-red-500/30",
};

export const columns: ColumnDef<Payment>[] = [
  // ✅ SELECT CHECKBOX
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ✅ USER
  {
    accessorKey: "username",
    header: "User",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("username")}</div>
    ),
  },

  // ✅ EMAIL (sortable)
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  // ✅ STATUS BADGE (FIXED)
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusStyles;

      return (
        <div
          className={cn(
            "px-2 py-1 rounded-md text-xs font-medium w-fit",
            statusStyles[status]
          )}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      );
    },
  },

  // ✅ AMOUNT (RIGHT ALIGNED)
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return (
        <div className="text-right font-semibold tabular-nums">
          {formatted}
        </div>
      );
    },
  },

  // ✅ ACTION MENU
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(payment.id)
              }
            >
              Copy payment ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];