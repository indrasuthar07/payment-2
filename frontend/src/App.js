import './index.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/Store';
import Layout from './components/Layout';
import Home from './pages/home';
import Profile from './pages/profile';
import Transactions from './pages/Transictions';
import Settings from './pages/settings';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import QRCodePage from './pages/qrcode';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from './redux/actions/authActions';

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={!isAuthenticated ? <SignIn/>: <Navigate to="/home" replace />}/>
          <Route path="/signup" element={!isAuthenticated ? <SignUp/>: <Navigate to="/home" replace />}/>
          
          {/* Protected Routes */}
          <Route path="/" element={isAuthenticated ? <Layout/> : <Navigate to="/signin" replace/>}>
            <Route index element={<Navigate to="/home" replace/>}/>
            <Route path="home" element={<Home/>}/>
            <Route path="profile" element={<Profile/>}/>
            <Route path="transactions" element={<Transactions/>}/>
            <Route path="settings" element={<Settings/>}/>
            <Route path="qrcode" element={<QRCodePage/>}/>
          </Route>

         
          <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/signin"} replace/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

function App() {
  return <AppContent/>;
}

export default App;
