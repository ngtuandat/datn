export interface SortOption {
  name: string;
  value: string;
}

export interface ProductProps {
  id?: string;
  category: string;
  name: string;
  desc: string;
  gender: string;
  image: string[];
  color: string[];
  price: number;
  size: number[];
}

export interface ListProduct {
  category: string;
  color: string[];
  description: string;
  id: string;
  listImage: string[];
  name: string;
  price: number;
  size: number[];
  createdAt?: string;
  gender: string;
  review: ListReview[];
}

export interface ListReview {
  content: string;
  createdAt: string;
  nameUser: string;
  rating: number;
}

export interface ProductValidator {
  name: string;
  desc: string;
  img: string;
  size: string;
  price: string;
}

export interface CommentReview {
  idProduct: string | string[] | undefined;
  rating: number | undefined;
  name: string;
  content: string;
}

export interface ProductBuy {
  idUser: string;
  id: string | undefined;
  name: string | undefined;
  size: number | undefined;
  price: number | undefined;
  color: string;
  quantity: number;
  image: string | undefined;
}

export interface RatingStarProps {
  star: number;
  total: number;
}

export interface listProductBuyProps {
  colorProd: string;
  idProd: string;
  imageProd: string;
  nameProd: string;
  priceProd: number;
  quantityProd: number;
  sizeProd: number;
  idProd: string;
  userId: string;
}

export interface IdProdCart {
  idProd: string;
  idUser: string;
}

export interface ChooseAddress {
  name: string | undefined;
  address: string;
  phone: number | undefined;
}

export interface ValidatorAddress {
  fullName: string;
  address: string;
  phoneNumber: number;
  city: string;
}

export interface PurchaseProps {
  colorProd: string;
  idProd: string;
  imageProd: string;
  nameProd: string;
  priceProd: number;
  quantityProd: number;
  sizeProd: number;
  id: string;
  userId: string;
  boughtAt: string;
  updatedAt: any;
}
