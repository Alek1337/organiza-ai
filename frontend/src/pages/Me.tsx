import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "@/components/header"
import Loading from "@/components/loading"
import { defaultProfile } from "@/consts"
import { useAuth } from "@/contexts/auth.context"

export default function Me () {
  const navigate = useNavigate()

  const { user, authenticated, isLoading } = useAuth()


  useEffect(() => {
    if (!authenticated && !isLoading) {
      navigate("/login", {
        state: {
          from: "/meus-dados",
          message: "Você precisa estar logado para acessar seus dados!"
        }
      });
    }

    // if (!isLoading) {
    // }
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
    <>
      <Header user={user ?? defaultProfile}/>
    </>
  )
}
