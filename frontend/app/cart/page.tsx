"use client";

import { Header } from "@/components/user/header";
import { Footer } from "@/components/user/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cart } from "@/lib/cart";
import { mockProducts } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import {
  useApplyVoucher,
  useGetCart,
  useRemoveFromCart,
  useRemoveVoucher,
  useUpdateCart,
} from "@/lib/hooks/api";
import { toast } from "sonner";
import { UpdateCart } from "@/lib/API/api";

export default function CartPage() {
  const { data: cartData, refetch: refetchCart } = useGetCart();
  const cartItems = cartData?.cart?.items;
  const { mutate: RemoveFromCart } = useRemoveFromCart();
  const { mutate: UpdateCart } = useUpdateCart();
  const [promoCode, setPromoCode] = useState("");
  const { mutate: ApplyVoucher } = useApplyVoucher();
  const { mutate: RemoveVoucher } = useRemoveVoucher();
  const [discount, setDiscount] = useState(0);

  const handleApplyVoucher = (voucherCode: string) => {
    ApplyVoucher(voucherCode, {
      onSuccess: () => {
        toast.success("Voucher applied successfully");
        refetchCart();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Error to apply voucher");
      },
    });
  };

  const handleRemoveVoucher = () => {
    RemoveVoucher(undefined, {
      onSuccess: () => {
        toast.success("Voucher removed successfully");
        refetchCart();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Error to remove voucher");
      },
    });
  };

  const handleUpdateCart = (
    productId: string,
    color: string,
    size: string,
    quantity: number
  ) => {
    UpdateCart(
      { productId, color, size, quantity },
      {
        onSuccess: () => {
          toast.success("Cart updated successfully");
          refetchCart();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Error to update cart");
        },
      }
    );
  };

  const handleRemoveFromCart = (
    productId: string,
    color: string,
    size: string
  ) => {
    RemoveFromCart(
      { productId, color, size },
      {
        onSuccess: () => {
          toast.success("Product removed from cart successfully");
          refetchCart();
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Error to remove product from cart"
          );
        },
      }
    );
  };

  const subtotal = cart.getTotalPrice();
  const discountAmount = subtotal * discount;
  const shipping = cartData?.cart?.totalPrice > 50 ? 0 : 9.99;

  if (cartItems?.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-slate-600 mb-8">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up!
            </p>
            <Link href="/products">
              <Button className="bg-amber-800 hover:bg-amber-900">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cartItems?.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {cartItems?.map((item: any, index: number) => {

                    return (
                      <div key={`${item.productId}-${item.color}-${item.size}`}>
                        <div className="flex gap-4">
                          <Image
                            src={item?.product?.images[0] || "/placeholder.svg"}
                            alt={item?.product?.title || "Product Image"}
                            width={100}
                            height={100}
                            className="w-20 h-20 object-cover rounded-lg"
                          />

                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">
                              {item?.product?.name}
                            </h3>
                            <p className="text-sm text-slate-600 mb-2">
                              {item.color} • {item.size}
                            </p>
                            <p className="text-sm text-slate-600 mb-3">
                              {item?.product?.material}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleUpdateCart(
                                      item.productId,
                                      item.color,
                                      item.size,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleUpdateCart(
                                      item.productId,
                                      item.color,
                                      item.size,
                                      item.quantity + 1
                                    )
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <div className="text-right">
                                <p className="font-semibold text-amber-800">
                                  ${(item.unitPrice * item.quantity).toFixed(2)}
                                </p>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    handleRemoveFromCart(
                                      item.productId,
                                      item.color,
                                      item.size
                                    )
                                  }
                                  className="text-red-600 hover:text-red-700 p-0 h-auto"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < cartItems.length - 1 && (
                          <Separator className="mt-6" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartData?.cart?.totalPrice.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Included Tax (19%)</span>
                  <span>
                    ${((cartData?.cart?.totalPrice / 119) * 19).toFixed(2)}
                  </span>
                </div>

                {cartData?.cart?.voucherDiscount > 0 && (
                  <div className="flex justify-between">
                    <span>Voucher Discount</span>
                    <span className="text-red-600">-${cartData?.cart?.voucherDiscount?.toFixed(2)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-amber-800">${(cartData?.cart?.totalPrice - cartData?.cart?.voucherDiscount).toFixed(2)}</span>
                </div>

                {/* Promo Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Promo Code</label>
                  <div className="flex gap-2">
                    <Input
                      disabled={cartData?.cart?.voucherCode}
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        handleApplyVoucher(promoCode);
                      }}
                      disabled={!promoCode || cartData?.cart?.voucherCode}
                      variant="outline"
                    >
                      Apply
                    </Button>
                  </div>
                  {cartData?.cart?.voucherCode && (
                    <div className=" relative flex justify-between text-green-600 text-sm bg-green-50 p-2 rounded-md">
                      <Trash2
                        onClick={() => {
                          handleRemoveVoucher();
                        }}
                        className="text-red-600 cursor-pointer h-4 w-4 mr-1"
                      />
                      <span>Voucher Code</span>
                      <span>{cartData?.cart?.voucherCode}</span>
                    </div>
                  )}
                </div>

                <Link href="/checkout" className="block">
                  <Button className="w-full bg-amber-800 hover:bg-amber-900">
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="text-center text-sm text-slate-500">
                  <p>Free shipping on orders over $50</p>
                  <p>Secure checkout with SSL encryption</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
