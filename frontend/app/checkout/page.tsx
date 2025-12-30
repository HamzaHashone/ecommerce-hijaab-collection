"use client";

import type React from "react";

import { Header } from "@/components/user/header";
import { Footer } from "@/components/user/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cart } from "@/lib/cart";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CreditCard, Lock, Truck } from "lucide-react";
import { useGetCart, useMyProfile, usePlaceOrder } from "@/lib/hooks/api";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { mutate: placeOrder, isPending: isProcessing } = usePlaceOrder();
  const router = useRouter();
  const { data: cartData } = useGetCart();
  const cartItems = cartData?.cart?.items;
  // const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    paymentMethod: "COD",
    address: null,
  });

  const { data: profileData } = useMyProfile();
  const userData = profileData?.user;

  useEffect(() => {
    if (userData?.addresses?.length > 0) {
      setSelectedAddress(
        userData?.addresses.find((add: any) => add.isDefault)?._id || ""
      );
    }
  }, [userData]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        email: userData?.email,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        phone: userData?.phone,
        paymentMethod: "COD",
        address: selectedAddress || "",
      });
    }
  }, [profileData, selectedAddress]);

  useEffect(() => {
    cart.loadFromStorage();
    if (cartItems?.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const subtotal = cart.getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder({
      address: selectedAddress,
      paymentMethod: formData.paymentMethod,
      personalDetails: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      },
    }, {
      onSuccess: (data: any) => {
        toast.success("Order placed successfully");
        router.push(`/checkout/success?id=${data?.order?._id}`);
      },
      onError: (error: unknown) => {
        toast.error((error as unknown as any)?.response?.data?.message || "Error in placing order");
      },
    });
  };

  if (cartItems?.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-amber-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      1
                    </span>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Doe"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {userData?.addresses?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black">
                      <span className="bg-amber-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                        2
                      </span>
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <div className="px-4">
                    {userData?.addresses?.map((add: any) => (
                      <div
                        key={add._id}
                        className={`flex items-start gap-3 mb-3 px-4 py-3 rounded border ${
                          selectedAddress === add._id
                            ? "border-amber-700 bg-amber-50"
                            : "border-slate-300 bg-white"
                        } shadow-sm`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddress === add._id}
                          onChange={() => {
                            setSelectedAddress(add._id);
                          }}
                          className="mt-1 accent-amber-700 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-base text-black">
                            {add.label || "Address"}
                            {add.isDefault && (
                              <span className="ml-2 px-2 py-0.5 bg-amber-800 text-white text-xs rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-slate-700">
                            <span>{add.house}</span>
                            <br />
                            <span>
                              {add.city}, {add.zip}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-amber-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      3
                    </span>
                    Payment Information
                    <Lock className="h-4 w-4 text-green-600 ml-auto" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <RadioGroup
                      className="text-black accent-amber-700"
                      value={formData.paymentMethod}
                      onValueChange={(value) =>
                        handleInputChange("paymentMethod", value)
                      }
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem color="amber" value="COD">
                          COD
                        </RadioGroupItem>
                        <label htmlFor="COD">COD (Cash on Delivery)</label>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <RadioGroupItem color="amber" value="creditCard">
                          JazzCash
                        </RadioGroupItem>
                        <label htmlFor="creditCard">JazzCash</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem color="amber" value="paypal">
                          EasyPaisa
                        </RadioGroupItem>
                        <label htmlFor="paypal">EasyPaisa</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem color="amber" value="bankTransfer">
                          Bank Transfer
                        </RadioGroupItem>
                        <label htmlFor="bankTransfer">Bank Transfer</label>
                      </div> */}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {cartItems?.map((item: any) => {
                      // const product = mockProducts.find((p) => p._id === item.productId)
                      // if (!product) return null

                      return (
                        <div
                          key={`${item._id}-${item.color}-${item.size}`}
                          className="flex gap-3"
                        >
                          <Image
                            src={item.product?.images[0] || "/placeholder.svg"}
                            alt={item.product?.title || "Product Image"}
                            width={60}
                            height={60}
                            className="w-15 h-15 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {item.product?.title}
                            </h4>
                            <p className="text-xs text-slate-600">
                              {item.color} • {item.size} • Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-semibold text-amber-800">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${cartData?.cart?.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {cartData?.cart?.totalPrice > 50
                          ? "Free"
                          : `$${(9.99).toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Included Tax (19%)</span>
                      <span>
                        ${((cartData?.cart?.totalPrice / 119) * 19).toFixed(2)}
                      </span>
                    </div>
                    {cartData?.cart?.voucherCode && (
                      <div className="flex justify-between">
                        <span>Voucher Discount</span>
                        <span className="text-red-600">
                          -${cartData?.cart?.voucherDiscount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <Separator /> 
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-amber-800">
                        $
                        {(
                          cartData?.cart?.totalPrice -
                          cartData?.cart?.voucherDiscount
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-amber-800">
                      <Truck className="h-4 w-4" />
                      <span>Estimated delivery: 3-5 business days</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-amber-800 hover:bg-amber-900"
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Complete Order - $${(
                          cartData?.cart?.totalPrice -
                          cartData?.cart?.voucherDiscount
                        ).toFixed(2)}`}
                  </Button>

                  <div className="text-center text-xs text-slate-500">
                    <p>Your payment information is secure and encrypted</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
