"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockUsers, mockOrders } from "@/lib/mock-data";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Loader,
} from "lucide-react";
import {
  useDeleteUser,
  useGetAllUsers,
  useUpdateUserStatus,
} from "@/lib/hooks/api";
import { useDebounce } from "@/lib/DebounceFuncrtion";
import { usePaginationStore } from "@/components/store/PaginationStore";
import { PaginationDemo } from "@/components/Pagination";
import { toast } from "sonner";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";

export default function AdminCustomersPage() {
  const { mutate: updateUserStatus, isPending: isUpdatingStatus } =
    useUpdateUserStatus();
  const { mutate: deleteUser, isPending } = useDeleteUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  // const [sortBy, setSortBy] = useState("name");

  const debounceSearch = useDebounce(searchTerm, 500);
  const { offset, settotal } = usePaginationStore();
  const { data: users, refetch } = useGetAllUsers({
    limit: 10,
    skip: offset || 0,
    name: debounceSearch,
    filter:filterBy
  });
  const filteredCustomers = users?.users;

  const DeleteUser = async (id: string) => {
    deleteUser(id as string, {
      onSuccess: () => {
        toast.success("user deleted successfully");
        refetch();
      },
      onError: (err: any) => {
        toast.success(err.response.data.message || "user failed to deleted");
      },
    });
  };

  useEffect(() => {
    settotal(users?.total);
  }, [users]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-600">Manage your customer database</p>
        </div>
        <Button className="bg-amber-800 hover:bg-amber-900">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {users?.total}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Active Customers
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {/* {mockCustomers.filter((c) => c.status === "active").length} */}
                  {users?.total}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  High Value Customers
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {/* {mockCustomers.filter((c) => c.totalSpent > 300).length} */}
                  {users?.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  New This Month
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {users?.total}
                  {/* {
                    mockCustomers.filter(
                      (c) =>
                        new Date(c.joinDate) >
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    ).length
                  } */}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-48">
                ``
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="high-value">High Value</SelectItem>
                <SelectItem value="new">New This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({users?.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers &&
              filteredCustomers?.map((customer: any) => (
                <div
                  key={customer._id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50"
                >
                  <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-800 font-semibold text-lg">
                      {customer?.firstName[0]}
                      {customer?.lastName[0]}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {customer?.firstName} {customer?.lastName}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer?.email}
                          </div>
                          {customer?.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {customer?.phone}
                            </div>
                          )}
                          {customer?.address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {customer?.address?.city},{" "}
                              {customer?.address?.state}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={
                              customer?.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              customer?.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {customer?.status}
                          </Badge>
                          {customer?.totalSpent > 300 && (
                            <Badge className="bg-amber-100 text-amber-800">
                              High Value
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">
                          ${customer?.totalSpent?.toFixed(2) || 0.0}
                        </p>
                        <p className="text-sm text-slate-600">
                          {customer?.totalOrders || 0} orders
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          Last order:{" "}
                          {customer.lastOrder
                            ? new Date(customer?.lastOrder).toLocaleDateString()
                            : "no recive any order"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <Link href={`/admin/customers/${customer._id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Button
                        disabled={isPending}
                        onClick={() => {
                          DeleteUser(customer._id);
                        }}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                      >
                        {isPending ? (
                          <>
                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </>
                        )}
                      </Button>
                      <Switch
                        disabled={isUpdatingStatus}
                        checked={customer?.status === "active"}
                        onCheckedChange={() => {
                          updateUserStatus({
                            id: customer._id,
                            status:
                              customer?.status === "active"
                                ? "inactive"
                                : "active",
                          }, {
                            onSuccess: () => {
                              toast.success("User status updated successfully");
                              refetch();
                            },
                            onError: (err: any) => {
                              toast.error(err.response.data.message || "User status failed to update");
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
      <PaginationDemo />
    </div>
  );
}
