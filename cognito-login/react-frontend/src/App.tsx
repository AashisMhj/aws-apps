import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//
import HomePage from './pages/homePage/HomePage';
import LoginPage from './pages/loginPage/LoginPage';
import SignUpPage from './pages/signUpPage/SignUpPage';
import './assets/app.css'
import { createTheme, ThemeProvider } from '@mui/material';
import { AuthProvider } from './context/Auth.context';
import ProtectedLayout from './layouts/ProtectedLayout';
import PrivateLayout from './layouts/PrivateLayout';
import ProfileEditPage from './pages/profileEditPage/ProfileEditPage';
import PasswordChangePage from './pages/passwordChangePage/PasswordChangePage';
import { ToastProvider } from './context/Toast.context';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateLayout><HomePage /></PrivateLayout>
  },
  {
    path: '/profile',
    element: <PrivateLayout><ProfileEditPage /></PrivateLayout>
  },
  {
    path: '/change-password',
    element: <PrivateLayout><PasswordChangePage /></PrivateLayout>
  },
  {
    path: '/login',
    element: <ProtectedLayout><LoginPage /></ProtectedLayout>
  },
  {
    path: '/sign-up',
    element: <ProtectedLayout><SignUpPage /></ProtectedLayout>
  }
])

function App() {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <AuthProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <RouterProvider router={router} />
          </LocalizationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
