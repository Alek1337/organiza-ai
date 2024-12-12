import { createRoot } from 'react-dom/client'
import './index.css'
import {
  Routes,
  Route,
  BrowserRouter
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './contexts/auth.context'
import HomePage from './pages/Home.tsx'
import LoginPage from './pages/Login.tsx'
import Me from './pages/Me.tsx'
import MyEventsPage from './pages/MyEvents.tsx'
import EventCreatePage from './pages/EventCreate.tsx'
import MyEventDetailPage from './pages/MyEventDetail.tsx'
import EventDetailPage from './pages/EventDetail.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/meus-eventos">
            <Route index element={<MyEventsPage />} />
            <Route path=":eid" element={<MyEventDetailPage />} />
          </Route>

          <Route path="/evento">
            <Route path=":eid" element={<EventDetailPage />} />
          </Route>

          <Route path="/criar-evento" element={<EventCreatePage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/eu" element={<Me />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  </AuthProvider>
)
