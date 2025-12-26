import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AddAddress,
  AllProducts,
  CreateSettings,
  CreatePassword,
  CreateProduct,
  DeleteProduct,
  DeleteUser,
  forgotPassword,
  getAllUsers,
  GetProductById,
  GetSettings,
  GetUserById,
  IAddAddress,
  IProduct,
  Login,
  LoginProps,
  Logout,
  MyProfile,
  Register,
  RegisterProps,
  RemoveAddress,
  UpdateAddress,
  UpdateProduct,
  updateProfile,
  UpdateProfile,
  UpdateUserStatus,
  UProduct,
  UpdateSettings,
  AddToCart,
  IAddToCart,
  GetCart,
  IUpdateCart,
  UpdateCart,
  RemoveFromCart,
  getAllVouchers,
  createVoucher,
  updateVoucher,
  getVoucherById,
  deleteVoucher,
  RemoveVoucher,
  ApplyVoucher,
} from "../API/api";

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: LoginProps) => Login({ email, password }),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: ({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
    }: RegisterProps) =>
      Register({ firstName, lastName, email, password, phone, address }),
  });
};

export const useMyProfile = () => {
  return useQuery({
    queryKey: ["MyProfile"],
    queryFn: MyProfile,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: updateProfile) => UpdateProfile(data),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: Logout,
  });
};

export const useAddAddress = () => {
  return useMutation({
    mutationFn: (data: IAddAddress) => AddAddress(data),
  });
};

export const useDeleteAddress = () => {
  return useMutation({
    mutationFn: (id: string) => RemoveAddress(id),
  });
};

export const useUpdateAddress = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IAddAddress }) =>
      UpdateAddress(id, data),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: ({ data }: { data: string }) => forgotPassword(data),
  });
};

export const useCreatePassword = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      CreatePassword(email, password),
  });
};

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: ({ formData }: { formData: IProduct }) =>
      CreateProduct(formData),
  });
};

export const useGetAllProducts = (params?: {
  limit?: number;
  skip?: number;
  sort?: string;
  filter?: string;
  title?: string;
}) => {
  return useQuery({
    queryKey: ["getAllProducts", params],
    queryFn: () => AllProducts(params),
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: (id: string) => DeleteProduct(id),
  });
};

export const useGetProductById = (id: string) => {
  return useQuery({
    queryKey: ["getProductById", id],
    queryFn: () => GetProductById(id),
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: UProduct }) =>
      UpdateProduct(id, formData),
  });
};

export const useGetAllUsers = (params?: {
  limit?: number;
  skip?: number;
  name?: string;
  filter?: string;
}) => {
  return useQuery({
    queryKey: ["getAllUsers", params],
    queryFn: () => getAllUsers(params),
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["getSingleUser"],
    queryFn: () => GetUserById(id as string),
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (id: string) => DeleteUser(id),
  });
};

export const useUpdateUserStatus = () => {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      UpdateUserStatus(id, status),
  });
};

export const useGetSettings = () => {
  return useQuery({
    queryKey: ["getSettings"],
    queryFn: GetSettings,
  });
};

export const useCreateSettings = () => {
  return useMutation({
    mutationFn: (data: any) => CreateSettings(data),
  });
};

export const useUpdateSettings = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      UpdateSettings(id, data),
  });
};

export const useAddToCart = () => {
  return useMutation({
    mutationFn: (data: IAddToCart) => AddToCart(data),
  });
};

export const useUpdateCart = () => {
  return useMutation({
    mutationFn: (data: IUpdateCart) => UpdateCart(data),
  });
};

export const useGetCart = () => {
  return useQuery({
    queryKey: ["getCart"],
    queryFn: GetCart,
  });
};

export const useRemoveFromCart = () => {
  return useMutation({
    mutationFn: ({ productId, color, size }: { productId: string; color: string; size: string }) =>
      RemoveFromCart(productId, color, size),
  });
};

export const useCreateVoucher = () => {
  return useMutation({
    mutationFn: (data: any) => createVoucher(data),
  });
};

export const useGetAllVouchers = (params?: {
  limit?: number;
  skip?: number;
  code?: string;
}) => {
  return useQuery({
    queryKey: ["getAllVouchers", params],
    queryFn: () => getAllVouchers(params),
  });
};

export const useGetVoucherById = (id: string) => {
  return useQuery({
    queryKey: ["getVoucherById", id],
    queryFn: () => getVoucherById(id),
  });
};

export const useUpdateVoucher = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateVoucher(id, data),
  });
};

export const useDeleteVoucher = () => {
  return useMutation({
    mutationFn: (id: string) => deleteVoucher(id),
  });
};

export const useApplyVoucher = () => {
  return useMutation({
    mutationFn: (voucherCode: string) => ApplyVoucher(voucherCode),
  });
};

export const useRemoveVoucher = () => {
  return useMutation({
    mutationFn: () => RemoveVoucher(),
  });
};