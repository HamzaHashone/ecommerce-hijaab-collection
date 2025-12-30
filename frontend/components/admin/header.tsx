"use client";
import { Bell, Loader, Search, Package, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { useGetAllOrders, useGetAllProducts } from "@/lib/hooks/api";
import { useDebounce } from "@/lib/DebounceFuncrtion";
import Link from "next/link";

export function AdminHeader() {
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceSearch = useDebounce(search, 500);
  
  const { data: products, isLoading: isLoadingProducts } = useGetAllProducts({
    title: debounceSearch,
  });
  const filteredProducts = products?.products || [];
  
  const { data: orders, isLoading: isLoadingOrders } = useGetAllOrders({
    search: debounceSearch,
  });
  const filteredOrders = orders?.orders || [];

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 relative z-10" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search products, orders..."
            className="pl-10 pr-10 w-80"
          />
          {search && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full"
              onClick={() => {
                setSearch("");
                setIsSearchFocused(false);
              }}
            >
              <X className="h-4 w-4 text-slate-400" />
            </Button>
          )}
        </div>
        
        {search && isSearchFocused && (
          <div className="absolute top-14 left-0 w-[600px] bg-white shadow-lg rounded-lg border border-slate-200 overflow-hidden max-h-[500px] overflow-y-auto">
            {isLoadingProducts || isLoadingOrders ? (
              <div className="flex items-center justify-center p-8">
                <Loader className="h-6 w-6 animate-spin text-amber-800" />
              </div>
            ) : filteredProducts.length < 1 && filteredOrders.length < 1 ? (
              <div className="p-8 text-center">
                <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-900 mb-1">No results found</p>
                <p className="text-xs text-slate-500">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div className="space-y-3 p-3">
                {/* Orders Section */}
                {filteredOrders.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-t-md border-b">
                      <ShoppingBag className="h-4 w-4 text-amber-800" />
                      <h3 className="text-sm font-semibold text-slate-900">
                        Orders ({filteredOrders.length})
                      </h3>
                    </div>
                    <div className="space-y-1 mt-2">
                      {filteredOrders.slice(0, 5).map((order: any) => (
                        <Link
                          href={`/admin/orders/${order._id}`}
                          key={order._id}
                          onClick={() => {
                            setSearch("");
                            setIsSearchFocused(false);
                          }}
                        >
                          <div className="px-3 py-3 hover:bg-amber-50 rounded-md cursor-pointer transition-colors border border-transparent hover:border-amber-200">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-semibold text-slate-900">
                                    {order.personalDetails.firstName} {order.personalDetails.lastName}
                                  </p>
                                  <Badge className={`text-xs px-2 py-0 ${getStatusColor(order.status)}`}>
                                    {order.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-500 mb-1">
                                  Order #{order._id.slice(-8).toUpperCase()} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-slate-600">
                                  <span>{order.paymentMethod}</span>
                                  <span>•</span>
                                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-amber-800">
                                  Rs. {order.totalAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {filteredProducts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-t-md border-b">
                      <Package className="h-4 w-4 text-amber-800" />
                      <h3 className="text-sm font-semibold text-slate-900">
                        Products ({filteredProducts.length})
                      </h3>
                    </div>
                    <div className="space-y-1 mt-2">
                      {filteredProducts.slice(0, 5).map((product: any) => (
                        <Link
                          href={`/admin/products/${product._id}`}
                          key={product._id}
                          onClick={() => {
                            setSearch("");
                            setIsSearchFocused(false);
                          }}
                        >
                          <div className="flex items-center gap-3 px-3 py-2 hover:bg-amber-50 rounded-md cursor-pointer transition-colors border border-transparent hover:border-amber-200">
                            {/* Product Image */}
                            <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-slate-100">
                              {product.images && product.images[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <Package className="h-5 w-5" />
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-slate-900 truncate">
                                  {product.title}
                                </h4>
                                {product.featured && (
                                  <Badge className="text-xs px-2 py-0 bg-amber-100 text-amber-800 border-amber-200">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-600">
                                <span>{product.material}</span>
                                <span>•</span>
                                <span>{product.colors?.length || 0} colors</span>
                                <span>•</span>
                                <span className={product.quantity > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                  {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
                                </span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-sm font-bold text-amber-800">
                                Rs. {product.price?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-slate-500">admin@hijabstore.com</p>
          </div>
          <div className="h-8 w-8 bg-amber-800 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
        </div>
      </div>
    </header>
  );
}
