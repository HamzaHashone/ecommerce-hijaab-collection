"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Package, DollarSign, Save, Loader, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  useGetSettings,
  useUpdateSettings,
  useCreateSettings,
  useGetCompanyAddress,
  useUpdateCompanyAddress,
} from "@/lib/hooks/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const companyAddressSchema = z.object({
  name: z.string().min(1),
  street1: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
});

type ICompanyAddress = z.infer<typeof companyAddressSchema>;

const AdminSettingsPage = () => {
  // TanStack Query hooks

  const { data: settingsData, isLoading, refetch } = useGetSettings();
  const { mutate: createSettings, isPending: isCreating } = useCreateSettings();
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateSettings();
  const {
    data: companyAddressData,
    isLoading: isCompanyAddressLoading,
    refetch: refetchCompanyAddress,
  } = useGetCompanyAddress();
  const { mutate: updateCompanyAddress, isPending: isUpdatingCompanyAddress } =
    useUpdateCompanyAddress();

  const settings = settingsData?.settings?.[0] || null;
  const isSaving = isCreating || isUpdating;

  const companyAddressForm = useForm<ICompanyAddress>({
    resolver: zodResolver(companyAddressSchema),
    defaultValues: {
      name: "",
      street1: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
      email: "",
    },
  });

  // Update form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        quantityForLowStock: settings.quantityForLowStock,
        highValueUserSpents: settings.highValueUserSpents,
      });
    } else if (settingsData?.settings?.length === 0) {
      // No settings found, set default values
      setFormData({
        quantityForLowStock: 10,
        highValueUserSpents: 500,
      });
    }
  }, [settings, settingsData]);

  useEffect(() => {
    if (companyAddressData) {
      console.log(companyAddressData.companyAddress);
      companyAddressForm.reset({
        name: companyAddressData.companyAddress.name,
        street1: companyAddressData.companyAddress.street1,
        city: companyAddressData.companyAddress.city,
        state: companyAddressData.companyAddress.state,
        zip: companyAddressData.companyAddress.zip,
        country: companyAddressData.companyAddress.country,
        phone: companyAddressData.companyAddress.phone,
        email: companyAddressData.companyAddress.email,
      });
    }
  }, [companyAddressData?.companyAddress]);
  const [formData, setFormData] = useState({
    quantityForLowStock: 0,
    highValueUserSpents: 0,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const handleSave = () => {
    if (settings) {
      // Update existing settings
      updateSettings(
        { id: settings._id, data: formData },
        {
          onSuccess: () => {
            toast.success("Settings updated successfully");
            refetch();
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message || "Failed to update settings"
            );
          },
        }
      );
    } else {
      // Create new settings
      createSettings(formData, {
        onSuccess: () => {
          toast.success("Settings created successfully");
          refetch();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to create settings"
          );
        },
      });
    }
  };

  const handleCompanyAddressSubmit = (data: ICompanyAddress) => {
      updateCompanyAddress(
        { id: companyAddressData?.companyAddress?._id, data },
        {
          onSuccess: () => {
            toast.success("Company address updated successfully");
            refetchCompanyAddress();
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message || "Failed to update company address"
            );
          },
        }
      );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600">Manage your application settings</p>
        </div>
      </div>

      {/* Settings Form */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Application Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quantity for Low Stock */}
            <div className="space-y-2">
              <Label
                htmlFor="quantityForLowStock"
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Quantity for Low Stock Alert
              </Label>
              <Input
                id="quantityForLowStock"
                type="number"
                min="0"
                value={formData.quantityForLowStock}
                onChange={(e) =>
                  handleInputChange("quantityForLowStock", e.target.value)
                }
                placeholder="Enter minimum quantity"
                className="w-full"
              />
              <p className="text-sm text-slate-600">
                Products with stock below this number will be marked as low
                stock
              </p>
            </div>

            {/* High Value User Spent */}
            <div className="space-y-2">
              <Label
                htmlFor="highValueUserSpents"
                className="flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                High Value Customer Threshold
              </Label>
              <Input
                id="highValueUserSpents"
                type="number"
                min="0"
                step="0.01"
                value={formData.highValueUserSpents}
                onChange={(e) =>
                  handleInputChange("highValueUserSpents", e.target.value)
                }
                placeholder="Enter amount threshold"
                className="w-full"
              />
              <p className="text-sm text-slate-600">
                Customers who have spent this amount or more are considered high
                value
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-amber-800 hover:bg-amber-900"
            >
              {isSaving ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  {settings ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {settings ? "Update Settings" : "Create Settings"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Settings Display */}
      {settings && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Current Low Stock Threshold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-600">
                  {settings.quantityForLowStock}
                </p>
                <p className="text-slate-600 mt-2">items</p>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Current High Value Threshold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  ${settings.highValueUserSpents.toFixed(2)}
                </p>
                <p className="text-slate-600 mt-2">total spent</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Company Details</h1>
          <p className="text-slate-600">Manage your company details</p>
        </div>
      </div>

      {/* Settings Form */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Company Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...companyAddressForm}>
            <form
              onSubmit={companyAddressForm.handleSubmit(
                handleCompanyAddressSubmit
              )}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={companyAddressForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Company Name" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyAddressForm.control}
                  name="street1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Street Address" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyAddressForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyAddressForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyAddressForm.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP</FormLabel>
                      <FormControl>
                        <Input placeholder="ZIP" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyAddressForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyAddressForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyAddressForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={ isUpdatingCompanyAddress}
                  className="bg-amber-800 hover:bg-amber-900"
                >
                  { isUpdatingCompanyAddress ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      {companyAddressData?.companyAddress ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {companyAddressData?.companyAddress ? "Update Company Address" : "Create Company Address"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;
