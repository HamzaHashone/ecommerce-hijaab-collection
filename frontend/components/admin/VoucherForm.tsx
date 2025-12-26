"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCreateVoucher, useGetAllProducts } from "@/lib/hooks/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const voucherFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  productId: z.string().min(1, "Product is required"),
  discountType: z.enum(["percentage", "fixed"]),
  discount: z.coerce.number().min(1, "Discount must be greater than 0"),
  code: z.string().min(1, "Code is required").toUpperCase(),
  maxUses: z.coerce.number().min(1, "Max uses must be at least 1"),
  expiresAt: z.date({ required_error: "Expiry date is required" }),
});

type VoucherFormValues = z.infer<typeof voucherFormSchema>;

const VoucherForm = () => {
  const router = useRouter();
  const { data: productsData, isLoading: productsLoading } = useGetAllProducts({
    limit: 100,
  });
  const { mutate: createVoucher, isPending } = useCreateVoucher();

  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: {
      name: "",
      productId: "",
      discountType: "percentage",
      discount: 0,
      code: "",
      maxUses: 1,
      expiresAt: new Date(),
    },
  });

  const onSubmit = (data: VoucherFormValues) => {
    createVoucher(data, {
      onSuccess: () => {
        toast.success("Voucher created successfully");
        router.push("/admin/voucher");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to create voucher"
        );
      },
    });
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setValue("code", code);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Voucher Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voucher Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Summer Sale Discount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Code Field */}
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voucher Code</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              placeholder="SUMMER2024"
                              {...field}
                              className="uppercase"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={generateCode}
                          >
                            Generate
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Product Select */}
                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apply to Product</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {productsLoading ? (
                              <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            ) : (
                              productsData?.products?.map((product: any) => (
                                <SelectItem key={product._id} value={product._id}>
                                  {product.title}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Discount Type & Amount */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="percentage">
                                Percentage (%)
                              </SelectItem>
                              <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Discount{" "}
                            {form.watch("discountType") === "percentage"
                              ? "(%)"
                              : "($)"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={
                                form.watch("discountType") === "percentage"
                                  ? 100
                                  : undefined
                              }
                              placeholder="10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Max Uses */}
                  <FormField
                    control={form.control}
                    name="maxUses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Uses Per User</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Expiry Date */}
                  <FormField
                    control={form.control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expiry Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Voucher"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/admin/voucher")}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>

              {/* Preview Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-amber-300 rounded-lg p-4 bg-amber-50">
                    <div className="text-center">
                      <p className="text-xs text-amber-600 uppercase tracking-wide">
                        Voucher Code
                      </p>
                      <p className="text-2xl font-bold text-amber-800 mt-1">
                        {form.watch("code") || "CODE"}
                      </p>
                      <div className="mt-3 text-sm text-amber-700">
                        <p className="font-medium">
                          {form.watch("discount") || 0}
                          {form.watch("discountType") === "percentage"
                            ? "% OFF"
                            : "$ OFF"}
                        </p>
                        <p className="text-xs mt-1">
                          Valid until:{" "}
                          {form.watch("expiresAt")
                            ? format(form.watch("expiresAt"), "MMM dd, yyyy")
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VoucherForm;
