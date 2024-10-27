import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth.context'
import { AxiosError } from 'axios'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, handleLogin } = useAuth()

  const [localLoading, setLocalLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    confirmPassword: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit (e: React.FormEvent) {
    e.preventDefault()
    if (isLogin) {
      const { emailOrPhone, password } = formData
      try {
        await handleLogin(emailOrPhone, password)
        return navigate('/')
      } catch (err) {
        if (err instanceof AxiosError) {
          const { status } = err
          if (status === 404) {
            const t = toast({
              title: "Ops! Não foi possível fazer login",
              description: "Combinação de email e senha inválida",
              variant: "destructive",
            })

            setTimeout(() => {
              t.dismiss()
            }, 3000)
          }
        }
      }
    }

    const { fullName, email, phone, birthDate, password, confirmPassword } = formData

    if (password.length < 6) {
      const t = toast({
        title: "Ops! Senha muito curta",
        description: "A senha deve ter no mínimo 6 caracteres",
        variant: "destructive",
      })

      setTimeout(() => {
        t.dismiss()
      }, 3000)
      return
    }

    if (password !== confirmPassword) {
      const t = toast({
        title: "Ops! Senhas não conferem",
        description: "As senhas informadas não são iguais",
        variant: "destructive",
      })
      setTimeout(() => {
        t.dismiss()
      }, 3000)
      return
    }

    try {
      setLocalLoading(true)
      await api.post('/users/register', {
        fullname: fullName,
        email,
        phone,
        birthdate: birthDate,
        password
      });

      const t = toast({
        title: "Usuário criado com sucesso",
        description: "Agora você pode fazer login",
      })

      setTimeout(() => {
        t.dismiss()
      }, 3000)

      setFormData({
        emailOrPhone: '',
        password: '',
        fullName: '',
        email: '',
        phone: '',
        birthDate: '',
        confirmPassword: ''
      })
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          const errorToast = toast({
            title: err.response.data.message,
            description: "Já existe um usuário com esse email",
            variant: "destructive",
          })

          setTimeout(() => {
            errorToast.dismiss()
          }, 3000)
        }
        return
      }

      const errorToast = toast({
        title: "Ops! Algo deu errado",
        description: "Não foi possível fazer o registro",
        variant: "destructive",
      })

      setTimeout(() => {
        errorToast.dismiss()
      }, 3000)
    } finally {
      setLocalLoading(false)
    }

    setIsLogin(true)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{isLogin ? 'Entrar' : 'Registrar'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isLogin ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="emailOrPhone">Email ou Telefone</Label>
                  <Input
                    id="emailOrPhone"
                    name="emailOrPhone"
                    value={formData.emailOrPhone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    placeholder="DD/MM/AAAA"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}
            <Button type="submit" className="w-full">
              {isLogin ? 'Entrar' : 'Registrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
            disabled={localLoading}
          >
            {isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Entre'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
