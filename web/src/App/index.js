import './App.scss'
import { BrowserRouter, Routes, Navigate, Route, Link, useMatch, useResolvedPath } from 'react-router-dom'

import { DatabaseOutlined, HomeOutlined, TagsOutlined } from '@ant-design/icons'

import { ProductsListScreen } from 'screens/ProdustList.screen'
import { DashboardScreen } from 'screens/Dashboard.screen';
import { ProductDetailsScreen } from 'screens/ProductDetails.screen';

function CustomLink({ to, Icon, label }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({
    path: resolved.pathname,
    end: false
  });

  return (
    <Link
      className={`link-option ${match ? 'link-option-active' : ''}`}
      to={to}
      >
      <div className="icon">
        <Icon />
      </div>

      <div className="text">
        {label}
      </div>
    </Link>
  )
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div id='sidebar'>
          <h1>
            PI VI
          </h1>

          <div id="links">
            <CustomLink to='/home' Icon={HomeOutlined} label='Dashboard' />
            <CustomLink to='/produtos' Icon={DatabaseOutlined} label='Produtos' />
            <CustomLink to='/categorias' Icon={TagsOutlined} label='Categorias' />
          </div>
        </div>

        <header>
          <h3>
            Minerador de Produtos de Tecnologia
          </h3>
        </header>
        
        <div id='container'>
          <Routes >
            <Route
              path='/home'
              index
              element={<DashboardScreen />}
            />

            <Route
              path='/produtos'
              element={<ProductsListScreen />}
            />

            <Route
              path='/produtos/:sku'
              element={<ProductDetailsScreen />}
            />

            <Route
              path='*'
              element={<Navigate replace to='/home' />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
