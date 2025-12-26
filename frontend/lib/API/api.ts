import axios from "axios";
import { User } from "../types";

// Base API URL - use environment variable or fallback to localhost
// Remove trailing slash to avoid double slashes in URLs
const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return url.replace(/\/+$/, ""); // Remove trailing slashes
};

const API_BASE_URL = getBaseUrl();

export interface LoginProps {
  email: string;
  password: string;
}

export const Login = async ({
  email,
  password,
}: LoginProps): Promise<User | null> => {
  const res = await axios.post(
    `${API_BASE_URL}/auth/login`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );
  return res.data;
};
export interface RegisterProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: {
    house: string;
    zip: string;
    city: string;
  };
}

export const Register = async ({
  firstName,
  lastName,
  email,
  password,
  phone,
  address,
}: RegisterProps): Promise<User | null> => {
  console.log("Attempting to register user:", {
    firstName,
    lastName,
    email,
    phone,
    address,
  });
  try {
    const res = await axios.post(
      `${API_BASE_URL}/auth/register`,
      {
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
      },
      {
        withCredentials: true,
      }
    );
    console.log("Registration successful:", res.data);
    return res.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const MyProfile = async () => {
  const res = await axios.get(`${API_BASE_URL}/auth/myProfile`, {
    withCredentials: true,
  });
  return res.data;
};

export interface updateProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    house?: string;
    zip?: string;
    city?: string;
  };
}

export const UpdateProfile = async (profile: updateProfile) => {
  const res = await axios.patch(`${API_BASE_URL}/auth/updateProfile`, profile, {
    withCredentials: true,
  });
  return res.data;
};

export const Logout = async () => {
  const res = await axios.get(`${API_BASE_URL}/auth/logout`, {
    withCredentials: true,
  });
  return res.data;
};

export interface IAddAddress {
  house: string;
  city: string;
  zip: string;
  label: string;
  isDefault: boolean;
}

export const AddAddress = async (data: IAddAddress) => {
  const res = await axios.post(`${API_BASE_URL}/auth/addAddress`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const RemoveAddress = async (id: string) => {
  const res = await axios.delete(`${API_BASE_URL}/auth/address/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const UpdateAddress = async (id: string, data: IAddAddress) => {
  const res = await axios.put(`${API_BASE_URL}/auth/address/${id}`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await axios.post(`${API_BASE_URL}/auth/forgotPassword`, {
    email,
  });
  return res.data;
};

export const CreatePassword = async (email: string, password: string) => {
  const res = await axios.post(
    `${API_BASE_URL}/auth/create-password/${email}`,
    { password }
  );
  return res.data;
};

export interface IProduct {
  _id?: string;
  material: string;
  title: string;
  description: string;
  price: string;
  quantity: string;
  images: any;
  colors: {
    slice(arg0: number, arg1: number): unknown;
    color: string;
    quantity: number;
    sizes: string[];
  };
  sizes: string[];
  live: boolean;
  featured: boolean;
}

export const CreateProduct = async (formData: IProduct) => {
  const res = await axios.post(`${API_BASE_URL}/products/create`, formData, {
    withCredentials: true,
  });
  return res.data;
};

export const AllProducts = async (params?: {
  limit?: number;
  skip?: number;
  title?: string;
  sort?: string;
  filter?: string;
}) => {
  const res = await axios.get(`${API_BASE_URL}/products/all`, { params });
  return res.data;
};

export const DeleteProduct = async (id: string) => {
  const res = await axios.delete(`${API_BASE_URL}/products/delete/${id}`);
  return res.data;
};

export const GetProductById = async (id: string) => {
  const res = await axios.get(`${API_BASE_URL}/products/${id}`);
  return res.data;
};
export interface UProduct {
  _id?: string;
  material: string;
  title: string;
  description: string;
  price: string;
  quantity: string;
  images: any;
  colors: string[];
  sizes: string[];
  live: boolean;
  featured: boolean;
  oldImages: string[];
}

export const UpdateProduct = async (id: any, formData: UProduct) => {
  const res = await axios.put(
    `${API_BASE_URL}/products/update/${id.id}`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const getAllUsers = async (params?: {
  limit?: number;
  skip?: number;
  name?: string;
  filter?: string;
}) => {
  const res = await axios.get(`${API_BASE_URL}/users/all`, {
    params,
    withCredentials: true,
  });
  return res.data;
};

export const GetUserById = async (id: string) => {
  const res = await axios.get(`${API_BASE_URL}/users/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const DeleteUser = async (id: string) => {
  const res = await axios.delete(`${API_BASE_URL}/users/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const UpdateUserStatus = async (id: string, status: string) => {
  const res = await axios.patch(
    `${API_BASE_URL}/users/${id}/status`,
    { status },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const GetSettings = async () => {
  const res = await axios.get(`${API_BASE_URL}/settings`, {
    withCredentials: true,
  });
  return res.data;
};

export const CreateSettings = async (data: any) => {
  const res = await axios.post(`${API_BASE_URL}/settings`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const UpdateSettings = async (id: string, data: any) => {
  const res = await axios.put(`${API_BASE_URL}/settings/${id}`, data, {
    withCredentials: true,
  });
  return res.data;
};

export interface IAddToCart {
  productId: string;
  color: string;
  quantity: string | number;
  size: string;
}
export const AddToCart = async (data: IAddToCart) => {
  const res = await axios.post(`${API_BASE_URL}/cart`, data, {
    withCredentials: true,
  });
  return res.data;
};

export interface IUpdateCart {
  productId: string;
  color: string;
  quantity: string | number;
  size: string;
}
export const UpdateCart = async (data: IUpdateCart) => {
  const res = await axios.put(`${API_BASE_URL}/cart`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const GetCart = async () => {
  const res = await axios.get(`${API_BASE_URL}/cart`, {
    withCredentials: true,
  });
  return res.data;
};

export const RemoveFromCart = async (
  productId: string,
  color: string,
  size: string
) => {
  const res = await axios.delete(`${API_BASE_URL}/cart`, {
    withCredentials: true,
    data: {
      productId,
      color,
      size,
    },
  });
  return res.data;
};

export const createVoucher = async (data: any) => {
  const res = await axios.post(`${API_BASE_URL}/voucher/create`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const getAllVouchers = async (params?: {
  limit?: number;
  skip?: number;
  code?: string;
}) => {
  const res = await axios.get(`${API_BASE_URL}/voucher/all`, {
    params,
    withCredentials: true,
  });
  return res.data;
};

export const getVoucherById = async (id: string) => {
  const res = await axios.get(`${API_BASE_URL}/voucher/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const updateVoucher = async (id: string, data: any) => {
  const res = await axios.put(`${API_BASE_URL}/voucher/${id}`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const deleteVoucher = async (id: string) => {
  const res = await axios.delete(`${API_BASE_URL}/voucher/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const ApplyVoucher = async (voucherCode: string) => {
  const res = await axios.post(
    `${API_BASE_URL}/voucher/apply`,
    { voucherCode },
    { withCredentials: true }
  );
  return res.data;
};

export const RemoveVoucher = async () => {
  const res = await axios.post(`${API_BASE_URL}/voucher/remove`, undefined, {
    withCredentials: true,
  });
  return res.data;
};
