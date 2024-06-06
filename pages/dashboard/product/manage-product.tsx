import React, { ReactElement, useEffect, useMemo, useState } from "react";
import Card from "../../../components/Card";
import ContentHeader from "../../../components/Header/ContentHeader";
import MainAdmin from "../../../components/Layouts/MainAdmin";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import { useRouter } from "next/dist/client/router";
import { GetUsersQuery } from "../../../interfaces/user";
import { deleteProduct, getAllProductsManage } from "../../../services/product";
import { ListProduct } from "../../../interfaces/product";
import dateFormat from "dateformat";
import ModalImg from "../../../components/Modal/ModalImg";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import Modal from "../../../components/Modal";
import ProductUpload from "../../../containers/Uploads/ProductUpload";
import { toast } from "react-toastify";
import LoadingPage from "../../../components/Loading/LoadingPage";

const columnProduct = [
  "Số thứ tự",
  "Tên sản phẩm",
  "Mô tả",
  "Size",
  "Màu sắc",
  "Loại hàng",
  "Giới tính",
  "Ảnh",
  "Giá",
  "Ngày tạo",
  "",
  "",
];
const DEFAULT_PRODUCTS_LIMIT = 5;

const ManageProduct = ({ loading }: { loading: Boolean }) => {
  const router = useRouter();
  let count = DEFAULT_PRODUCTS_LIMIT * (Number(router.query.page ?? 1) - 1) + 1;
  const [limitValue, setLimitValue] = useState(DEFAULT_PRODUCTS_LIMIT);
  const [product, setProduct] = useState([]);
  const [totalProduct, setTotalProduct] = useState(0);
  const [openImg, setOpenImg] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [imgModal, setImgModal] = useState("");
  const [openMoreDesc, setOpenMoreDesc] = useState(false);
  const [descModal, setdescModal] = useState("");
  const [itemEditModal, setItemEditModal] = useState<ListProduct>();

  const fetchProducts = async (query?: GetUsersQuery): Promise<void> => {
    try {
      const { data } = await getAllProductsManage({
        ...query,
        limit: limitValue,
        page: query?.page ? query?.page : 1,
      });

      setProduct(data.product);
      setTotalProduct(data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangePage = (page: number) => {
    router.push(
      {
        query: {
          page: page,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    router.push(
      {
        query: {
          limit: limitValue,
        },
      },
      undefined,
      { shallow: true }
    );
  }, [limitValue]);

  useEffect(() => {
    fetchProducts(router.query);
  }, [router.query, openEditModal]);

  const handleModalImgMain = (url: string) => {
    setImgModal(url);
    setOpenImg(true);
  };

  const handleModalEdit = (item: ListProduct) => {
    setItemEditModal(item);
    setOpenEditModal(true);
  };

  const handleMoreDesc = (desc: string) => {
    setdescModal(desc);
    setOpenMoreDesc(true);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await deleteProduct(id);
      if (res.status === 200) {
        toast.success("Xóa thành công");
        fetchProducts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const dataSourceProd = useMemo(() => {
    return product.map((item: ListProduct, index: number) => {
      console.log("count", count);
      console.log("count1", index);
      return [
        <> {count === 0 ? index + 1 : count++}</>,
        <p>{item?.name}</p>,
        <div className="flex items-center">
          <div
            dangerouslySetInnerHTML={{ __html: item?.description.slice(0, 20) }}
          />
          <p
            className="cursor-pointer"
            onClick={() => handleMoreDesc(item?.description)}
          >
            ... Xem thêm
          </p>
        </div>,
        <>
          {item?.size.map((size, idx) => (
            <p key={idx}>
              {idx === item?.size.length - 1 ? (
                <span>{size}</span>
              ) : (
                <span>{size},</span>
              )}
            </p>
          ))}
        </>,
        <>
          {item?.color.map((color, idx) => (
            <p key={idx}>
              {idx === item?.color.length - 1 ? (
                <span>{color}</span>
              ) : (
                <span>{color},</span>
              )}
            </p>
          ))}
        </>,
        <p>{item?.category}</p>,
        <p className="first-letter:uppercase">{item?.gender}</p>,
        <>
          {item?.listImage.map((img) => (
            <img
              key={img}
              className="w-1/2 cursor-pointer rounded-lg object-cover"
              onClick={() => handleModalImgMain(img)}
              src={img}
            />
          ))}
        </>,
        <p>{item?.price.toLocaleString("vi")} đ</p>,
        <>{dateFormat(item?.createdAt, "HH:MM dd/mm/yyyy")}</>,
        <p className="w-full flex items-center justify-center">
          <span
            onClick={() => handleModalEdit(item)}
            title="Sửa sản phẩm"
            className="text-xl cursor-pointer hover:text-green-500 rounded-full hover:bg-[rgba(145,158,171,0.08)] p-1"
          >
            <AiOutlineEdit />
          </span>
        </p>,
        <p className="w-full flex items-center justify-center">
          <span
            onClick={() => handleDeleteProduct(item?.id)}
            title="Xóa sản phẩm"
            className="text-xl cursor-pointer hover:text-red-500 rounded-full hover:bg-[rgba(145,158,171,0.08)] p-1"
          >
            <AiOutlineDelete />
          </span>
        </p>,
      ];
    });
  }, [product]);

  return (
    <>
      {loading && <LoadingPage />}
      <ContentHeader title="Quản lý sản phẩm" name="Danh sách sản phẩm" />
      <Card>
        <Card.Content>
          <Table columns={columnProduct} dataSource={dataSourceProd} />
        </Card.Content>
        <Pagination
          current={Number(router.query.page || 1)}
          pageSize={limitValue}
          total={totalProduct}
          onChange={onChangePage}
          setLimitValue={setLimitValue}
        />
      </Card>
      <ModalImg open={openImg} setOpen={setOpenImg}>
        <img
          className="w-60 h-72 object-cover rounded-sm "
          src={imgModal}
          alt=""
        />
      </ModalImg>
      <ModalImg open={openMoreDesc} setOpen={setOpenMoreDesc}>
        <div
          className="p-1 text-white"
          dangerouslySetInnerHTML={{ __html: descModal }}
        />
      </ModalImg>
      <Modal open={openEditModal} setOpen={setOpenEditModal}>
        <ProductUpload productEdit={itemEditModal} setOpen={setOpenEditModal} />
      </Modal>
    </>
  );
};

ManageProduct.getLayout = function getLayout(page: ReactElement) {
  return <MainAdmin>{page}</MainAdmin>;
};

export default ManageProduct;
