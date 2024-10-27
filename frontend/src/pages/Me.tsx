import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Loading from "@/components/loading"
import { defaultProfile } from "@/consts"
import { useAuth } from "@/contexts/auth.context"

export default function Me () {
  const navigate = useNavigate()

  const { user, authenticated, isLoading, handleLogout } = useAuth()

  async function logout() {
    await handleLogout()
  }

  useEffect(() => {
    if (!authenticated && !isLoading) {
      return navigate("/login", {
        state: {
          from: "/meus-dados",
          message: "Você precisa estar logado para acessar seus dados!"
        }
      });
    }
  }, [authenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <>
        <Header user={user ?? defaultProfile}/>
        <Loading />
      </>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <Header user={user ?? defaultProfile}/>
      <section className="container mx-auto p-4 flex flex-col flex-1">
        <div className="flex flex-col items-center space-y-4 flex-1">
          <h1 className="text-2xl font-bold">Meus dados</h1>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-lg font-bold">{user?.fullname}</p>
            <p className="text-sm font-medium">{user?.email}</p>
          </div>
        </div>

        <footer className="flex justify-center">
          <Button className="bg-red-500 hover:bg-red-600" onClick={logout}>Sair</Button>
        </footer>
      </section>
    </div>
  )
}
