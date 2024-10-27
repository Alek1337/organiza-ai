import { createRoot } from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
  createBrowserRouter
} from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './contexts/auth.context'
import HomePage from './pages/Home.tsx'
import LoginPage from './pages/Login.tsx'
import Me from './pages/Me.tsx'
import MyEventsPage from './pages/MyEvents.tsx'
import EventCreatePage from './pages/EventCreate.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/meus-eventos',
    element: <MyEventsPage />,
  },
  {
    path: '/criar-evento',
    element: <EventCreatePage />,
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
    <Toaster />
  </AuthProvider>
)
