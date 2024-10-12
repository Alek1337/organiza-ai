import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const defaultProfile = {
  name: "Alex Henrique da Silva",
  imageUrl: "https://github.com/Alek1337.png"
}

function App() {
  return (
    <>
      <Header profile={defaultProfile}>
      </Header>

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
              Explore categorias
            </h2>

            <div className="flex justify-between">
              {
                new Array(9).fill('').map((_, index) => (
                  <Button key={`category-${index}`} variant="outline" size="sm" className="mx-2">
                    Categoria {index + 1}
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
                new Array(4).fill('').map((_, index) => (
                  <div key={`event-${index}`} className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-52 h-52 bg-primary rounded-md relative text-white">
                      <img src="https://via.placeholder.com/150" alt="Event" className="rounded-md" />
                      <p className="text-lg font-bold absolute top-0 left-0 pl-2">Evento {index + 1}</p>
                      <p className="text-sm absolute bottom-0 left-0 pl-2">Categoria {index + 1}</p>
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

export default App
