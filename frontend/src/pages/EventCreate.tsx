import { useCallback, useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from '@/components/header'
import { useAuth } from '@/contexts/auth.context'
import { defaultProfile } from '@/consts'
import { api } from '@/lib/api'
import { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

type Category = { id: string, name: string };

export default function EventCreatePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [localLoading, setLocalLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    public: false,
    dateInit: '',
    dateEnd: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function changeKind(kind: string) {
    setFormData(prev => ({ ...prev, public: kind === 'public' }))
  }

  async function changeCategory(categoryId: string) {
    setFormData(prev => ({ ...prev, categoryId }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLocalLoading(true)
      await api.post('/events', {
        title: formData.title,
        categoryId: formData.categoryId,
        description: formData.description,
        isPublic: formData.public,
        init: formData.dateInit,
        end: formData.dateEnd,
      })

      const t = toast({
        title: "Evento criado com sucesso",
        description: "Seu evento foi criado com sucesso",
      });

      setTimeout(() => {
        t.dismiss()
      }, 3000)

      return navigate('/meus-eventos')
    } catch (err) {
      if (err instanceof AxiosError) {
        const errToast = toast({
          title: "Ops! Não foi possível criar o evento",
          description: err.response?.data.message,
          variant: "destructive"
        });

        setTimeout(() => {
          errToast.dismiss()
        }, 3000)
      }
    } finally {
      setLocalLoading(false)
    }
  }

  const fetchCategories = useCallback(async () => {
    try {
      setLocalLoading(true)
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
        navigate('/')
      }
    } finally {
      setLocalLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return (
    <main className="h-screen flex flex-col">
      <Header user={user ?? defaultProfile} />

      <section className="container mx-auto p-4 flex flex-col flex-1 items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Criar evento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select required onValueChange={changeCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Tipo</Label>
                  <Select required onValueChange={changeKind}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Público</SelectItem>
                      <SelectItem value="private">Privado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateInit">Início</Label>
                  <Input
                    id="dateInit"
                    name="dateInit"
                    type="datetime-local"
                    placeholder="DD/MM/AAAA"
                    value={formData.dateInit}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateEnd">Fim</Label>
                  <Input
                    id="dateEnd"
                    name="dateEnd"
                    type="datetime-local"
                    placeholder="DD/MM/AAAA"
                    value={formData.dateEnd}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    type="password"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="resize-none"
                    required
                  />
                </div>
              </>

              <Button type="submit" className="w-full" disabled={localLoading}>
                Criar
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
