import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type HeaderProps = {
  profile: {
    name: string
    imageUrl: string
  }
}
export function Header ({ profile }: HeaderProps) {
  const initials = profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
      <h1 className="text-xl font-bold">Organiza AI</h1>

      <nav className="flex items-center space-x-4">
        <a href="#" className="text-sm font-medium">Inicio</a>
        <a href="#" className="text-sm font-medium">Meus eventos</a>
        <a href="#" className="text-sm font-medium">Criar evento</a>

        <Avatar>
          <AvatarImage src={profile.imageUrl} />
          <AvatarFallback>{ initials }</AvatarFallback>
        </Avatar>
      </nav>
    </header>
  )
}
