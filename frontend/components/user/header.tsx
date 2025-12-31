"use client";

import Link from "next/link";
import { ShoppingBag, Search, User, Menu, Loader, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cart } from "@/lib/cart";
import { useState, useEffect, useRef } from "react";
import { useGetAllProducts, useMyProfile } from "@/lib/hooks/api";
import useStore from "../store/store";

export function Header() {
  const { loggedIn } = useStore();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { data: products } = useGetAllProducts({ title: search });
  const filteredProducts = products?.products;

  useEffect(() => {
    cart.loadFromStorage();
    setCartItemCount(cart.getTotalItems());
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm text-muted-foreground">
          <p>Free shipping on orders over $50</p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-foreground">
              Contact Us
            </Link>
            <Link href="/user/login" className="hover:text-foreground">
              Sign In
            </Link>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-amber-800">
            Hijab Collection
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-amber-800 transition-colors">
              Home
            </Link>
            <Link
              href="/products"
              className="hover:text-amber-800 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="hover:text-amber-800 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="hover:text-amber-800 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center gap-4 relative">
            <div
              ref={searchRef}
              className="hidden md:flex items-center gap-2 relative"
            >
              <div className="relative">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search hijabs..."
                  className="w-64 pr-8"
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
            </div>
            {search !== "" && isSearchFocused && (
              <div className="absolute top-12 left-0 w-80 bg-white shadow-lg rounded-lg border border-slate-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
                {filteredProducts?.length > 0 ? (
                  <>
                    <div className="p-2 bg-slate-50 border-b border-slate-200">
                      <p className="text-xs font-semibold text-slate-600">
                        {filteredProducts.length}{" "}
                        {filteredProducts.length === 1 ? "result" : "results"}{" "}
                        found
                      </p>
                    </div>
                    <div className="py-2">
                      {filteredProducts.map((product: any) => (
                        <Link
                          href={`/products/${product.title}`}
                          key={product._id}
                          onClick={() => {
                            setSearch("");
                            setIsSearchFocused(false);
                          }}
                        >
                          <div className="flex items-center gap-3 px-3 py-2 hover:bg-amber-50 transition-colors cursor-pointer">
                            {/* Product Image */}
                            <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-slate-100">
                              {product.images && product.images[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <ShoppingBag className="h-6 w-6" />
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-slate-900 truncate">
                                {product.title}
                              </h4>
                              <p className="text-xs text-slate-500 truncate mt-0.5">
                                {product.material || "Premium Quality"}
                              </p>
                              <p className="text-sm font-semibold text-amber-800 mt-1">
                                Rs. {product.price?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="p-2 bg-slate-50 border-t border-slate-200">
                      <Link
                        href="/products"
                        onClick={() => {
                          setSearch("");
                          setIsSearchFocused(false);
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-amber-800 hover:text-amber-900 hover:bg-amber-50"
                        >
                          View all products →
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-900 mb-1">
                      No products found
                    </p>
                    <p className="text-xs text-slate-500">
                      Try searching with different keywords
                    </p>
                  </div>
                )}
              </div>
            )}

            <Button
              className="w-max hover:bg-transparent cursor-pointer"
              size="icon"
              variant="ghost"
            >
              {loggedIn !== "" ? (
                <Link href="/user/account">
                  <div className="w-max">
                    <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {loggedIn.charAt(0)?.toUpperCase()}
                    </div>
                  </div>
                </Link>
              ) : (
                <Link href="/user/login">
                  <User className="h-4 w-4" />
                </Link>
              )}
            </Button>

            <Link href="/cart" className="relative">
              <Button size="icon" variant="ghost">
                <ShoppingBag className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button size="icon" variant="ghost">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" className="text-lg hover:text-amber-800">
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className="text-lg hover:text-amber-800"
                  >
                    Products
                  </Link>
                  <Link href="/about" className="text-lg hover:text-amber-800">
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    className="text-lg hover:text-amber-800"
                  >
                    Contact
                  </Link>
                  <div className="mt-4">
                    <Input
                      placeholder="Search hijabs..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                    />
                    {search !== "" && isSearchFocused && (
                      <div className="mt-2 w-full bg-white shadow-lg rounded-lg border border-slate-200 overflow-hidden max-h-96 overflow-y-auto">
                        {filteredProducts?.length > 0 ? (
                          <>
                            <div className="p-2 bg-slate-50 border-b border-slate-200">
                              <p className="text-xs font-semibold text-slate-600">
                                {filteredProducts.length}{" "}
                                {filteredProducts.length === 1
                                  ? "result"
                                  : "results"}{" "}
                                found
                              </p>
                            </div>
                            <div className="py-2">
                              {filteredProducts.map((product: any) => (
                                <Link
                                  href={`/products/${product.title}`}
                                  key={product._id}
                                  onClick={() => {
                                    setSearch("");
                                    setIsSearchFocused(false);
                                  }}
                                >
                                  <div className="flex items-center gap-3 px-3 py-2 hover:bg-amber-50 transition-colors cursor-pointer">
                                    {/* Product Image */}
                                    <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-slate-100">
                                      {product.images && product.images[0] ? (
                                        <img
                                          src={product.images[0]}
                                          alt={product.title}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                          <ShoppingBag className="h-6 w-6" />
                                        </div>
                                      )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-sm font-medium text-slate-900 truncate">
                                        {product.title}
                                      </h4>
                                      <p className="text-xs text-slate-500 truncate mt-0.5">
                                        {product.material || "Premium Quality"}
                                      </p>
                                      <p className="text-sm font-semibold text-amber-800 mt-1">
                                        Rs. {product.price?.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="p-2 bg-slate-50 border-t border-slate-200">
                              <Link
                                href="/products"
                                onClick={() => {
                                  setSearch("");
                                  setIsSearchFocused(false);
                                }}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full text-amber-800 hover:text-amber-900 hover:bg-amber-50"
                                >
                                  View all products →
                                </Button>
                              </Link>
                            </div>
                          </>
                        ) : (
                          <div className="p-8 text-center">
                            <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm font-medium text-slate-900 mb-1">
                              No products found
                            </p>
                            <p className="text-xs text-slate-500">
                              Try searching with different keywords
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
