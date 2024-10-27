import { createRoot } from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
  createBrowserRouter
} from 'react-router-dom'
import { AuthProvider } from './contexts/auth.context'
import HomePage from './pages/Home.tsx'
import LoginPage from './pages/Login.tsx'
import Me from './pages/Me.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/eu',
    element: <Me />,
  },
])

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router}/>
  </AuthProvider>
)
