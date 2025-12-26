"use client";

import { Header } from "@/components/user/header";
import { Footer } from "@/components/user/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockProducts } from "@/lib/mock-data";
import { cart } from "@/lib/cart";
import { useState } from "react";
import Image from "next/image";
import {
  Star,
  Heart,
  Share2,
  Truck,
  RefreshCw,
  Shield,
  Trash2,
} from "lucide-react";
import { useParams } from "next/navigation";
import {
  useAddToCart,
  useGetAllProducts,
  useGetCart,
  useGetProductById,
  useRemoveFromCart,
  useUpdateCart,
} from "@/lib/hooks/api";
import { IProduct, UpdateCart } from "@/lib/API/api";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data, refetch: refetchProduct } = useGetProductById(id as string);
  const { mutate: AddToCart } = useAddToCart();
  const product = data?.product;
  const { data: products } = useGetAllProducts({
    limit: 5,
    skip: 0,
    filter: product?.material,
  });
  const { mutate: UpdateCart } = useUpdateCart();
  const { mutate: RemoveFromCart } = useRemoveFromCart();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { data: cartData, refetch: refetchCart } = useGetCart();
  const cartItems = cartData?.cart?.items;

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Product not found
          </h1>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = (productId: string) => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select color and size");
      return;
    }
    AddToCart(
      {
        productId: productId,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
      },
      {
        onSuccess: () => {
          toast.success("Product Add In Cart Successfully");
          refetchCart();
          refetchProduct();
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Error To Add This Product In Cart"
          );
        },
      }
    );
  };

  const handleUpdateCart = (productId: string, qty: number) => {
    UpdateCart(
      {
        productId: productId,
        color: selectedColor,
        size: selectedSize,
        quantity: qty.toString(),
      },
      {
        onSuccess: () => {
          toast.success("Cart Updated Successfully");
          refetchCart();
          refetchProduct();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Error To Update Cart");
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
          refetchProduct();
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Error to remove product from cart"
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImage === index
                      ? "border-amber-800"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.title} ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              <Badge className="bg-amber-800 mb-2">Premium Quality</Badge>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-500">
                  (4.8) • 127 reviews
                </span>
              </div>
              <p className="text-2xl font-bold text-amber-800 mb-6">
                ${product.price}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Material
                </label>
                <p className="text-slate-600">{product.material}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product?.colors?.map((color: any) => (
                      <SelectItem key={color?.color} value={color?.color}>
                        {color?.color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger disabled={!selectedColor}>
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {product?.sizes?.map((size: string) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))} */}
                    {product?.colors
                      ?.find((clr: any) => clr.color === selectedColor)
                      ?.sizes?.map((size: any) => (
                        <SelectItem
                          value={size.size}
                          key={size.size + size.quantity}
                        >
                          {size.size}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {!cartItems?.find(
                (item: any) =>
                  item.productId?.toString() === product._id &&
                  item.color === selectedColor &&
                  item.size === selectedSize
              ) && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantity
                  </label>
                  <Select
                    value={quantity?.toString()}
                    onValueChange={(value) =>
                      setQuantity(Number?.parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex gap-4 mb-8">
              {cartItems?.find(
                (item: any) =>
                  item.productId?.toString() === product._id &&
                  item.color === selectedColor &&
                  item.size === selectedSize
              ) ? (
                <div className="flex items-center gap-2">
                  <button
                    disabled={
                      cartItems?.find(
                        (item: any) =>
                          item.productId?.toString() === product._id &&
                          item.color === selectedColor &&
                          item.size === selectedSize
                      )?.quantity <= 1
                    }
                    onClick={() =>
                      handleUpdateCart(
                        product._id,
                        cartItems?.find(
                          (item: any) =>
                            item.productId?.toString() === product._id &&
                            item.color === selectedColor &&
                            item.size === selectedSize
                        )?.quantity - 1
                      )
                    }
                    className={`text-2xl cursor-pointer border-2 px-2 ${
                      cartItems?.find(
                        (item: any) =>
                          item.productId?.toString() === product._id &&
                          item.color === selectedColor &&
                          item.size === selectedSize
                      )?.quantity <= 1
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
                    -
                  </button>
                  <span>
                    {
                      cartItems?.find(
                        (item: any) =>
                          item.productId?.toString() === product._id &&
                          item.color === selectedColor &&
                          item.size === selectedSize
                      )?.quantity
                    }
                  </span>
                  <button
                    disabled={
                      cartItems?.find(
                        (item: any) =>
                          item.productId?.toString() === product._id &&
                          item.color === selectedColor &&
                          item.size === selectedSize
                      )?.quantity >=
                      product?.colors
                        ?.find((clr: any) => clr.color === selectedColor)
                        ?.sizes?.find((size: any) => size.size === selectedSize)
                        ?.quantity
                    }
                    onClick={() =>
                      handleUpdateCart(
                        product._id,
                        cartItems?.find(
                          (item: any) =>
                            item.productId?.toString() === product._id &&
                            item.color === selectedColor &&
                            item.size === selectedSize
                        )?.quantity + 1
                      )
                    }
                    className={`text-2xl cursor-pointer border-2 px-2 ${
                      cartItems?.find(
                        (item: any) =>
                          item.productId?.toString() === product._id &&
                          item.color === selectedColor &&
                          item.size === selectedSize
                      )?.quantity >=
                      product?.colors
                        ?.find((clr: any) => clr.color === selectedColor)
                        ?.sizes?.find((size: any) => size.size === selectedSize)
                        ?.quantity
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
                    +
                  </button>
                </div>
              ) : (
                <Button
                  // onClick={() => handleAddToCart(product._id)}
                  onClick={() => handleAddToCart(product._id)}
                  className="flex-1 bg-amber-800 hover:bg-amber-900"
                >
                  Add to Cart
                </Button>
              )}
              {cartItems?.find(
                (item: any) =>
                  item.productId?.toString() === product._id &&
                  item.color === selectedColor &&
                  item.size === selectedSize
              ) && (
                <button
                  className="flex items-center gap-2 text-red-500 cursor-pointer border border-red-500 px-2 py-1 rounded-md"
                  onClick={() =>
                    handleRemoveFromCart(
                      product._id,
                      selectedColor,
                      selectedSize
                    )
                  }
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              )}
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Truck className="h-4 w-4" />
                <span>Free shipping over $50</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <RefreshCw className="h-4 w-4" />
                <span>30-day returns</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Shield className="h-4 w-4" />
                <span>Premium quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products?.products
              ?.filter((product: IProduct) => product._id !== id)
              ?.map((relatedProduct: IProduct) => (
                <Card
                  key={relatedProduct._id}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={relatedProduct.images[0] || "/placeholder.svg"}
                        alt={relatedProduct.title}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-2">
                        {relatedProduct.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-amber-800">
                          ${relatedProduct.price}
                        </span>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
