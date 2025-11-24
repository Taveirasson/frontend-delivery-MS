// import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ClientsPage from './pages/ClientsPage'
import ProductsPage from './pages/ProductsPage'
import OrdersPage from './pages/OrdersPage'


function App() {

  return (
    <>
  <BrowserRouter>
      <Navbar />
      <div className="p-6">
        <p className='text-xl bg-black '>TEste Tailwind</p>
        <Routes>
          <Route path="/" element={<ClientsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </div>
    </BrowserRouter>
    </>
  )
}

export default App
