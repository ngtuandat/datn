import React from "react";
import { RiLuggageCartFill } from "react-icons/ri";
import Link from "next/link";

const BackHome = () => {
  return (
    <div className="bg-home-dark w-full h-screen fixed top-0 left-0">
      <div className="grid lg:grid-cols-12 h-screen lg:gap-24 relative max-w-sm lg:max-w-[1200px] mx-auto">
        <div className="-mt-[18%] lg:col-span-6 row-start-1 text-center flex flex-col justify-center items-center space-y-1 lg:space-y-5">
          <div>
            <h2 className="font-extrabold text-4xl lg:text-5xl leading-[1.33333] text-white">
              Start <br />
              shopping at
            </h2>
          </div>
          <div>
            <h1 className="text-6xl lg:text-7xl bg-text lg:-mt-1">
              FitFusionZone
            </h1>
          </div>
          <div>
            <p className="text-white text-sm my-1 mb-4 lg:mb-2 lg:my-2 leading-6 font-normal">
              Ở đây các bạn sẽ có được những sản phẩm đang nổi lên và yên tâm về
              giá thành và chất lượng sản phẩm!
            </p>
          </div>
          <div className="flex justify-start">
            <Link href="/product">
              <button className="flex items-center space-x-1 border border-white text-base font-bold px-5 py-3 text-white rounded-lg hover:bg-white hover:bg-opacity-5">
                <RiLuggageCartFill className="text-xl" />
                <p>Mua Hàng Ngay</p>
              </button>
            </Link>
          </div>
        </div>
        <div className="lg:col-span-6 hidden lg:block mt-[88px] absolute -right-[40%] overflow-hidden h-full ">
          <div className="flex">
            <div className="w-[344px] relative flex flex-col">
              <img
                className="absolute img-hero-top"
                src="./images/home/hero_dark_1.png"
                alt=""
              />
              <img
                className="absolute img-hero-bot"
                src="./images/home/hero_dark_1.png"
                alt=""
              />
            </div>
            <div className="w-[720px] relative flex flex-col">
              <img
                className="absolute img-hero-top-r"
                src="./images/home/hero_dark_2.png"
                alt=""
              />
              <img
                className="absolute img-hero-bot-r"
                src="./images/home/hero_dark_2.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackHome;
