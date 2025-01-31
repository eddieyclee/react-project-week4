import { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';
import DelProductModal from '../components/DelProductModal';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;
const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""]
};

function ProductPage() {
    const [modalMode, setModalMode] = useState(null);
    const [products, setProducts] = useState([]);
    const [tempProduct, setTempProduct] = useState(defaultModalState);
    const [pageInfo, setPageInfo] = useState({});
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);

    // 取得產品資料
    const getProducts = async (page=1) => {
      try {
        const res = await axios.get(`${BASE_URL}/api/${API_PATH}/admin/products?page=${page}`);
        // 讀取資料庫產品資料，並進行更新
        setProducts(res.data.products);
        setPageInfo(res.data.pagination);
      } catch (error) {
        alert("取得產品失敗");
      }
    }

    useEffect(() => {
      // 取得產品列表
      getProducts();
    }, [])

    // 開啟ProductModal事件
    const handleOpenProductModal = (mode, product) => {
      // 設定新增或編輯Modal
      setModalMode(mode);

      if (mode === 'create') {
        // 全新ProductModal
        setTempProduct(defaultModalState);
      } else {
        // 原ProductModal
        setTempProduct(product);
      }

      setIsProductModalOpen(true);
    }

    // 開啟DelProductModal事件
    const handleDelOpenProductModal = (product) => {
      setTempProduct(product);
      setIsDelProductModalOpen(true);
    }

    const handlePageChange = (page) => {
      getProducts(page);
    }

    return (
    <>
    <div className="container py-5">
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-between">
          <h2>產品列表</h2>
          <button type="button" className="btn btn-primary" onClick={() => handleOpenProductModal('create')}>建立新的產品</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">產品名稱</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <th scope="row">{product.title}</th>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  <td>{product.is_enabled ? <span className="text-success">啟用</span> : <span>未啟用</span>}</td>
                  <td>
                  <div className="btn-group">
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleOpenProductModal('edit', product)}>編輯</button>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDelOpenProductModal(product)}>刪除</button>
                  </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
    </div>
    <ProductModal modalMode={modalMode} tempProduct={tempProduct} isProductModalOpen={isProductModalOpen} setIsProductModalOpen={setIsProductModalOpen} getProducts={getProducts} />
    <DelProductModal tempProduct={tempProduct} isDelProductModalOpen={isDelProductModalOpen} setIsDelProductModalOpen={setIsDelProductModalOpen} getProducts={getProducts} />
    </>
    )
}

export default ProductPage