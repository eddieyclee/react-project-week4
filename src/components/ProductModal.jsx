import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({ modalMode, tempProduct, isProductModalOpen, setIsProductModalOpen, getProducts }) {
    const [modalData, setModalData] = useState(tempProduct);
    // 取得productModal DOM元素
    const productModalRef = useRef(null);
    const productModalMethodRef = useRef(null);

    useEffect(() => {
      // productModalMethodRef.current 存放Modal的變數
      productModalMethodRef.current = new Modal(productModalRef.current, {backdrop: false});
      productModalRef.current.addEventListener('hide.bs.modal', () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
    }, [])

    useEffect(() => {
      if (isProductModalOpen) {
        productModalMethodRef.current.show();
      }
    }, [isProductModalOpen])

    useEffect(() => {
      setModalData({
        ...tempProduct
      })
    }, [tempProduct])

    // 關閉ProductModal事件
    const handleCloseProductModal = () => {
      productModalMethodRef.current.hide();
      setIsProductModalOpen(false);
    }

    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', file);

      try {
        const res = await axios.post(`${BASE_URL}/api/${API_PATH}/admin/upload`, formData);
        const uploadImageUrl = res.data.imageUrl;

        setModalData({
          ...modalData,
          imageUrl: uploadImageUrl
        })
      } catch (error) {
        alert('上傳圖片失敗');
      }
    }

    // Input為checkbox 帶入checked值
    const handleInputModalChange = (e) => {
      const { name, value, checked, type } = e.target;
      setModalData({
        ...modalData,
        [name]: type === "checkbox" ? checked : value
      })
    }

    // 圖片路徑變更事件
    const handleImageChange = (e, index) => {
      const { value } = e.target;
      const newImages = [...modalData.imagesUrl];
      newImages[index] = value;

      setModalData({
        ...modalData,
        imagesUrl: newImages
      })
    }

    // 新增圖片事件
    const handleAddImage = () => {
      const newImages = [...modalData.imagesUrl, ''];
      setModalData({
        ...modalData,
        imagesUrl: newImages
      })
    }

    // 刪除圖片事件
    const handleRemoveImage = () => {
      const newImages = [...modalData.imagesUrl];
      newImages.pop();
      setModalData({
        ...modalData,
        imagesUrl: newImages
      })
    }

    // 更新產品事件
    const handleUpdateProduct = async () => {
      const apiCall = modalMode === 'create' ? creatProduct : updateProduct;
      try {
        await apiCall();
        getProducts();
        handleCloseProductModal();
      } catch (error) {
        alert('更新產品失敗');
      }
    }

    // 新增產品
    const creatProduct = async () => {
      try {
        await axios.post(`${BASE_URL}/api/${API_PATH}/admin/product`, {
          data: {
            ...modalData,
            origin_price: Number(modalData.origin_price),
            price: Number(modalData.price),
            is_enabled: modalData.is_enabled ? 1 : 0
          }
        });
      } catch (error) {
        alert('新增產品失敗');
      }
    }

    // 編輯產品
    const updateProduct = async () => {
      try {
        await axios.put(`${BASE_URL}/api/${API_PATH}/admin/product/${modalData.id}`, {
          data: {
            ...modalData,
            origin_price: Number(modalData.origin_price),
            price: Number(modalData.price),
            is_enabled: modalData.is_enabled ? 1 : 0
          }
        });
      } catch (error) {
        alert('新增產品失敗');
      }
    }

    return (
    <div ref={productModalRef} id="productModal" className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fs-4">{modalMode === 'create' ? '新增產品' : '編輯產品'}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseProductModal}></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="mb-4">
                  <div className="mb-5">
                    <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="form-control"
                      id="fileInput"
                      onChange={handleFileChange}
                    />
                  </div>
                  <label htmlFor="primary-image" className="form-label">
                    主圖
                  </label>
                  <div className="input-group">
                    <input
                      value={modalData.imageUrl}
                      onChange={handleInputModalChange}
                      name="imageUrl"
                      type="text"
                      id="primary-image"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <img
                    src={modalData.imageUrl}
                    alt={modalData.title}
                    className="img-fluid"
                  />
                </div>

                {/* 副圖 */}
                <div className="border border-2 border-dashed rounded-3 p-3">
                  {modalData.imagesUrl?.map((image, index) => (
                    <div key={index} className="mb-2">
                      <label
                        htmlFor={`imagesUrl-${index + 1}`}
                        className="form-label"
                      >
                        副圖 {index + 1}
                      </label>
                      <input
                        value={image}
                        onChange={(e) => handleImageChange(e, index)}
                        id={`imagesUrl-${index + 1}`}
                        type="text"
                        placeholder={`圖片網址 ${index + 1}`}
                        className="form-control mb-2"
                      />
                      {image && (
                        <img
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className="img-fluid mb-2"
                        />
                      )}
                    </div>
                  ))}
                  <div className="btn-group w-100">
                    {modalData.imagesUrl.length < 5 && 
                    modalData.imagesUrl[modalData.imagesUrl.length - 1] !== '' && 
                    (<button className="btn btn-outline-primary btn-sm w-100" onClick={handleAddImage}>新增圖片</button>)
                    }

                    {modalData.imagesUrl.length > 1 && 
                    (<button className="btn btn-outline-danger btn-sm w-100" onClick={handleRemoveImage}>取消圖片</button>)
                    }
                  </div>

                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    value={modalData.title}
                    onChange={handleInputModalChange}
                    name="title"
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入標題"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    分類
                  </label>
                  <input
                    value={modalData.category}
                    onChange={handleInputModalChange}
                    name="category"
                    id="category"
                    type="text"
                    className="form-control"
                    placeholder="請輸入分類"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="unit" className="form-label">
                    單位
                  </label>
                  <input
                    value={modalData.unit}
                    onChange={handleInputModalChange}
                    name="unit"
                    id="unit"
                    type="text"
                    className="form-control"
                    placeholder="請輸入單位"
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      value={modalData.origin_price}
                      onChange={handleInputModalChange}
                      name="origin_price"
                      id="origin_price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      value={modalData.price}
                      onChange={handleInputModalChange}
                      name="price"
                      id="price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    value={modalData.description}
                    onChange={handleInputModalChange}
                    name="description"
                    id="description"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    value={modalData.content}
                    onChange={handleInputModalChange}
                    name="content"
                    id="content"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入說明內容"
                  ></textarea>
                </div>

                <div className="form-check">
                  <input
                    checked={modalData.is_enabled}
                    onChange={handleInputModalChange}
                    name="is_enabled"
                    type="checkbox"
                    className="form-check-input"
                    id="isEnabled"
                  />
                  <label className="form-check-label" htmlFor="isEnabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-top bg-light">
            <button type="button" className="btn btn-secondary" onClick={handleCloseProductModal}>
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={handleUpdateProduct}>
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
    )
}

export default ProductModal