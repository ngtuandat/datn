import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import { CustomHeader } from "../../components/Header/CustomHeader";
import MainAdmin from "../../components/Layouts/MainAdmin";
import LoadingPage from "../../components/Loading/LoadingPage";
import Analysis from "../../containers/Charts/Analysis";
import Area from "../../containers/Charts/Area";
import MultipleRadialbars from "../../containers/Charts/MultipleRadialbars";
import { getPurchaseAll } from "../../services/product";
import { PurchaseProps } from "../../interfaces/product";

const Dashboard = ({ loading }: { loading: Boolean }) => {
  const [countProd, setCountProd] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const fetchAllPurchase = async () => {
    try {
      const res = await getPurchaseAll();
      console.log("res", res);
      setCountProd(res.data.result.length);
      setTotalPrice(
        res.data.result.reduce(
          (acc: number, cur: PurchaseProps) =>
            acc + cur.priceProd * cur.quantityProd,
          0
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllPurchase();
  }, []);
  return (
    <div className="text-white">
      {loading && <LoadingPage />}
      <CustomHeader>
        <title>DashBoard</title>
      </CustomHeader>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
        <Analysis
          name="Sản phẩm được bán"
          parameter={countProd}
          color="rgb(0,170,85)"
          percent="+2.6%"
        />
        <Analysis
          name="Tổng số dư"
          parameter={totalPrice}
          color="rgb(0,184,217)"
          percent="-0.1%"
        />
        <Analysis
          name="Lợi nhuận bán hàng"
          parameter={totalPrice / 2 - 500}
          color="rgb(248,167,2)"
          percent="+0.6%"
        />
      </div>
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-3 lg:col-span-1">
          <MultipleRadialbars />
        </div>
        <div className="col-span-3 lg:col-span-2">
          <Area />
        </div>
      </div>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <MainAdmin>{page}</MainAdmin>;
};

export default Dashboard;
