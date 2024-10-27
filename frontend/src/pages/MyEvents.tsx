import { useCallback, useEffect, useState } from 'react';
import { Header } from '@/components/header'
import { useAuth } from '@/contexts/auth.context'
import { defaultProfile } from '@/consts'
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import Loading from '@/components/loading';

type Events = {
  title: string,
  description: string,
  init: string,
  end: string,
  isPublic: boolean,
  category: {
    id: string
    name: string
  },
  createdBy: {
    id: string
    fullname: string
  }
}

export default function MyEventsPage() {
  const navigate = useNavigate()
  const { user, isLoading, authenticated } = useAuth()

  const [events, setEvents] = useState<Events[]>([])
  const [localLoading, setLocalLoading] = useState(false)

  const fetchMyEvents = useCallback(async function fetchEvents() {
    try {
      setLocalLoading(true)
      const { data } = await api.get('/events?me=true') as { data: Events[] }
      setEvents(data)
    } catch (err) {
      if (err instanceof AxiosError) {
        const errToast = toast({
          title: "Ops! Não foi possível listar seus eventos",
          description: "Tente novamente mais tarde",
          variant: "destructive",
        })

        setTimeout(() => {
          errToast.dismiss()
        }, 3000)
        return;
      }
      throw err
    } finally {
      setLocalLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authenticated && !isLoading) {
      return navigate("/login", {
        state: {
          from: "/meus-eventos",
          message: "Você precisa estar logado para listar seus eventos!"
        }
      });
    }

    fetchMyEvents()
  }, [authenticated, isLoading, navigate, fetchMyEvents]);

  if (localLoading || isLoading) {
    <>
      <Header user={user ?? defaultProfile}/>
      <Loading />
    </>
  }

  return (
    <>
      <Header user={user ?? defaultProfile}/>
      <section className="container mx-auto p-4 flex flex-col flex-1">
        <h1>Meus eventos</h1>

        <div className="container mx-auto p-4 flex flex-col flex-1">
          {events.map(event => (
            <div key={event.title} className="bg-white shadow-md rounded p-4 flex flex-col space-y-4 my-4">
              <h2 className="text-xl font-bold">{event.title}</h2>
              <p>{event.description}</p>
              <p>Inicio: {new Date(event.init).toLocaleString()}</p>
              <p>Fim: {new Date(event.end).toLocaleString()}</p>
              <p>Tipo: {event.isPublic ? 'Público' : 'Privado'}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
