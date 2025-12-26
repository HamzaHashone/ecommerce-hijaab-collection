"use client";
import { PaginationDemo } from "@/components/Pagination";
import { usePaginationStore } from "@/components/store/PaginationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetAllVouchers } from "@/lib/hooks/api";
import React, { useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Plus,
  Percent,
  DollarSign,
  Calendar,
  Users,
  Copy,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const Page = () => {
  const { offset, settotal } = usePaginationStore();
  const {
    data: vouchers,
    isLoading,
    error,
  } = useGetAllVouchers({
    limit: 10,
    skip: offset || 0,
    code: "",
  });

  useEffect(() => {
    settotal(vouchers?.total || 0);
  }, [vouchers, settotal]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vouchers</h1>
          <p className="text-slate-600">Manage your vouchers here</p>
        </div>
        <Link
          href="/admin/voucher/new"
          className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Voucher
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-800" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          Failed to load vouchers
        </div>
      ) : vouchers?.vouchers?.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No vouchers found. Create your first voucher!
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vouchers?.vouchers?.map((voucher: any) => (
              <Card
                key={voucher._id}
                className={`overflow-hidden ${
                  isExpired(voucher.expiresAt) ? "opacity-60" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{voucher.name}</CardTitle>
                    <Badge
                      variant={isExpired(voucher.expiresAt) ? "destructive" : "default"}
                      className={
                        isExpired(voucher.expiresAt)
                          ? ""
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                      }
                    >
                      {isExpired(voucher.expiresAt) ? "Expired" : "Active"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Voucher Code */}
                  <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-lg p-3 text-center">
                    <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">
                      Code
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl font-bold text-amber-800 tracking-wider">
                        {voucher.code}
                      </span>
                      <button
                        onClick={() => copyCode(voucher.code)}
                        className="text-amber-600 hover:text-amber-800 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Discount Info */}
                  <div className="flex items-center gap-2 text-slate-700">
                    {voucher.discountType === "percentage" ? (
                      <Percent className="h-4 w-4 text-amber-600" />
                    ) : (
                      <DollarSign className="h-4 w-4 text-amber-600" />
                    )}
                    <span className="font-medium">
                      {voucher.discount}
                      {voucher.discountType === "percentage" ? "% off" : "$ off"}
                    </span>
                  </div>

                  {/* Max Uses */}
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span>
                      Max Uses Per User: {voucher.maxUses}
                    </span>
                  </div>

                  {/* total users used */}
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span>
                      Total Users Used: {voucher.participants.reduce((acc: number, participant: any) => acc + participant.uses, 0)}
                    </span>
                  </div>

                  {/* Expiry Date */}
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>
                      Expires: {format(new Date(voucher.expiresAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <PaginationDemo />
        </>
      )}
    </div>
  );
};

export default Page;
