export interface UserBase {
  email: string;
}

export interface RegisterUser extends UserBase {
  fullName: string;
  password: string;
}

export interface LoginUser extends UserBase {
  password: string;
}

export interface Message {
  _id: string;
  role: string;
  parts: string;
}

export interface Project {
  deployedLink: string;
  imageUrl: string;
  name: string;
  description: string;
}
