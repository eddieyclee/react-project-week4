import { useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function DelProductModal({ tempProduct, isDelProductModalOpen, setIsDelProductModalOpen, getProducts }) {
    // 取得delProductModal DOM元素
    const delProductModalRef = useRef(null);
    const delProductModalMethodRef = useRef(null);

    useEffect(() => {
      // delProductModalRef.current 存放Modal的變數
      delProductModalMethodRef.current = new Modal(delProductModalRef.current, {backdrop: false});
      delProductModalRef.current.addEventListener('hide.bs.modal', () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
    }, [])

    useEffect(() => {
      if (isDelProductModalOpen) {
        delProductModalMethodRef.current.show();
      }
    }, [isDelProductModalOpen])

    // 關閉DelProductModal事件
    const handleDelCloseProductModal = () => {
      delProductModalMethodRef.current.hide();
      setIsDelProductModalOpen(false);
    }

    // 刪除產品
    const deleteProduct = async () => {
      try {
        await axios.delete(`${BASE_URL}/api/${API_PATH}/admin/product/${tempProduct.id}`);
      } catch (error) {
        alert('刪除產品失敗');
      }
    }

    // 刪除產品事件
    const handleDelProduct = async () => {
      try {
        await deleteProduct();
        getProducts();
        handleDelCloseProductModal();
      } catch (error) {
        alert('刪除產品失敗');
      }
    }

    return (
    <>
    <div
      ref={delProductModalRef}
      className="modal fade"
      id="delProductModal"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">刪除產品</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleDelCloseProductModal}
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除 
            <span className="text-danger fw-bold">{tempProduct.title}</span>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleDelCloseProductModal}
            >
              取消
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelProduct}>
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
    )
}

export default DelProductModal