import { useState, useCallback, useEffect } from "react"
import { Loader2Icon, LockIcon, CheckIcon, XIcon, CircleAlertIcon, CopyIcon } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth.context"
import { api } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

type Event = {
  id: string
  title: string
  description: string
  init: string
  end: string | null
  isPublic: boolean
  category: { id: string; name: string }
  invite: {
    user: { id: string; fullname: string; email: string },
    rejectedAt: string | null,
    acceptedAt: string | null,
    createdAt: string
  }[]
}

async function fetchEvent(eid: string) {
  const { data } = await api.get(`/events/${eid}`)
  return data
}

export default function MyEventDetailPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { eid } = useParams()
  const { user } = useAuth()

  const { isPending, data: event, isError, error } = useQuery<Event>({
    queryKey: ["event", eid],
    queryFn: () => fetchEvent(eid!),
    retry(failureCount, error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          toast({
            title: "Você não tem permissão para detalhar este evento",
            variant: "destructive",
          })
          navigate("/meus-eventos", { replace: true })
          return false
        }
      }
      return failureCount < 2
    }
  })

  function updateInvites() {
    queryClient.refetchQueries({
      queryKey: ["event", eid!]
    })
  }

  useEffect(() => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        toast({
          title: "Você não tem permissão para detalhar este evento",
          variant: "destructive",
        })
        return navigate("/meus-eventos", { replace: true })
      }
    }
  }, [isError, error, navigate, toast])

  if (isPending) {
    return (
      <>
        <Header user={user} />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2Icon className="animate-spin h-8 w-8" />
          </div>
        </main>
      </>
    )
  }

  if (!event) {
    return null
  }

  return (
    <>
      <Header user={user} />
      <main className="container mx-auto px-4 py-6">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {event.title}
              </h1>

              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                {event.isPublic ? (
                  <>
                    <span>Evento público</span>
                  </>
                ) : (
                  <>
                    <LockIcon />
                    <span>Evento privado</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center text-gray-600 space-x-1">
                <span className="font-semibold">Categoria:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {event.category.name}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center text-gray-600">
                <span className="font-semibold">Início:</span>
                <span className="ml-2">
                  {new Date(event.init).toLocaleDateString()}
                </span>
              </div>
              {event.end && (
                <div className="flex items-center text-gray-600">
                  <span className="font-semibold">Fim:</span>
                  <span className="ml-2">
                    {event.end
                      ? new Date(event.end).toLocaleDateString()
                      : "Sem fim previsto"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Descrição</h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            <section>
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold mb-4">Convidades</h2>
                {event.isPublic ? (
                  <ShareDialog id={event.id} />
                ) : (
                  <InviteDialog eventId={event.id} onInvite={updateInvites} />
                )}
              </div>

              {event.invite.length > 0 && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {event.invite.map((invite) => (
                      <div
                        key={invite.user.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <Avatar className="h-10 w-10">
                          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                            {invite.user.fullname[0].toUpperCase()}
                          </div>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">
                              {invite.user.fullname}
                            </p>
                            {invite.rejectedAt ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Recusado
                              </span>
                            ) : invite.acceptedAt ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Aceito
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pendente
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {invite.user.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </Card>
      </main>
    </>
  );
}

function ShareDialog({ id }: { id: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Compartilhar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar evento</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <CopyIcon />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InviteDialog({ eventId, onInvite }: { eventId: string, onInvite?: (data: any) => void }) {
  const { toast } = useToast()
  const { user: loggedUser } = useAuth()
  const [user, setUser] = useState<{ email: string; fullname: string } | null>(null)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  }

  const searchUser = useCallback(
    async (email: string) => {
      if (!email) {
        setUser(null)
        setError("")
        return
      }

      if (!validateEmail(email)) {
        setUser(null)
        setError("Email inválido")
        return
      }

      if (loggedUser?.email === email) {
        setUser(null)
        setError("Você não pode convidar a si mesmo")
        return
      }

      setIsSearching(true)
      setError("")

      try {
        const { data } = await api.get(`/users/search?email=${email}`)
        setUser(data.user)
        setError("")
      } catch (error) {
        console.error("error while searching user", error)
        setUser(null)
        setError("Usuário não encontrado")
      } finally {
        setIsSearching(false)
      }
    },
    [loggedUser]
  )

  useEffect(() => {
    setUser(null)
    const timer = setTimeout(() => {
      searchUser(email)
    }, 500)

    return () => clearTimeout(timer)
  }, [email, searchUser])

  async function inviteUser() {
    if (!user) return
    try {
      setIsLoading(true)

      const { data } = await api.post(`/events/invite`, {
        eventId: eventId,
        email: user.email,
      })

      toast({
        itemID: "invite",
        title: "Convite enviado com sucesso",
        description: "O usuário foi convidado para o evento",
      })
      closeAndClear()

      if (onInvite)
        onInvite(data)
    } catch (err) {
      console.error("error while inviting user", err)
      toast({
        itemID: "invite",
        title: "Erro ao convidar usuário",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function closeAndClear() {
    setOpen(false)
    setEmail("")
    setUser(null)
    setError("")
  }

  const getInputIcon = () => {
    if (!email) return <CircleAlertIcon className="h-4 w-4 text-gray-400" />
    if (isSearching) return <Loader2Icon className="h-4 w-4 animate-spin" />
    if (user) return <CheckIcon className="h-4 w-4 text-green-500" />
    return <XIcon className="h-4 w-4 text-red-500" />
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Criar convite</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar convite</DialogTitle>
          <DialogDescription>
            A pessoa convidada receberá um convite para o evento que podera ser aceito ou negado.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={error ? "border-red-500" : ""}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {getInputIcon()}
                </div>
              </div>
            </div>
            <div className="h-[1ch]">
              {error && <p className="text-sm text-red-500">{error}</p>}
              {user && <p className="text-sm text-green-500">
                Esse convite será enviado para {user.fullname}
              </p>}
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={inviteUser}
            disabled={!user || isLoading}
          >
            Convidar
            {isLoading && <Loader2Icon className="ml-1 h-4 w-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
