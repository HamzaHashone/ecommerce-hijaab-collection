"use client";

import { Header } from "@/components/user/header";
import { Footer } from "@/components/user/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockProducts } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Search, Filter } from "lucide-react";
import { useGetAllProducts } from "@/lib/hooks/api";
import { usePaginationStore } from "@/components/store/PaginationStore";
import { useDebounce } from "@/lib/DebounceFuncrtion";
import { IProduct } from "@/lib/API/api";
import { PaginationDemo } from "@/components/Pagination";

export default function ProductsPage() {
  const { offset, settotal } = usePaginationStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filterBy, setFilterBy] = useState("all");
  const debouncedTitle = useDebounce(searchTerm, 500);
  const { data } = useGetAllProducts({
    limit: 10,
    skip: offset,
    title: debouncedTitle,
    filter: filterBy,
    sort: sortBy,
  });

  const filteredProducts = data?.products;

  useEffect(() => {
    settotal(data?.total);
  }, [data]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Our Collection
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Discover our complete range of premium hijabs, each crafted with
              care and attention to detail.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search hijabs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-600" />
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="silk">Silk</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="chiffon">Chiffon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-dsc">Name Z-A</SelectItem>
                  <SelectItem value="price-low-to-high">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-high-to-low">
                    Price: High to Low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-600">
            Showing {filteredProducts?.length} of {data?.total} products
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredProducts?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">
                No products found matching your criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setFilterBy("all");
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts?.map((product: IProduct) => (
                <Card
                  key={product?._id}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={product?.images[0] || "/placeholder.svg"}
                        alt={product?.title}
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                      />
                      {product.featured && (
                        <Badge className="absolute top-2 left-2 bg-amber-800">
                          Featured
                        </Badge>
                      )}
                      {Number(product?.quantity) < 10 && (
                        <Badge
                          variant="destructive"
                          className="absolute top-2 right-2"
                        >
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1">
                        {product?.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        {product?.description}
                      </p>

                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                        <span className="text-sm text-slate-500 ml-1">
                          (4.8)
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-amber-800">
                          ${product?.price}
                        </span>
                        <span className="text-sm text-slate-500">
                          {product?.quantity} in stock
                        </span>
                      </div>

                      <div className="flex gap-2 mb-3">
                        <span className="text-xs text-slate-500">Colors:</span>
                        <div className="flex gap-1">
                          {(product.colors as any).slice(0, 3).map((color:any, index:number) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border border-slate-300"
                              style={{ backgroundColor: color?.color?.toLowerCase() }}
                              title={color?.color}
                            />
                          ))}
                          {(product.colors as any).length > 3 && (
                            <span className="text-xs text-slate-500">
                              +{(product.colors as any).length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link href={`/products/${product._id}`} className="block">
                        <Button className="w-full bg-amber-800 hover:bg-amber-900">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="mt-5">
            <PaginationDemo />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
