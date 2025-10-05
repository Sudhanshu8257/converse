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

interface FaqItem {
  question: string;
  answer: string;
  _id: string;
}

interface FeatureItem {
  title: string;
  description: string;
  icon: string;
  colspan: number;
  _id: string;
}

interface TestimonialItem {
  message: string;
  author: string;
  role: string;
  avatar: string;
  _id: string;
}

export interface Personality {
  _id: string;
  fullName: string;
  type: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  heroTitle: string;
  heroDescription: string;
  faq: FaqItem[];
  fee: number;
  cutFee: number;
  featured: boolean;
  features: FeatureItem[];
  createdAt: string; 
  updatedAt: string;
  __v: number;
  testimonials: TestimonialItem[];
  imgUrl: string;
}
