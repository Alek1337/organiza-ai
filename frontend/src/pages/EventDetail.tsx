import { useState, useEffect } from "react";
import {
  Loader2Icon,
  LockIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { useAuth } from "@/contexts/auth.context";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogOverlay
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

type Event = {
  id: string;
  title: string;
  description: string;
  init: string;
  end: string | null;
  isPublic: boolean;
  category: { id: string; name: string };
  invite: {
    user: { id: string; fullname: string; email: string };
    rejectedAt: string | null;
    acceptedAt: string | null;
    createdAt: string;
  }[];
};

async function fetchEvent(eid: string) {
  const { data } = await api.get(`/events/${eid}`);
  return data;
}

export default function EventDetailPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { eid } = useParams();
  const { user } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false)

  const {
    isPending,
    data: event,
    isError,
    error,
  } = useQuery<Event>({
    queryKey: ["event", eid],
    queryFn: () => fetchEvent(eid!),
    retry(failureCount, error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          toast({
            title: "Você não tem permissão para detalhar este evento",
            variant: "destructive",
          });
          navigate("/meus-eventos", { replace: true });
          return false;
        }
      }
      return failureCount < 2;
    },
  });

  function updateInvites() {
    queryClient.refetchQueries({
      queryKey: ["event", eid!],
    });
  }

  useEffect(() => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        toast({
          title: "Você não tem permissão para detalhar este evento",
          variant: "destructive",
        });
        return navigate("/meus-eventos", { replace: true });
      }
    }
  }, [isError, error, navigate, toast]);

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
    );
  }

  if (!event) {
    return null;
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
                <h2 className="text-xl font-semibold mb-4">Confirmados</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogOverlay className="fixed inset-0 bg-gray-700 bg-opacity-75" />
                  <DialogTrigger><Button>Confirmar presença</Button></DialogTrigger>
                
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar presença</DialogTitle>
                      <DialogDescription>
                        Você está confirmando sua presença neste evento. Deseja prosseguir?
                      </DialogDescription>
                    </DialogHeader>
                  
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Ao confirmar sua presença, você será adicionado à lista de participantes do evento.
                      </p>
                    </div>
                  
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button 
                        onClick={async () => {
                          try {
                            await api.post(`/events/${event.id}/confirm`);
                            toast({
                              title: "Presença confirmada com sucesso!",
                              description: "Você foi adicionado à lista de participantes.",
                            });
                            updateInvites();
                            setDialogOpen(false)
                          } catch (err) {
                            console.error("error confirming presence", err);
                            toast({
                              title: "Erro ao confirmar presença",
                              description: "Não foi possível confirmar sua presença. Tente novamente.",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        Confirmar presença
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                                Confite recusado
                              </span>
                            ) : invite.acceptedAt ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                { event.isPublic ? "Confirmado" : "Convite aceito" }
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Convite pendente
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
