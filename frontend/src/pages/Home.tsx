import { Link } from "react-router-dom"
import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth.context";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

type Category = { id: string; name: string };
type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  category: Category;
  init: string;
  end: string;
  isPublic: boolean;
};

export default function HomePage() {
  const { user } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const ITEMS_PER_PAGE = 10;

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = (await api.get("/events/categories")) as {
        data: Category[];
      };
      setCategories(data);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          title: "Ops! Não foi possível listar as categorias",
          description: "Tente novamente mais tarde",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  }, []);

  const fetchEvents = useCallback(
    async (pageNumber: number) => {
      try {
        const categoryParams = selectedCategories.length
          ? `&categories=${selectedCategories.join(",")}`
          : "";

        const { data } = (await api.get(
          `/events?page=${pageNumber}&limit=${ITEMS_PER_PAGE}${categoryParams}&meId=${user?.id ?? ""}`
        )) as {
          data: { events: Event[]; hasMore: boolean };
        };

        if (pageNumber === 1) {
          setEvents(data.events);
        } else {
          setEvents((prev) => [...prev, ...data.events]);
        }
        setHasMore(data.hasMore);
      } catch (err) {
        if (err instanceof AxiosError) {
          toast({
            title: "Ops! Não foi possível listar os eventos",
            description: "Tente novamente mais tarde",
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    },
    [selectedCategories, user?.id]
  );

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      return [...prev, categoryId];
    });
    setPage(1);
  };

  const loadMore = async () => {
    setLocalLoading(true);
    const nextPage = page + 1;
    await fetchEvents(nextPage);
    setPage(nextPage);
    setLocalLoading(false);
  };

  const fetchInitialData = useCallback(async () => {
    setLocalLoading(true);
    await Promise.all([fetchCategories(), fetchEvents(1)]);
    setLocalLoading(false);
  }, [fetchCategories, fetchEvents]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchEvents(1);
  }, [selectedCategories, fetchEvents]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Organiza AI</h1>
          <p className="text-lg mb-6">
            Uma maneira inteligente de organizar seus eventos
          </p>
          <Input
            placeholder="Pesquise eventos, categorias, lugares..."
            className="max-w-md mx-auto"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Filtrar por categorias
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategories.includes(category.id)
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => toggleCategory(category.id)}
                className="flex items-center gap-2"
              >
                {selectedCategories.includes(category.id) && (
                  <Check className="w-4 h-4" />
                )}
                {category.name}
              </Button>
            ))}
            {selectedCategories.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategories([])}
                className="ml-2"
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Eventos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <Link to={`/evento/${event.id}`} key={event.id} className="flex flex-col">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-primary mb-3">
                  <img
                    src="/event.jpg"
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 p-2 bg-black bg-opacity-50 text-white">
                    {new Date(event.init).toLocaleDateString()}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-70 text-white">
                    <p className="font-bold truncate text-center">{event.title}</p>
                    <p className="text-sm text-center">{event.category.name}</p>
                  </div>
                </div>
                <p className={`text-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{ event.isPublic ? "Público" : "Privado" }</p>
                <div className="text-sm space-y-1">
                  <p>
                    {`${new Date(event.init).toLocaleTimeString()} ${new Date(
                      event.init
                    ).toLocaleDateString()}`}
                    <span> - </span>
                    {event.end
                      ? `${new Date(
                          event.init
                        ).toLocaleTimeString()} ${new Date(
                          event.init
                        ).toLocaleDateString()}`
                      : "Sem fim previsto"}
                  </p>
                  {
                    event.location && (
                      <p>Local: {event.location}</p>
                    )
                  }
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <Button
                onClick={loadMore}
                disabled={localLoading}
                className="w-full max-w-xs"
              >
                {localLoading ? "Carregando..." : "Carregar mais eventos"}
              </Button>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground p-4 text-center mt-auto">
        <p>Feito com amor por Alex</p>
      </footer>
    </div>
  );
}
