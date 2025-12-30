"use client"
import { Header } from "@/components/user/header"
import { Footer } from "@/components/user/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useGetOrderById } from "@/lib/hooks/api"
import { Loader2 } from "lucide-react"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  const { data: orderData, isLoading } = useGetOrderById(id as string)
  const order = orderData?.order

  // Find the shipping address from user's addresses array
  const shippingAddress = order?.userId?.addresses?.find(
    (addr: any) => addr._id === order.shippingAddress
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-800" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg text-slate-600">Order not found</p>
        </div>
        <Footer />
      </div>
    )
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Icon */}
          <div className="mb-8 text-center">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
            <p className="text-lg text-slate-600">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Order Number</h3>
                  <p className="text-amber-800 font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Order Date</h3>
                  <p className="text-slate-600">{orderDate}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Total Amount</h3>
                  <p className="text-slate-900 font-semibold">Rs. {(order.totalAmount - order.voucherDiscount).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Customer Details</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-600">
                    <span className="font-medium text-slate-900">Name:</span> {order.personalDetails.firstName}{" "}
                    {order.personalDetails.lastName}
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium text-slate-900">Email:</span> {order.personalDetails.email}
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium text-slate-900">Phone:</span> {order.personalDetails.phone}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Shipping Address</h3>
                {shippingAddress ? (
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-600">
                      <span className="font-medium text-slate-900">Label:</span> {shippingAddress.label}
                    </p>
                    <p className="text-slate-600">{shippingAddress.house}</p>
                    <p className="text-slate-600">
                      {shippingAddress.city}, {shippingAddress.zip}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-600 text-sm">Address not found</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item._id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    {item.product?.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{item.product?.title}</h4>
                      <p className="text-sm text-slate-600">
                        Color: {item.color} | Size: {item.size} | Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-slate-900 mt-1">
                        Rs. {item.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t space-y-2">
                {order.voucherDiscount > 0 && (
                  <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="text-red-600">Rs. {order.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Discount:</span>
                    <span className="text-green-600">- Rs. {order.voucherDiscount.toLocaleString()}</span>
                  </div>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-slate-900">Total:</span>
                  <span className="text-slate-900">Rs. {(order.totalAmount - order.voucherDiscount).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment & Status Info */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Payment Method</h3>
                  <p className="text-slate-600">{order.paymentMethod}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Payment Status</h3>
                  <p className="text-slate-600 capitalize">{order.paymentStatus}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Order Status</h3>
                  <p className="text-slate-600 capitalize">{order.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-amber-800 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Confirmation Email</h3>
                <p className="text-sm text-slate-600">We've sent a confirmation email with your order details</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 text-amber-800 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Order Processing</h3>
                <p className="text-sm text-slate-600">Your order is being prepared for shipment</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <ArrowRight className="h-8 w-8 text-amber-800 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Tracking Info</h3>
                <p className="text-sm text-slate-600">You'll receive tracking details once shipped</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button variant="outline" size="lg">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/user/account">
              <Button size="lg" className="bg-amber-800 hover:bg-amber-900">
                View Order Status
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-12 p-6 bg-slate-50 rounded-lg text-center">
            <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
            <p className="text-slate-600 mb-4">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
            <Link href="/contact">
              <Button variant="outline">Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
