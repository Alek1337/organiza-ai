import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Loading from "@/components/loading";
import { defaultProfile } from "@/consts";
import { useAuth } from "@/contexts/auth.context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function Me() {
  const navigate = useNavigate();
  const { user, authenticated, isLoading: isUserLoading, handleLogout, fetchMe } = useAuth();
  const { toast }  = useToast()

  const [ answerDialogOpen, setAnswerDialogOpen ] = useState(false);
  const [ answer, setAnswer ] = useState("");
  const [ selectedInvite, setSelectedInvite ] = useState("")
  const [ isLoading, setIsLoading ] = useState(false)

  async function logout() {
    await handleLogout();
  }

  async function answerInvite() {
    setIsLoading(true)
    try {
      await api.patch("/events/invite/answer/", {
        inviteId: selectedInvite,
        answer
      })
      await fetchMe()

      toast({
        title: "Sucesso",
        description: "Convite respondido com sucesso!",
      })
    } catch (err) {
      console.error("error while responding to invite", err)
      toast({
        title: "Erro",
        variant: "destructive",
        description: "Ocorreu um erro ao responder ao convite, tente novamente mais tarde.",
      })
    } finally {
      setSelectedInvite("")
      setAnswer("")
      setAnswerDialogOpen(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!authenticated && !isUserLoading) {
      return navigate("/login", {
        state: {
          from: "/meus-dados",
          message: "Você precisa estar logado para acessar seus dados!",
        },
      });
    }
  }, [authenticated, isUserLoading, navigate]);

  if (isLoading) {
    return (
      <>
        <Header user={user ?? defaultProfile} />
        <Loading />
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header user={user ?? defaultProfile} />
      <section className="container mx-auto p-4 flex flex-col flex-1">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-2xl font-bold">Meus dados</h1>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-lg font-bold">{user?.fullname}</p>
            <p className="text-sm font-medium">{user?.email}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Meus convites</h2>
          <div className="grid gap-4">
            {user?.Invite?.length === 0 && (
              <p className="text-center text-gray-500">
                Nenhum convite recebido
              </p>
            )}
            {user?.Invite?.map((invite) => (
              <Card key={invite.id} className="p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{invite.event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {invite.event.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        {new Date(invite.event.init).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {
                      !invite.acceptedAt && !invite.rejectedAt ? (
                        <>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <span className="underline text-sm">Responder convite</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => { setAnswerDialogOpen(true); setAnswer("accept"); setSelectedInvite(invite.id)}}>Aceitar</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setAnswerDialogOpen(true); setAnswer("deny"); setSelectedInvite(invite.id)}}>Recusar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <Dialog open={answerDialogOpen} onOpenChange={setAnswerDialogOpen}>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Responder convite</DialogTitle>
                                <DialogDescription>
                                  Tem certeza que deseja <span className="font-bold">{answer === "deny" ? "recusar" : "aceitar"}</span> esse convite?
                                  Essa escolha nao pode ser desfeita.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button className="bg-red-500 hover:bg-red-600">
                                    Cancelar
                                  </Button>
                                </DialogClose>
                                <Button className="bg-primary hover:bg-primary/80" onClick={answerInvite}>
                                  Confirmar
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </>
                      )
                        : (
                          <div className="flex gap-2">
                            {invite.acceptedAt && (
                              <span className="text-green-500 text-sm">Aceito</span>
                            )}
                            {invite.rejectedAt && (
                              <span className="text-red-500 text-sm">Recusado</span>
                            )}
                          </div>
                        )
                    }
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <footer className="flex justify-center mt-8">
          <Button className="bg-red-500 hover:bg-red-600" onClick={logout}>
            Sair
          </Button>
        </footer>
      </section>
    </div>
  );
}
