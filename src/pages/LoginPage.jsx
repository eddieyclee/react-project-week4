import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function LoginPage({ setIsAuth }) {
    const [account, setAccount] = useState(
      {
        username: "example@test.com",
        password: "example"
      }
    )

    // 登入畫面Input內容，處理帳號與密碼
    const handleInput = (e) => {
      const {name, value} = e.target;
        setAccount({
        ...account,
        [name]: value
      })
    }

    // 登入按鈕事件
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        // 透過axios連線API
        const res = await axios.post(`${BASE_URL}/admin/signin`, account);

        // 取得token, expired
        const { token, expired } = res.data;

        // 由cookie內暫存token與到期時間
        document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;

        // 進行驗證token
        axios.defaults.headers.common['Authorization'] = token;

        // 驗證通過顯示產品列表
        setIsAuth(true);
      } catch (error) {
        alert("登入失敗");
      }
    }

    // 驗證已登入顯示產品列表
    const checkUserLogin = async () => {
      try {
        await axios.post(`${BASE_URL}/api/user/check`);
          setIsAuth(true);
      } catch (error) {
          alert(error);
      }
    }

    useEffect(() => {
      // 取得驗證token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
      if (!token) {
        return;
      } else {
        // 進行驗證token
        axios.defaults.headers.common['Authorization'] = token;
        checkUserLogin();
      }
    }, [])

    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <div className="form-floating mb-3">
            <input onChange={handleInput} name="username" value={account.username} type="email" className="form-control" id="username" placeholder="name@example.com" />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input onChange={handleInput} name="password" value={account.password} type="password" className="form-control" id="password" placeholder="Password" />
            <label htmlFor="password">Password</label>
          </div>
          <button className="btn btn-primary">登入</button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>
    )
}

export default LoginPage