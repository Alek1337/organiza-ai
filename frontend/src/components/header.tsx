import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "@/types"
import { Link } from "react-router-dom"

type HeaderProps = {
  user: User
}
export function Header ({ user }: HeaderProps) {
  const initials = user.fullname.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
      <h1 className="text-xl font-bold">Organiza AI</h1>

      <nav className="flex items-center space-x-4 underline">
        <Link to="/" className="text-sm font-medium">Inicio</Link>
        <Link to="/meus-eventos" className="text-sm font-medium">Meus eventos</Link>
        <Link to="/criar-evento" className="text-sm font-medium">Criar evento</Link>

        <Link to="/eu">
          <Avatar>
            <AvatarImage src={user.profileUrl} />
            <AvatarFallback className="text-black">{ initials }</AvatarFallback>
          </Avatar>
        </Link>
      </nav>
    </header>
  )
}
