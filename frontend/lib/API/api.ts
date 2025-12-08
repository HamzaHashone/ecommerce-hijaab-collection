import axios from "axios";
import { User } from "../types";

export interface LoginProps {
  email: string;
  password: string;
}

export const Login = async ({
  email,
  password,
}: LoginProps): Promise<User | null> => {
  const res = await axios.post(
    "http://localhost:5000/auth/login",
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
      "http://localhost:5000/auth/register",
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
  const res = await axios.get("http://localhost:5000/auth/myProfile", {
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
  const res = await axios.patch(
    "http://localhost:5000/auth/updateProfile",
    profile,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const Logout = async () => {
  const res = await axios.get("http://localhost:5000/auth/logout", {
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
  const res = await axios.post("http://localhost:5000/auth/addAddress", data, {
    withCredentials: true,
  });
  return res.data;
};

export const RemoveAddress = async (id: string) => {
  const res = await axios.delete(`http://localhost:5000/auth/address/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const UpdateAddress = async (id: string, data: IAddAddress) => {
  const res = await axios.put(
    `http://localhost:5000/auth/address/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await axios.post(`http://localhost:5000/auth/forgotPassword`, {
    email,
  });
  return res.data;
};

export const CreatePassword = async (email: string, password: string) => {
  const res = await axios.post(
    `http://localhost:5000/auth/create-password/${email}`,
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
  const res = await axios.post(
    "http://localhost:5000/products/create",
    formData,
    { withCredentials: true }
  );
  return res.data;
};

export const AllProducts = async (params?: {
  limit?: number;
  skip?: number;
  title?: string;
  sort?: string;
  filter?: string;
}) => {
  const res = await axios.get("http://localhost:5000/products/all", { params });
  return res.data;
};

export const DeleteProduct = async (id: string) => {
  const res = await axios.delete(`http://localhost:5000/products/delete/${id}`);
  return res.data;
};

export const GetProductById = async (id: string) => {
  const res = await axios.get(`http://localhost:5000/products/${id}`);
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
    `http://localhost:5000/products/update/${id.id}`,
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
  const res = await axios.get(`http://localhost:5000/users/all`, {
    params,
    withCredentials: true,
  });
  return res.data;
};

export const GetUserById = async (id: string) => {
  const res = await axios.get(`http://localhost:5000/users/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const DeleteUser = async (id: string) => {
  const res = await axios.delete(`http://localhost:5000/users/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const UpdateUserStatus = async (id: string, status: string) => {
  const res = await axios.patch(
    `http://localhost:5000/users/${id}/status`,
    { status },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const GetSettings = async () => {
  const res = await axios.get(`http://localhost:5000/settings`, {
    withCredentials: true,
  });
  return res.data;
};

export const CreateSettings = async (data: any) => {
  const res = await axios.post(`http://localhost:5000/settings`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const UpdateSettings = async (id: string, data: any) => {
  const res = await axios.put(`http://localhost:5000/settings/${id}`, data, {
    withCredentials: true,
  });
  return res.data;
};

export interface IAddToCart {
  productId: string;
  color: string;
  quantity: string;
  size: string;
}
export const AddToCart = async (data: IAddToCart) => {
  const res = await axios.post(
    `http://localhost:5000/addToCart`,
    data,
    {
      withCredentials: true,
    }
  );
  return res.data;
};


