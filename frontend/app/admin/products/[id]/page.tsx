"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetProductById } from "@/lib/hooks/api";
import ProductForm from "@/components/ProductForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader } from "lucide-react";

const Page = () => {
  const { id } = useParams();
  const [getProduct, setGetProduct] = useState();
  const { data: product, isLoading: isProductLoading } = useGetProductById(
    id as string
  );
  useEffect(() => {
    setGetProduct(product);
  }, [product]);
  return (
    <>
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Update Product</h1>
          <p className="text-slate-600">
            Update Product With Title: {product?.product?.title}
          </p>
        </div>
      </div>
      {isProductLoading ? (
        <Loader className="animate-spin h-10 m-auto w-10" />
      ) : (
        <ProductForm product={getProduct} />
      )}
    </>
  );
};

export default Page;
