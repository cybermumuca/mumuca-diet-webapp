import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gender } from '@/types/gender'
import { ActivityLevel } from '@/types/activity-level'


interface UserProfile {
  email: string
  firstName: string
  lastName: string
  gender: Gender
  photoUrl: string | null
  activityLevel: ActivityLevel
  age: number
}

export function Account() {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    // Simulating API call
    const fetchProfile = async () => {
      // Replace this with actual API call
      const response = await new Promise<UserProfile>((resolve) => 
        setTimeout(() => resolve({
          email: "samuel@example.com",
          firstName: "Samuel",
          lastName: "Lima",
          gender: "MALE",
          photoUrl: null,
          activityLevel: "MODERATELY_ACTIVE",
          age: 30
        }), 1000)
      )
      setProfile(response)
    }

    fetchProfile()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Profile updated:', profile)
  }

  if (!profile) return <div>Loading...</div>

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Perfil da Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.photoUrl || undefined} alt={profile.firstName} />
                <AvatarFallback>{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nome</Label>
                <Input 
                  id="firstName" 
                  value={profile.firstName} 
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input 
                  id="lastName" 
                  value={profile.lastName} 
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={profile.email} 
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="age">Idade</Label>
              <Input 
                id="age" 
                type="number" 
                value={profile.age} 
                onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="gender">Gênero</Label>
              <Select 
                value={profile.gender} 
                onValueChange={(value: Gender) => setProfile({...profile, gender: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Masculino</SelectItem>
                  <SelectItem value="FEMALE">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="activityLevel">Nível de Atividade</Label>
              <Select 
                value={profile.activityLevel} 
                onValueChange={(value: ActivityLevel) => setProfile({...profile, activityLevel: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível de atividade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEDENTARY">Sedentário</SelectItem>
                  <SelectItem value="LIGHTLY_ACTIVE">Levemente Ativo</SelectItem>
                  <SelectItem value="MODERATELY_ACTIVE">Moderadamente Ativo</SelectItem>
                  <SelectItem value="VERY_ACTIVE">Muito Ativo</SelectItem>
                  <SelectItem value="EXTRA_ACTIVE">Extremamente Ativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Salvar Alterações</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

