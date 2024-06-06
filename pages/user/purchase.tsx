import Cookies from "js-cookie";
import React, { ReactElement, useEffect, useState } from "react";
import { CustomHeader } from "../../components/Header/CustomHeader";
import MainClient from "../../components/Layouts/MainClient";
import { deletePurchase, getPurchaseOrder } from "../../services/product";
import jwt_decode from "jwt-decode";
import { PurchaseProps } from "../../interfaces/product";
import { BsTruck } from "react-icons/bs";
import { MdOutlineDeleteSweep } from "react-icons/md";
import LoadingPage from "../../components/Loading/LoadingPage";

const Purchase = ({ loading }: { loading: Boolean }) => {
  const [listPurchase, setListPurchase] = useState<PurchaseProps[]>();

  const token = Cookies.get("token");

  const fetchPurchase = async (id: string) => {
    try {
      const res = await getPurchaseOrder(id);
      setListPurchase(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePurchase = async (id: string) => {
    try {
      const res = await deletePurchase(id);
      if (res.status === 200 && token) {
        const decoded: any = jwt_decode(token);
        fetchPurchase(decoded.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      const decoded: any = jwt_decode(token);
      fetchPurchase(decoded.id);
    }
  }, [token]);

  return (
    <div>
      {loading && <LoadingPage />}
      <CustomHeader title="Đơn mua">
        <title>Đơn mua | Cuc Shoes</title>
      </CustomHeader>
      <div className="w-full lg:w-2/3 mx-auto pb-8">
        {listPurchase && listPurchase?.length > 0 ? (
          <div>
            {listPurchase?.map((item, idx) => (
              <div
                className="bg-[rgb(33,43,54)] rounded-xl mb-4 last:mb-0 p-6 "
                key={idx}
              >
                <div className="mb-3 flex items-center justify-end space-x-2 text-green-500 text-sm">
                  <BsTruck /> <p>Đơn hàng đang giao</p>
                </div>
                <div className="flex flex-col lg:flex-row items-start justify-between">
                  <div className="flex items-start space-x-5 lg:w-fit">
                    <img
                      className="w-20 h-20 object-cover rounded-md border border-dashed border-color-primary"
                      src={item?.imageProd}
                      alt={item?.nameProd}
                    />
                    <div className="text-white">
                      <p className="text-base lg:text-xl font-bold">
                        {item?.nameProd}
                      </p>
                      <p className="text-sm text-[rgb(145,158,171)]">
                        Size: {item?.sizeProd}
                      </p>
                      <p className="text-sm text-[rgb(145,158,171)] flex items-center">
                        Màu sắc:{" "}
                        <span
                          className="ml-2 w-4 h-4 rounded-full block"
                          style={{ backgroundColor: item?.colorProd }}
                        />
                      </p>
                      <p className="text-sm font-semibold">
                        x{item?.quantityProd}
                      </p>
                    </div>
                  </div>
                  <div className="flex lg:flex-col lg:w-fit w-full mt-5 lg:mt-0 justify-between items-center lg:items-end lg:space-y-5">
                    <div className="flex items-center space-x-2 text-white">
                      <p className="text-sm font-semibold">Thành tiền:</p>
                      <p className="text-sm text-red-500 font-semibold">
                        {(item?.quantityProd * item?.priceProd).toLocaleString(
                          "vi"
                        )}{" "}
                        đ
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePurchase(item?.id)}
                      className="text-white hover:bg-red-700 hover:bg-opacity-10 max-w-[140px] flex items-center justify-center space-x-2 border border-color-primary px-1 py-2 rounded-md"
                    >
                      <span className="font-bold text-sm flex items-center space-x-1">
                        <MdOutlineDeleteSweep /> <p>Hủy đơn</p>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="flex text-white w-full justify-center items-center text-xl sm:text-2xl font-bold py-40 opacity-50">
              Bạn chưa từng mua đơn hàng nào!!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

Purchase.getLayout = function getLayout(page: ReactElement) {
  return <MainClient>{page}</MainClient>;
};

export default Purchase;
