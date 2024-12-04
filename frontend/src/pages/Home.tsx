import { useState, useEffect, useCallback } from 'react'
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useAuth } from "@/contexts/auth.context"
import { api } from '@/lib/api'
import { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'

type Category = { id: string, name: string };
type Event = {
  id: string,
  title: string,
  category: Category
  init: string
  end: string
  isPublic: boolean
};

export default function HomePage() {
  const { user } = useAuth()

  const [localLoading, setLocalLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [events, setEvents] = useState<Event[]>([])

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await api.get('/events/categories') as { data: Category[] }
      setCategories(data)
    } catch (err) {
      if (err instanceof AxiosError) {
        const errToast = toast({
          title: "Ops! Não foi possível listar as categorias",
          description: "Tente novamente mais tarde",
          variant: "destructive"
        });

        setTimeout(() => {
          errToast.dismiss()
        }, 3000)
      }
    }
  }, [])

  const fetchEvents = useCallback(async () => {
    try {
      const { data } = await api.get('/events') as { data: Event[] }
      setEvents(data)
    } catch (err) {
      if (err instanceof AxiosError) {
        const errToast = toast({
          title: "Ops! Não foi possível listar os events",
          description: "Tente novamente mais tarde",
          variant: "destructive"
        });

        setTimeout(() => {
          errToast.dismiss()
        }, 3000)
      }
    }
  }, [])

  const fetchData = useCallback(async () => {
    setLocalLoading(true)
    await Promise.all([fetchCategories(), fetchEvents()])
    setLocalLoading(false)
  }, [fetchCategories, fetchEvents])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <Header user={user} />

      <main
        className="flex flex-col items-center h-screen space-y-4"
      >
        <section className="flex flex-col items-center justify-center space-y-4 h-1/3">
          <h1 className="text-5xl font-bold">Organiza AI</h1>
          <p className="text-lg">Uma maneira inteligente de organizar seus eventos</p>
          <Input
            placeholder="Pesquise eventos, categorias, lugares..."
          />
        </section>

        <section className="flex flex-col items-center space-y-4 w-2/3">
          <div className="flex flex-col items-center space-y-4 w-full">
            <h2 className="text-3xl font-bold text-left self-start">
              Procure por categorias
            </h2>

            <div className="flex justify-start">
              {
                categories.map((category) => (
                  <Button key={category.id} variant="outline" size="sm" className="mx-2">
                    {category.name}
                  </Button>
                ))
              }
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4 w-full">
            <h2 className="text-3xl font-bold text-left self-start">
              Eventos populares
            </h2>

            <div className="flex w-full justify-between">
              {
                events.map((event) => (
                  <div key={event.id} className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-52 h-52 bg-primary rounded-md relative text-white">
                      <img src="https://via.placeholder.com/150" alt="Event" className="rounded-md" />
                      <p className="text-lg font-bold absolute top-0 left-0 pl-2">{new Date(event.init).toLocaleDateString()}</p>
                      <p className="text-sm absolute bottom-0 left-0 pl-2">{event.category.name}</p>
                    </div>

                    <div className="flex flex-col text-left items-start justify-start">
                      <p>10:00 - 14:00</p>
                      <p>Cidade: Jaragua do sul</p>
                      <p>Local: Universidade catolica</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </section>
      </main>

      <footer className="p-4 bg-primary text-primary-foreground">
        <p>Feito com amor por Alek</p>
      </footer>
    </>
  )
}
