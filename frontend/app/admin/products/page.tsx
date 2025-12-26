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
import Link from "next/link";
import Image from "next/image";
import { Search, Plus, Edit, Eye, Loader2 } from "lucide-react";
import {
  useDeleteProduct,
  useGetAllProducts,
  useGetSettings,
} from "@/lib/hooks/api";
import { useDebounce } from "@/lib/DebounceFuncrtion";
import { PaginationDemo } from "@/components/Pagination";
import { usePaginationStore } from "@/components/store/PaginationStore";
import { IProduct } from "@/lib/API/api";
import { toast } from "sonner";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useRouter } from "next/navigation";
export default function AdminProductsPage() {
  const { data: settings } = useGetSettings();
  const router = useRouter();
  const limit = 10;
  const { offset, settotal } = usePaginationStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const debounceTitle = useDebounce(searchTerm, 500);
  const {
    data: products,
    isLoading: productsLoading,
    refetch,
  } = useGetAllProducts({
    limit,
    skip: offset,
    sort: sortBy,
    filter: filterBy,
    title: debounceTitle,
  });
  const { mutate: DeleteProduct, isPending: isDeleting } = useDeleteProduct();
  useEffect(() => {
    settotal(products?.total);
  }, [products]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600">Manage your product inventory</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-amber-800 hover:bg-amber-900">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filterBy}
              onValueChange={(e) => {
                if (e === "all") {
                  setFilterBy("");
                } else {
                  setFilterBy(e);
                }
              }}
            >
              <SelectTrigger className="w-48">
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
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
        </CardContent>
      </Card>
      {/* Products Table */}
      {productsLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Products ({products?.total})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products?.products?.map((product: IProduct) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50"
                >
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.title}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {product.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {product.material}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {product.featured && (
                            <Badge className="bg-amber-100 text-amber-800">
                              Featured
                            </Badge>
                          )}
                          {Number(product.quantity) <
                            settings?.settings?.[0]?.quantityForLowStock && (
                            <Badge variant="destructive">Low Stock</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">
                          ${product.price}
                        </p>
                        <p className="text-sm text-slate-600">
                          {product.quantity} in stock
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        onClick={() =>
                          router.push(`/admin/products/${product._id}`)
                        }
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        onClick={() =>
                          router.push(`/admin/products/new?id=${product._id}`)
                        }
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <ConfirmationModal
                        onClick={() => {
                          DeleteProduct(product._id as string, {
                            onSuccess: () => {
                              toast.success(
                                `${product.title} has been deleted successfully`
                              );
                              refetch();
                            },
                            onError: (error: any) => {
                              toast.success(
                                error?.response?.data?.message ||
                                  `${product.title} has been deleted successfully`
                              );
                              console.log(
                                error,
                                `error in deleting ${product.title}`
                              );
                            },
                          });
                        }}
                        buttonText="Delete"
                        isLoading={isDeleting}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <PaginationDemo />
    </div>
  );
}
