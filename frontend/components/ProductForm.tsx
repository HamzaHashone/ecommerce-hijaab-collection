"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SignalZero, Trash, Upload, X } from "lucide-react";
import { useCreateProduct, useUpdateProduct } from "@/lib/hooks/api";
import { toast } from "sonner";
import { IProduct } from "@/lib/API/api";

interface ISize {
  size: string;
  quantity: string;
}

export default function ProductForm({ product }: { product?: any }) {
  const id = useParams();
  console.log(id);
  const productSchema = z
    .object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      price: z.string().min(1, "Price is required"),
      quantity: z.string().min(1, "Quantity is required"),
      material: z.string().min(1, "Material is required"),
      featured: z.boolean(),
      colors: z.array(z.any()).min(1, "At least one color is required"),
      // sizes: z.array(z.string()).min(1, "At least one size is required"),
      // images: z.array(z.file()).min(1, "At least one image is required"),
      images: z
        .array(z.instanceof(File)) // use z.instanceof(File) if in browser
        .optional(),
    })
    .refine(
      (data) => {
        return data?.images || oldImages.length > 0;
      },
      { message: "You Must Keep Atleast One Image", path: ["images"] }
    );
  type ProductFormValues = z.infer<typeof productSchema>;

  const router = useRouter();

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const [newColor, setNewColor] = useState("");
  // const [colors, setColors] = useState([{}]);
  const [newQuantity, setNewQuantity] = useState(0);
  const [newSize, setNewSize] = useState("");
  const [sizes, setSizes] = useState<ISize[]>([]);
  const [oldImages, setOldImages] = useState([""]);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "0",
      quantity: "0",
      material: "",
      featured: false,
      colors: [],
      // sizes: [],
      images: [],
    },
  });

  useEffect(() => {
    if (product?.product) {
      form.reset({
        title: product.product.title,
        description: product.product.description,
        price: product.product.price?.toString() || "0",
        quantity: product.product.quantity?.toString() || "0",
        material: product.product.material,
        featured: product.product.featured,
        colors: product.product.colors,
        // sizes: product.product.sizes,
        images: [],
      });
      setOldImages(product?.product?.images);
    }
  }, [product, form]);

  const addColor = () => {
    const colors = form.getValues("colors");
    if (newColor === "" || sizes.length < 1) {
      toast.error("Fill all the require details of color");
      return;
    }
    if (!colors.some(c => c.color === newColor)) {
      form.setValue("colors", [
        ...colors,
        { color: newColor, sizes },
      ]);
      setNewColor("");
      setSizes([]);
      setNewQuantity(0 as any);
      setNewSize("");
    }
  };

  const removeColor = (color: string) => {
    const colors = form.getValues("colors");
    form.setValue(
      "colors",
      colors.filter((c) => c !== color)
    );
  };

  const addSize = () => {
    if (newSize && !sizes.some((size) => size.size === newSize)) {
      setSizes([...sizes, { size: newSize, quantity: newQuantity.toString() }]);
      setNewSize("");
      setNewQuantity(0);
    }
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter((s) => s.size !== size));
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      // Images
      data.images.forEach((file: File) => formData.append("images", file));

      // Primitive fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());

      // Calculate total quantity from all colors and sizes
      const totalQuantity = data?.colors?.reduce((total: number, color: any) => {
        const colorTotal = color?.sizes?.reduce((sizeTotal: number, size: any) => {
          return sizeTotal + (parseInt(size.quantity) || 0);
        }, 0) || 0;
        return total + colorTotal;
      }, 0) || 0;

      formData.append("quantity", totalQuantity.toString());
      formData.append("material", data.material);
      formData.append("featured", data.featured.toString());
      formData.append("live", "true");

      // Arrays as JSON
      formData.append("colors", JSON.stringify(data.colors));
      // formData.append("sizes", JSON.stringify(data.sizes));

      if (product) {
        formData.append("oldImages", JSON.stringify(oldImages));
        updateProduct(
          //@ts-ignore
          { id, formData },
          {
            onSuccess: () => {
              toast.success("Product Updated Successfully");
              router.push("/admin/products");
            },
            onError: (err: any) => {
              toast.error(
                err?.response?.data?.message || "Failed To Update Product"
              );
            },
          }
        );
      } else {
        createProduct(
          //@ts-ignore
          { formData: formData },
          {
            onSuccess: () => {
              toast.success("Product Created Successfully");
              router.push("/admin/products");
            },
            onError: (err: any) => {
              toast.error(
                err?.response?.data?.message || "Failed To Create Product"
              );
            },
          }
        );
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed To Create Product");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Controller
                  control={form.control}
                  name="title"
                  render={({ field, fieldState }) => (
                    <div>
                      <Label htmlFor="title">Product Name</Label>
                      <Input
                        {...field}
                        id="title"
                        placeholder="Premium Silk Hijab"
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        {...field}
                        id="description"
                        rows={4}
                        placeholder="Describe your product..."
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="price"
                    render={({ field, fieldState }) => (
                      <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          {...field}
                          id="price"
                          type="number"
                          step="0.01"
                        />
                        {fieldState.error && (
                          <p className="text-red-500 text-sm mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  {/* <Controller
                    control={form.control}
                    name="quantity"
                    render={({ field, fieldState }) => (
                      <div>
                        <Label htmlFor="quantity">Stock Quantity</Label>
                        <Input {...field} id="quantity" type="number" />
                        {fieldState.error && (
                          <p className="text-red-500 text-sm mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  /> */}
                </div>

                <Controller
                  control={form.control}
                  name="material"
                  render={({ field, fieldState }) => (
                    <div>
                      <Label htmlFor="material">Material</Label>
                      <Select
                        {...field}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Premium-Silk">
                            Premium Silk
                          </SelectItem>
                          <SelectItem value="Cotton-Jersey">
                            Cotton Jersey
                          </SelectItem>
                          <SelectItem value="Chiffon">Chiffon</SelectItem>
                          <SelectItem value="Modal Blend">
                            Modal Blend
                          </SelectItem>
                          <SelectItem value="Georgette">Georgette</SelectItem>
                          <SelectItem value="Bamboo-Fiber">
                            Bamboo Fiber
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  control={form.control}
                  name="images"
                  render={({ field, fieldState }) => (
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                      <label
                        htmlFor="fileInput"
                        className="cursor-pointer px-4 py-2"
                      >
                        <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 mb-2">
                          Drag and drop images here, or click to browse
                        </p>
                        <p className="text-sm text-slate-500">
                          PNG, JPG up to 10MB each
                        </p>
                      </label>
                      <Input
                        className="hidden"
                        id="fileInput"
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg,.webp"
                        onChange={(e) => {
                          if (e.target.files) {
                            const filesArray = Array.from(e.target.files);
                            const allowedTypes = [
                              "image/png",
                              "image/jpeg",
                              "image/webp",
                            ];
                            const filteredFiles = filesArray.filter((file) =>
                              allowedTypes.includes(file.type)
                            );
                            field.onChange([
                              ...(field.value as File[]),
                              ...filteredFiles,
                            ]);
                          }
                        }}
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                      <div className="mt-5 flex items-center gap-2 flex-wrap">
                        {field?.value?.map((img: File, i: number) => (
                          <div
                            key={i}
                            className="relative border-2 border-dashed border-gray-600 p-2"
                          >
                            <Image
                              src={URL.createObjectURL(img)}
                              alt={img.name}
                              width={100}
                              height={100}
                              className="w-16 h-16 object-cover"
                            />
                            <span
                              onClick={() => {
                                const newFiles = field?.value?.filter(
                                  (file: File) => file.name !== img.name
                                );
                                field.onChange(newFiles);
                              }}
                              className="p-2 hover:cursor-pointer text-white bg-black/80 rounded-full absolute top-2 right-2 z-10"
                            >
                              <Trash className="text-white w-3 h-3" />
                            </span>
                          </div>
                        ))}
                      </div>
                      {oldImages.length > 0 && (
                        <div className="mt-2">
                          <h3 className="font-bold italic underline">
                            Old Images:
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            {oldImages.map((oldimg, i) => {
                              console.log(oldimg, "old image");
                              return (
                                <div
                                  key={i}
                                  className="relative w-max border-2 border-gray-300 p-2 border-dashed"
                                >
                                  <Image
                                    key={i}
                                    src={
                                      `${oldimg}` ||
                                      "data:image/png;base64,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"
                                    }
                                    alt={oldimg}
                                    width={100}
                                    height={100}
                                    className="h-16 w-16 object-cover "
                                  />
                                  <Trash
                                    onClick={() =>
                                      setOldImages((prev) =>
                                        prev.filter((img) => img !== oldimg)
                                      )
                                    }
                                    className="text-red-500 h-4 w-4 absolute top-2 right-2"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured */}
            <Card>
              <CardHeader>
                <CardTitle>Product Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Controller
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        name={field.name}
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                      {/* id="featured"
                      /> */}
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                  )}
                />
              </CardContent>
            </Card>

            {/* Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Available Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Add color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addColor())
                    }
                  />
                  <Input
                    defaultValue={1}
                    value={newQuantity}
                    type="number"
                    placeholder="Add quantity"
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === "-") {
                        e.preventDefault();
                      }
                    }}
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add sizes"
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addSize())
                        }
                      />
                      <Button type="button" onClick={addSize} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sizes &&
                        sizes.map((size, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"
                          >
                            <span className="text-sm">
                              {size.size} ({size.quantity})
                            </span>
                            <button
                              type="button"
                              onClick={() => removeSize(size.size as string)}
                              className="text-slate-500 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                  <Button type="button" onClick={addColor} size="sm">
                    Add Color
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.watch("colors")?.map((color) => (
                    <div
                      key={color.color}
                      className="pt-4 relative flex flex-col items-start justify-center gap-1 bg-slate-100 px-2 py-1 rounded"
                    >
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="absolute right-1 top-1 text-slate-500 hover:text-red-600 z-10"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="flex gap-1 items-center">
                        <span className="capitalize text-sm font-bold">
                          {color.color}:
                        </span>
                        <div className="capitalize text-xs">
                          {color.sizes.map((size: ISize, i: number) => (
                            <span className="mr-1" key={size.size}>
                              {size.size} ({size.quantity})
                              <span
                                className={`${
                                  i === color.sizes.length - 1 ? "hidden" : ""
                                }`}
                              >
                                ,
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {form.formState.errors.colors && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.colors.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Sizes */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Available Sizes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add size"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSize())
                    }
                  />
                  <Button type="button" onClick={addSize} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.watch("sizes")?.map((size) => (
                    <div
                      key={size}
                      className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"
                    >
                      <span className="text-sm">{size}</span>
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="text-slate-500 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {form.formState.errors.sizes && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.sizes.message}
                  </p>
                )}
              </CardContent>
            </Card> */}

            {/* Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {!product ? (
                    <Button
                      type="submit"
                      className="w-full bg-amber-800 hover:bg-amber-900"
                      disabled={isCreating}
                    >
                      {isCreating ? "Creating..." : "Create Product"}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full bg-amber-800 hover:bg-amber-900"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Update Product"}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
