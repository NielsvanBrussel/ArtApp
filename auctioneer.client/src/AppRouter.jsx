import React, { useContext } from 'react'
import Header from './components/Header';
import Authentication from './pages/Authentication';
import { GlobalContext } from './GlobalState';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom"

import styles from './styles/AppRouter.module.css'
import Test from './components/Test';
import Main from './pages/Main';
import Inventory from './pages/Inventory';
import MySales from './pages/MySales';
import Artwork from './pages/Artwork';
import PrivateSales from './pages/PrivateSales';

const AppRouter = () => {

  const { authenticated } = useContext(GlobalContext)
  return (
    <div className={styles.approuter__container__outer}>
      <div className={styles.approuter__container__inner}>
        <header>
          <Header />
        </header>
        <Authentication />
        <main>
          <div className={styles.container__outer}>
            <div className={styles.container__inner}>
              <Routes>
                <Route path="*" element={<Navigate to="/" />}/>
                <Route path='/' element={<Main/>}/>
                <Route path='/artwork' element={<Artwork />}/>
                <Route path='/privatesales' element={<PrivateSales />}/>
                {authenticated && (
                  <>
                    <Route path='/test' element={<Test/>} />
                    <Route path='/inventory' element={<Inventory/>} />
                    <Route path='/mysales' element={<MySales />} />
                  </>
                )}
              </Routes>
            </div>
          </div>
        </main>
      </div> 
    </div>
  )
}

export default AppRouter