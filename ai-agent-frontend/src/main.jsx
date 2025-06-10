import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CheckAuth } from "./components/check-auth"
import Tickets from "./pages/tickets"
import TicketDetailsPage from './pages/ticket';
import Login from './pages/login';
import Signup from './pages/signup';
import Admin from './pages/admin';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <CheckAuth protected={true}>
            <Tickets />
          </CheckAuth>
        }/>
        <Route path='/ticket/:id' element={
          <CheckAuth protected={true}>
            <TicketDetailsPage />
          </CheckAuth>
        }/>
        <Route path='/login' element={
          <CheckAuth protected={false}>
            <Login />
          </CheckAuth>
        }/>
        <Route path='/signup' element={
          <CheckAuth protected={false}>
            <Signup />
          </CheckAuth>
        }/>
        <Route path='/admin' element={
          <CheckAuth protected={false}>
            <Admin />
          </CheckAuth>
        }/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
