import { useCallback, useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import { Header } from '@/components/header'
import { useAuth } from '@/contexts/auth.context'
import { defaultProfile } from '@/consts'
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import Loading from '@/components/loading';

type Events = {
  id: string
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
      const { data } = await api.get('/events/mine') as { data: { events: Events[] } }
      setEvents(data.events)
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

  if (events.length === 0) {
    return (
      <>
        <Header user={user ?? defaultProfile}/>
        <section className="container mx-auto p-4 flex flex-col flex-1 items-center justify-center">
          <div className="flex flex-col items-center">
            <h1>Nenhum evento criado por voce!</h1>
            <p>Crie seu primeiro evento no botao abaixo</p>
            <Link to="/criar-evento" className="bg-primary text-white px-3 py-2 rounded">Criar evento</Link>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Header user={user ?? defaultProfile}/>
      <section className="container mx-auto p-4 flex flex-col flex-1">
        <h1>Meus eventos</h1>

        <div className="container mx-auto p-4 flex flex-col flex-1">
          {events.map(event => (
            <Link to={`/meus-eventos/${event.id}`} key={event.id} className="bg-white shadow-md rounded p-4 flex flex-col space-y-4 my-4">
              <h2 className="text-xl font-bold">{event.title}</h2>
              <p>{event.description}</p>
              <p>Inicio: {new Date(event.init).toLocaleString()}</p>
              <p>Fim: {new Date(event.end).toLocaleString()}</p>
              <p>Tipo: {event.isPublic ? 'Público' : 'Privado'}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
