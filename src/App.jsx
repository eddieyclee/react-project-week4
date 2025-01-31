import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage';
import ProductPage from './pages/ProductPage';

function App() {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <>
    {isAuth ? (<ProductPage />) : (<LoginPage setIsAuth={setIsAuth} />)}
    </>
  )
}

export default App