import React, { ReactElement, useEffect, useMemo, useState } from "react";
import MainClient from "../components/Layouts/MainClient";
import { CustomHeader } from "./../components/Header/CustomHeader";
import { GoPrimitiveDot } from "react-icons/go";
import Table from "../components/Table";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import {
  boughtProduct,
  deleteProdCart,
  getProductCart,
  plusQuantityCart,
} from "../services/product";
import {
  ChooseAddress,
  listProductBuyProps,
  ValidatorAddress,
} from "../interfaces/product";
import { RiDeleteBinLine } from "react-icons/ri";
import { BiMinus, BiPlus } from "react-icons/bi";
import { miniusQuantityCart } from "./../services/product/index";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { AiOutlineCheck, AiOutlineEdit } from "react-icons/ai";
import { getProfile } from "../services/user";
import { ProfileProps } from "../interfaces/user";
import { FaRegAddressCard } from "react-icons/fa";
import Modal from "../components/Modal";
import DropMenu from "../components/DropMenu";
import { BsCheck } from "react-icons/bs";
import { IoBagCheckOutline } from "react-icons/io5";
import LoadingPage from "../components/Loading/LoadingPage";

const tabs = ["Giỏ hàng", "Địa chỉ và thông tin", "Thanh toán"];
const column = ["Sản phẩm", "Giá", "Số lượng", "Tổng tiền", ""];
const payment = [
  {
    title: "Thanh toán khi nhận hàng",
    des: "Thanh toán bằng tiền mặt khi đơn đặt hàng của bạn được giao.",
  },
];
const listCity = [
  "Hà Nội",
  "TP.Hồ Chí Minh",
  "Nghệ An",
  "Đà Nẵng",
  "An Giang",
  "Bà rịa – Vũng tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bình Dương",
  "Hà Nam",
  "Hải Phòng",
  "Nam Định",
  "Quảng Ninh",
];

const Checkout = ({ loading }: { loading: Boolean }) => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [listProductBuy, setListProductBuy] = useState([]);
  const [listTabOver, setListTabOver] = useState<string[]>([]);
  const [countCard, setCountCard] = useState<number>();
  const [profileUser, setProfileUser] = useState<ProfileProps>();
  const [openModalAddress, setOpenModalAddress] = useState(false);
  const [openModalBought, setOpenModalBought] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<number>();
  const [fullName, setFullName] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [city, setCity] = useState<string>("");
  const [mailAddress, setMailAddress] = useState<ChooseAddress>();
  const [validatorMess, setValidatorMess] = useState<ValidatorAddress>();
  const [optionDelivery, setOptionDelivery] = useState<string>(
    "Giao hàng tiêu chuẩn (Miễn Phí)"
  );
  const [optionPayment, setOptionPayment] = useState<string>(
    "Thanh toán khi nhận hàng"
  );

  const token = Cookies.get("token");
  const shipFree = new Date();
  shipFree.setDate(shipFree.getDate() + 5);
  const dateShipFree = new Date(shipFree).toLocaleDateString("de");

  const shipFast = new Date();
  shipFast.setDate(shipFast.getDate() + 2);
  const dateshipFast = new Date(shipFast).toLocaleDateString("de");

  const shipping = [
    {
      title: "Giao hàng tiêu chuẩn (Miễn Phí)",
      date: `Giao hàng vào ${dateShipFree}`,
    },
    {
      title: "Giao hàng nhanh (30.000đ)",
      date: `Giao hàng vào ${dateshipFast}`,
    },
  ];

  const fetchCart = async (id: string) => {
    try {
      const res = await getProductCart(id);
      setListProductBuy(res.data.result);
      setCountCard(res.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProfile = async (email: string) => {
    try {
      const res = await getProfile(email);
      setProfileUser(res.data.profile);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMinus = async (
    idProd: string,
    idUser: string,
    quantity: number
  ) => {
    try {
      const productUpdate = { idProd, idUser };
      if (quantity >= 1) {
        const res = await miniusQuantityCart(productUpdate);
        if (res.status === 200 && token) {
          const decoded: any = jwt_decode(token);
          fetchCart(decoded.id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlus = async (idProd: string, idUser: string) => {
    try {
      const productUpdate = { idProd, idUser };
      const res = await plusQuantityCart(productUpdate);
      if (res.status === 200 && token) {
        const decoded: any = jwt_decode(token);
        fetchCart(decoded.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProdCart = async (idProd: string, idUser: string) => {
    try {
      const productDelete = { idProd, idUser };
      const res = await deleteProdCart(productDelete);
      if (res.status === 200 && token) {
        const decoded: any = jwt_decode(token);
        fetchCart(decoded.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNextTab = () => {
    const index = tabs.indexOf(currentTab);
    setCurrentTab(tabs[index + 1]);
    setListTabOver([...listTabOver, currentTab]);
  };

  const handlePrevTab = () => {
    const index = tabs.indexOf(currentTab);
    setCurrentTab(tabs[index - 1]);
    setListTabOver(listTabOver.filter((item) => item !== currentTab));
  };

  const handleEditAddress = () => {
    const index = tabs.indexOf(currentTab);
    const tabAddress = tabs.indexOf("Địa chỉ và thông tin");
    setCurrentTab(tabs[tabAddress]);
    setListTabOver(listTabOver.splice(-listTabOver.length, index - tabAddress));
  };

  const handleEditOrder = () => {
    const index = tabs.indexOf(currentTab);
    const tabOrder = tabs.indexOf("Giỏ hàng");
    setCurrentTab(tabs[tabOrder]);
    setListTabOver(listTabOver.splice(listTabOver.length, index - tabOrder));
  };

  const handleChooseAddress = () => {
    const chooseAddress = {
      name: profileUser?.firstName + " " + profileUser?.lastName,
      address: profileUser?.profile.address + "," + profileUser?.profile.city,
      phone: profileUser?.profile.phoneNumber,
    };
    setMailAddress(chooseAddress);
    const index = tabs.indexOf(currentTab);
    setCurrentTab(tabs[index + 1]);
    setListTabOver([...listTabOver, currentTab]);
  };

  const handleDeliveryOption = (option: string) => {
    setOptionDelivery(option);
  };

  const validatorFormAdress = () => {
    const mess: any = {};

    if (!fullName) {
      mess.fullName = "Thêm Tên";
    }

    if (!address) {
      mess.address = "Địa chỉ không thể thiếu";
    }

    if (!city || city === "Chọn thành phố") {
      mess.city = "Lựa chọn thành phố của bạn";
    }

    if (!phoneNumber) {
      mess.phoneNumber = "Thêm số điện thoại";
    }

    setValidatorMess(mess);
    if (Object.keys(mess).length > 0) return true;
    return false;
  };

  const handleChooseAddressOther = (tab: string) => {
    const valid = validatorFormAdress();

    if (!valid) {
      const chooseAddress = {
        name: fullName,
        address: address + ", " + city,
        phone: phoneNumber,
      };
      setMailAddress(chooseAddress);
      const index = tabs.indexOf(tab);
      setCurrentTab(tabs[index + 1]);
      setListTabOver([...listTabOver, tab]);
    }
  };

  const dataSourceCart = useMemo(() => {
    return listProductBuy.map((item: listProductBuyProps, idx) => {
      return [
        <div className="flex items-center space-x-2">
          <img
            className="w-16 h-16 rounded-lg"
            src={item?.imageProd}
            alt={item?.nameProd}
          />
          <div className="flex flex-col space-y-3">
            <span className="text-sm font-semibold">{item?.nameProd}</span>
            <div className="flex items-center space-x-2">
              <span className="space-x-1 text-[rgb(145,158,171)]">
                <span>size: </span>
                <span className="text-white p-1 bg-[rgba(145,158,171,0.16)] text-xs font-medium rounded-md">
                  {item?.sizeProd}
                </span>
              </span>
              <hr className="border h-4 border-[rgba(145,158,171,0.24)]" />
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item?.colorProd }}
              />
            </div>
          </div>
        </div>,
        <div>{item?.priceProd.toLocaleString("vi")} đ</div>,
        <div className="relative hover:border-white select-none flex items-center rounded-lg w-[78px] py-1 justify-around border border-[rgba(145,158,171,0.32)]">
          <button>
            <BiMinus
              onClick={() =>
                handleMinus(item?.idProd, item?.userId, item?.quantityProd)
              }
            />
          </button>
          {item?.quantityProd}
          <button>
            {" "}
            <BiPlus onClick={() => handlePlus(item?.idProd, item?.userId)} />
          </button>
        </div>,
        <div>
          {(item?.priceProd * item?.quantityProd).toLocaleString("vi")} đ
        </div>,
        <div
          onClick={() => handleDeleteProdCart(item?.idProd, item?.userId)}
          className="hover:bg-[rgba(145,158,171,0.08)] p-2 rounded-full text-base cursor-pointer"
        >
          <RiDeleteBinLine className="text-[rgb(145,158,171)]" />
        </div>,
      ];
    });
  }, [listProductBuy]);

  const handleBoughtProd = async () => {
    try {
      if (token) {
        const decoded: any = jwt_decode(token);
        await boughtProduct(String(decoded.id));
        setOpenModalBought(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      const decoded: any = jwt_decode(token);
      fetchCart(decoded.id);
      fetchProfile(decoded.email);
    }
  }, []);

  useEffect(() => {
    setValidatorMess(undefined);
  }, [openModalAddress]);

  return (
    <>
      {loading && <LoadingPage />}
      <CustomHeader title="Checkout">
        <title>Checkout | Cuc Shoes</title>
      </CustomHeader>
      <section className="pb-10">
        <div className="text-white grid grid-cols-12 mb-10">
          <div className="col-span-12 lg:col-span-8">
            <div className="flex items-center">
              {tabs.map((item, idx) => (
                <div className="flex-1 text-[rgb(145,158,171)]" key={idx}>
                  <div className="relative flex justify-center">
                    {idx !== 0 && (
                      <div className="absolute top-[6px] left-[calc(-50%_+_20px)] right-[calc(50%_+_20px)]">
                        <span
                          className={`border-t-2 block ${
                            listTabOver.includes(item) || currentTab === item
                              ? "border-green-500"
                              : "border-[rgba(145,158,171,0.24)]"
                          }`}
                        />
                      </div>
                    )}
                    <span className="flex flex-col items-center space-y-4">
                      <span
                        className={`${
                          currentTab === item || listTabOver.includes(item)
                            ? "text-green-500"
                            : ""
                        }`}
                      >
                        {listTabOver.includes(item) && currentTab !== item ? (
                          <AiOutlineCheck />
                        ) : (
                          <GoPrimitiveDot />
                        )}
                      </span>
                      <span
                        className={`text-xs md:text-sm font-semibold ${
                          currentTab === item || listTabOver.includes(item)
                            ? "text-white"
                            : ""
                        }`}
                      >
                        {item}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-4" />
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            {currentTab === tabs[0] && (
              <>
                <div className="bg-[rgb(33,43,54)] overflow-hidden rounded-xl">
                  <div className="p-6 pl-3">
                    <span className="text-white text-lg font-bold">
                      Giỏ hàng{" "}
                    </span>
                    <span className="text-[rgb(145,158,171)] text-sm">
                      ({countCard} sản phẩm)
                    </span>
                  </div>
                  {countCard === 0 ? (
                    <div className="flex flex-col space-y-3 items-center justify-center pb-5">
                      <img
                        className="w-5/12"
                        src="/images/svg/empty_cart.svg"
                        alt=""
                      />
                      <p className="text-xl font-bold text-white mt-2">
                        Giỏ hàng trống
                      </p>
                      <span className="text-sm text-[rgb(145,158,171)]">
                        Hãy thêm các sản phẩm bạn ưng ý vào đây nhé!
                      </span>
                    </div>
                  ) : (
                    <Table columns={column} dataSource={dataSourceCart} />
                  )}
                </div>
                <Link href="/product">
                  <p className="text-white flex items-center space-x-2 mt-8 pb-10">
                    <IoIosArrowBack />{" "}
                    <span className="font-bold text-sm">Tiếp Tục Mua Hàng</span>
                  </p>
                </Link>
              </>
            )}
            {currentTab === tabs[1] && (
              <div className="text-white">
                {profileUser?.profile.address && profileUser.profile.city ? (
                  <div className="bg-[rgb(33,43,54)] rounded-xl space-y-2  p-6">
                    <div className="flex items-center space-x-3">
                      <p className="font-semibold">
                        {profileUser?.firstName + " " + profileUser?.lastName}
                      </p>
                      <p className="text-xs px-2 py-1 text-[rgb(97,243,243)] bg-[rgba(0,184,217,0.16)] font-bold rounded-lg">
                        Mặc định
                      </p>
                    </div>
                    <p className="text-sm">
                      {profileUser?.profile.address +
                        ", " +
                        profileUser?.profile.city}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[rgb(145,158,171)]">
                        0{profileUser?.profile.phoneNumber}
                      </p>
                      <button
                        onClick={handleChooseAddress}
                        className="hover:bg-[rgba(0,171,85,0.08)] hover:border-[rgb(0,171,85)] text-sm font-bold text-[rgb(0,171,85)] rounded-lg border border-[rgba(0,171,85,0.5)] px-2 py-1"
                      >
                        Gửi đến địa chỉ này
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[rgb(33,43,54)] rounded-xl text-center py-8 space-y-3">
                    <p className="text-xl font-semibold">
                      Không tìm thấy địa chỉ của bạn
                    </p>
                    <p className="text-sm text text-[rgb(145,158,171)]">
                      Vui lòng{" "}
                      <Link
                        href="/user/profile"
                        className="text-green-500 underline"
                      >
                        cập nhật
                      </Link>{" "}
                      địa chỉ của bạn!
                    </p>
                  </div>
                )}
                <div className="mt-8 pb-10 flex items-center justify-between">
                  <div
                    onClick={handlePrevTab}
                    className="flex items-center space-x-2 "
                  >
                    <IoIosArrowBack />
                    <span className="font-bold text-sm cursor-pointer">
                      Quay lại
                    </span>
                  </div>
                  <button
                    onClick={() => setOpenModalAddress(true)}
                    className="flex items-center space-x-2 bg-[rgba(0,171,85,0.16)] hover:bg-[rgba(0,171,85,0.32)] px-2 py-1 mr-2 rounded-md text-[rgb(91,229,132)]"
                  >
                    <FaRegAddressCard />
                    <span className="font-bold text-sm">
                      Gửi đến địa chỉ khác
                    </span>
                  </button>
                  <Modal
                    open={openModalAddress}
                    setOpen={setOpenModalAddress}
                    title="Địa chỉ nhận hàng"
                  >
                    <div className="space-y-5">
                      <div className="grid-cols-2 grid gap-4">
                        <div className="relative flex flex-col">
                          <input
                            onChange={(e) => setFullName(e.target.value)}
                            id="full-name"
                            type="text"
                            className={`peer text-white bg-transparent border w-full px-2.5 py-3 rounded-lg focus:border-white hover:border-white border-color-primary`}
                          />
                          <label
                            className={`absolute text-base px-1 text-white peer-focus:-top-3 peer-focus:left-3 peer-focus:text-sm peer-focus:text-[rgb(99,115,129)] transition-all duration-300 bg-[rgb(22,28,36)] ${
                              fullName
                                ? "bg-[rgb(22,28,36)] text-[rgb(99,115,129)] left-3 text-sm -top-3"
                                : "top-3 left-4"
                            } cursor-text `}
                            htmlFor="full-name"
                          >
                            Tên đầy đủ
                          </label>
                          {validatorMess?.fullName && (
                            <i className="ml-1 text-xs text-red-500 mt-1">
                              {validatorMess?.fullName}
                            </i>
                          )}
                        </div>
                        <div className="relative flex flex-col">
                          <input
                            onChange={(e) =>
                              setPhoneNumber(e.target.valueAsNumber)
                            }
                            id="phone"
                            type="number"
                            className={`peer text-white bg-transparent border w-full px-2.5 py-3 rounded-lg focus:border-white hover:border-white border-color-primary `}
                          />
                          <label
                            className={`absolute text-base px-1 text-white peer-focus:-top-3 peer-focus:left-3 peer-focus:text-sm peer-focus:text-[rgb(99,115,129)] transition-all duration-300 bg-[rgb(22,28,36)] ${
                              phoneNumber
                                ? "bg-[rgb(22,28,36)] text-[rgb(99,115,129)] left-3 text-sm -top-3"
                                : "top-3 left-4"
                            } cursor-text `}
                            htmlFor="phone"
                          >
                            Số điện thoại
                          </label>
                          {validatorMess?.phoneNumber && (
                            <i className="ml-1 text-xs text-red-500 mt-1">
                              {validatorMess?.phoneNumber}
                            </i>
                          )}
                        </div>
                      </div>

                      <div className="relative">
                        <input
                          onChange={(e) => setAddress(e.target.value)}
                          id="address"
                          type="text"
                          className={`peer text-white bg-transparent border w-full px-2.5 py-3 rounded-lg focus:border-white hover:border-white border-color-primary`}
                        />
                        <label
                          className={`absolute text-base px-1 text-white peer-focus:-top-3 peer-focus:left-3 peer-focus:text-sm peer-focus:text-[rgb(99,115,129)] transition-all duration-300 bg-[rgb(22,28,36)] ${
                            address
                              ? "bg-[rgb(22,28,36)] text-[rgb(99,115,129)] left-3 text-sm -top-3"
                              : "top-3 left-4"
                          } cursor-text `}
                          htmlFor="address"
                        >
                          Đia chỉ nhận
                        </label>
                        {validatorMess?.address && (
                          <i className="ml-1 text-xs text-red-500 mt-1">
                            {validatorMess?.address}
                          </i>
                        )}
                      </div>
                      <div>
                        <DropMenu
                          listMenu={listCity}
                          selectValue={city ? city : "Chọn thành phố"}
                          setSelectValue={setCity}
                          classNameTitle="text-sm bg-[rgb(22,28,36)]"
                          classNameMenu="py-3.5"
                          classDrop="h-[140px] bottom-[130%]"
                          title="Thành phố"
                        />
                        {validatorMess?.city && (
                          <i className="ml-1 text-xs text-red-500 mt-1">
                            {validatorMess?.city}
                          </i>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end items-center mt-5 space-x-3">
                      <button
                        onClick={() => handleChooseAddressOther(currentTab)}
                        className="hover:bg-[rgba(0,171,85,0.08)] hover:border-[rgb(0,171,85)] text-sm font-bold text-[rgb(0,171,85)] rounded-lg border border-[rgba(0,171,85,0.5)] px-2 py-1"
                      >
                        Gửi đến địa chỉ này
                      </button>
                      <button
                        onClick={() => setOpenModalAddress(false)}
                        className="text-sm font-bold hover:border-white text-white rounded-lg border border-color-primary px-2 py-1"
                      >
                        Hủy bỏ
                      </button>
                    </div>
                  </Modal>
                </div>
              </div>
            )}
            {currentTab === tabs[2] && (
              <div className="text-white">
                <div className="bg-[rgb(33,43,54)] p-6 rounded-xl">
                  <p className="text-lg font-bold">Phương thức giao hàng</p>
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    {shipping.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleDeliveryOption(item?.title)}
                        className={`cursor-pointer flex items-center select-none space-x-6 p-5 border border-color-primary rounded-lg ${
                          optionDelivery === item?.title && "shadow-md"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 border border-[rgb(145,158,171)] flex items-center justify-center rounded-full ${
                            optionDelivery === item?.title &&
                            "bg-green-600 border-none"
                          }`}
                        >
                          <BsCheck className="text-[rgb(33,43,54)] text-lg" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item?.title}</p>
                          <span className="text-sm text-[rgb(145,158,171)]">
                            {item?.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="select-none bg-[rgb(33,43,54)] p-6 rounded-xl mt-6">
                  <p className="text-lg font-bold">Phương thức thanh toán</p>
                  <div className="mt-6">
                    {payment.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setOptionPayment(item?.title)}
                        className={`cursor-pointer flex items-center select-none space-x-6 p-5 border border-color-primary rounded-lg ${
                          optionDelivery === item?.title && "shadow-md"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 border border-[rgb(145,158,171)] flex items-center justify-center rounded-full ${
                            optionPayment === item?.title &&
                            "bg-green-600 border-none"
                          }`}
                        >
                          {optionPayment === item?.title && (
                            <BsCheck className="text-[rgb(33,43,54)] text-lg" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item?.title}</p>
                          <span className="text-sm text-[rgb(145,158,171)]">
                            {item?.des}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  onClick={handlePrevTab}
                  className="flex items-center space-x-2 mt-6"
                >
                  <IoIosArrowBack />
                  <span className="font-bold text-sm cursor-pointer">
                    Quay lại
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="col-span-12 lg:col-span-4 text-white">
            {currentTab === tabs[2] && (
              <div className="bg-[rgb(33,43,54)] rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">Địa Chỉ Nhận Hàng</p>
                  <div
                    onClick={handleEditAddress}
                    className="flex items-center space-x-2 text-green-500 font-bold cursor-pointer hover:bg-[rgba(0,171,85,0.08)] p-1 rounded-lg"
                  >
                    <AiOutlineEdit />
                    <p className="text-sm">Chỉnh sửa</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 mt-6 text-sm">
                  <span className="font-medium text-[15px]">
                    {mailAddress?.name}
                  </span>
                  <span>{mailAddress?.address}</span>
                  <span className="text-[rgb(145,158,171)]">
                    {mailAddress?.phone}
                  </span>
                </div>
              </div>
            )}
            <div className="bg-[rgb(33,43,54)] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">Tóm Tắt Đơn Hàng</p>
                {currentTab !== tabs[0] && (
                  <div
                    onClick={handleEditOrder}
                    className="flex items-center space-x-2 text-green-500 font-bold cursor-pointer hover:bg-[rgba(0,171,85,0.08)] p-1 rounded-lg"
                  >
                    <AiOutlineEdit />
                    <p className="text-sm">Chỉnh sửa</p>
                  </div>
                )}
              </div>
              <div className="mt-6 text-sm space-y-2 border-b border-[rgba(145,158,171,0.24)] pb-4">
                <p className="flex justify-between items-center">
                  <span className="text-[rgb(145,158,171)]">Tổng phụ thu</span>
                  <span className="font-semibold">
                    {listProductBuy
                      .reduce(
                        (acc, cur: listProductBuyProps) =>
                          acc + cur.priceProd * cur.quantityProd,
                        0
                      )
                      .toLocaleString("vi")}{" "}
                    đ
                  </span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-[rgb(145,158,171)]">Vận chuyển</span>{" "}
                  <span className="font-semibold">
                    {optionDelivery === "Giao hàng nhanh (30.000đ)"
                      ? "30.000 đ"
                      : "Miễn phí"}
                  </span>
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="font-bold">Tổng đơn hàng</p>
                <span className="font-semibold text-red-500">
                  {listProductBuy
                    .reduce(
                      (acc, cur: listProductBuyProps) =>
                        acc + cur.priceProd * cur.quantityProd,
                      optionDelivery === "Giao hàng nhanh (30.000đ)" ? 30000 : 0
                    )
                    .toLocaleString("vi")}{" "}
                  đ
                </span>
              </div>
            </div>
            {currentTab === tabs[0] && (
              <button
                onClick={handleNextTab}
                className={`${
                  countCard === 0
                    ? "text-[rgba(145,158,171,0.8)] cursor-default pointer-events-none select-none bg-[rgba(145,158,171,0.24)]"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }  w-full py-3 rounded-md font-semibold mt-4`}
              >
                Tiếp Tục
              </button>
            )}
            {currentTab === tabs[2] && (
              <button
                onClick={handleBoughtProd}
                className={`${
                  countCard === 0
                    ? "text-[rgba(145,158,171,0.8)] cursor-default pointer-events-none select-none bg-[rgba(145,158,171,0.24)]"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }  w-full py-3 rounded-md font-semibold mt-4`}
              >
                Đặt Hàng
              </button>
            )}
          </div>
          <Modal
            classClose="hidden"
            open={openModalBought}
            setOpen={setOpenModalBought}
          >
            <div className="flex flex-col justify-center items-center space-y-8 px-20">
              <p className="text-white text-xl font-bold">
                Cám ơn đã mua hàng!
              </p>
              <div className="relative">
                <img className="h-56" src="/images/svg/bought.svg" alt="" />
                <img
                  className="absolute top-10 right-12 h-36"
                  src="/images/buysucc.png"
                  alt=""
                />
              </div>
              <div className="flex items-center space-x-3 mt-3">
                <Link href="/product">
                  <p
                    onClick={() => setOpenModalBought(false)}
                    className="text-white hover:bg-[rgba(145,158,171,0.08)] flex items-center justify-center space-x-2 min-w-[162px] min-h-[38px] border border-color-primary px-1 py-2 rounded-md"
                  >
                    <IoIosArrowBack />{" "}
                    <span className="font-bold text-sm">Tiếp Tục Mua Hàng</span>
                  </p>
                </Link>
                <Link href="/user/purchase">
                  <p
                    onClick={() => setOpenModalBought(false)}
                    className="text-white hover:bg-green-700 flex items-center justify-center space-x-2 min-w-[162px] min-h-[38px] bg-green-600 px-1 py-2 rounded-md"
                  >
                    <IoBagCheckOutline />
                    <span className="font-bold text-sm">Đơn mua</span>
                  </p>
                </Link>
              </div>
            </div>
          </Modal>
        </div>
      </section>
    </>
  );
};
Checkout.getLayout = function getLayout(page: ReactElement) {
  return <MainClient>{page}</MainClient>;
};

export default Checkout;
