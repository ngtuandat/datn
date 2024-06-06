import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Cookies from "js-cookie";

const Cart = () => {
  const token = Cookies.get("token");
  const [countProd, setCountProd] = useState(0);
  useEffect(() => {
    if (sessionStorage.getItem("count")) {
      setCountProd(Number(sessionStorage.getItem("count")));
    } else {
      setCountProd(0);
    }
  }, []);
  return (
    <Link href="/checkout">
      <div className="bg-[rgb(33,43,54)] z-[2100] cursor-pointer text-white pl-4 pr-6 pt-4 pb-2 fixed top-40 right-0 rounded-l-md shadow-sm">
        <FaShoppingCart />
        <span className="bg-red-500 absolute top-1 right-3 text-xs rounded-full px-1.5">
          {countProd}
        </span>
      </div>
    </Link>
  );
};

export default Cart;
