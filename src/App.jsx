// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./page/auth/home/HomePage";
import AboutPage from "./page/auth/home/about/AboutPage";
import LoginPage from "./page/auth/LoginPage";
import RegisterPage from "./page/auth/RegisterPage";
import RoutNotFound from "./page/error-page/404";
import MainLayout from "./component/layout/MainLayout";
import MainLayoutLogin from "./component/layout/MainLayoutLogin";
import CostumerPage from "./page/costumer/CostumerPage";
import ProductPage from "./page/product/ProductPage";
import RolePage from "./page/role/RolePage";
import CategoryPage from "./page/category/CategoryPage";
//import PayrollPage from "./page/payrollPage/PayrollPage";
import ProvincePage from "./page/province/ProvincePage";
import BrandPage from "./page/category/BrandPage";
import ProductPageItemCard from "./page/product/ProductPageItemCard";
import EmployeePage from "./page/employee/EmployeePage";
import PositionPage from "./page/position/PositionPage";
import PayrollPage from "./page/payrollPage/payrollPage";
import ExpenseType from "./page/expensetype/ExpenseType";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/costumer" element={<CostumerPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product-card" element={<ProductPageItemCard />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/role" element={<RolePage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/brand" element={<BrandPage />} />
          <Route path="/province" element={<ProvincePage />} />
          <Route path="/employee" element={<EmployeePage />} />
          <Route path="/position" element={<PositionPage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/expens_type" element={<ExpenseType />} />
          <Route path="*" element={<RoutNotFound />} />
        </Route>

        <Route element={<MainLayoutLogin />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<RoutNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
