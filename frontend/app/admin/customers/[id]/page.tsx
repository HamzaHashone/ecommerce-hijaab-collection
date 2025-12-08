"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Trash2,
  User,
  ShoppingBag,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  Home,
  Building,
  Briefcase,
} from "lucide-react";
import {
  useGetUserById,
  useDeleteUser,
  useUpdateUserStatus,
} from "@/lib/hooks/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: customer, isLoading, error } = useGetUserById(id as string);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: updateUserStatus, isPending: isUpdatingStatus,refetch } = useUpdateUserStatus();
  const handleDeleteCustomer = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this customer? This action cannot be undone."
      )
    ) {
      deleteUser(id as string, {
        onSuccess: () => {
          toast.success("Customer deleted successfully");
          router.push("/admin/customers");
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message || "Failed to delete customer"
          );
        },
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Customer Not Found
        </h2>
        <p className="text-slate-600 mb-4">
          The customer you're looking for doesn't exist.
        </p>
        <Link href="/admin/customers">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
        </Link>
      </div>
    );
  }

  const user = customer.user || customer;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/customers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-slate-600">Customer Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            disabled={isUpdatingStatus}
            checked={user.status === "active"}
            onCheckedChange={() => {
              updateUserStatus({ id: user._id, status: user.status === "active" ? "inactive" : "active" }, {
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteCustomer}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isDeleting ? (
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-800 font-semibold text-xl">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-slate-600">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(user.status || "active")}
                    <Badge variant="outline" className="text-xs">
                      {user.role || "Customer"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="text-slate-900 font-medium">{user.email}</p>
                </div>

                {user.phone && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">Phone</span>
                    </div>
                    <p className="text-slate-900 font-medium">{user.phone}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Member Since</span>
                  </div>
                  <p className="text-slate-900 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Last Updated</span>
                  </div>
                  <p className="text-slate-900 font-medium">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            {user.addresses &&
              user.addresses.map((address: any) => (
                <CardContent key={address.city + address.zip}>
                  <div className="space-y-2">
                    {address.isDefault && (
                      <Badge variant="outline" className="text-xs">
                        {address.isDefault && "Default"}
                      </Badge>
                    )}
                    {address.label && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {address.label === "Home" && (
                          <Home className="text-amber-800 h-4 w-4" />
                        )}
                        {address.label === "Office" && (
                          <Building className="text-amber-800 h-4 w-4" />
                        )}
                        {address.label === "Work" && (
                          <Briefcase className="text-amber-800 h-4 w-4" />
                        )}
                        {address.label && address.label}
                      </Badge>
                    )}
                    <p className="text-slate-900 font-medium">
                      {address.house}
                    </p>
                    <p className="text-slate-600">
                      {address.zip}, {address.city}
                    </p>
                  </div>
                </CardContent>
              ))}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Customer Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {user.totalOrders || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Spent</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${user.totalSpent?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Average Order</p>
                  <p className="text-2xl font-bold text-slate-900">
                    $
                    {user.totalOrders > 0
                      ? (user.totalSpent / user.totalOrders).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <Package className="h-6 w-6 text-amber-600" />
                </div>
              </div>

              {user.lastOrder && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-slate-600">Last Order</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {new Date(user.lastOrder).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ShoppingBag className="h-4 w-4 mr-2" />
                View Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
