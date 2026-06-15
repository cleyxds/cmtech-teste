import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { createUser, updateUser } from '@/lib/api/users'
import { User, Mail, Lock, Loader2 } from 'lucide-react'

const userSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  user: any | null
  onSave: () => void
}

export function UserForm({ user, onSave }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    },
  })

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      if (user) {
        await updateUser(user.id, data)
      } else {
        await createUser(data)
      }
      onSave()
    } catch (err) {
      setError('Failed to save user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center space-x-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>Full Name</span>
        </Label>
        <div className="relative">
          <Input
            id="name"
            placeholder="John Doe"
            className="pl-10"
            {...register('name')}
          />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        {errors.name && <p className="text-sm text-red-500 flex items-center space-x-1">
          <span>•</span>
          <span>{errors.name.message}</span>
        </p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>Email Address</span>
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            className="pl-10"
            {...register('email')}
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        {errors.email && <p className="text-sm text-red-500 flex items-center space-x-1">
          <span>•</span>
          <span>{errors.email.message}</span>
        </p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center space-x-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span>Password</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            {...register('password')}
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        {errors.password && <p className="text-sm text-red-500 flex items-center space-x-1">
          <span>•</span>
          <span>{errors.password.message}</span>
        </p>}
        {!user && (
          <p className="text-xs text-muted-foreground">
            Password must be at least 6 characters long
          </p>
        )}
      </div>

      {error && <div className="p-3 bg-destructive/10 rounded-md text-sm text-destructive flex items-center space-x-2">
        <span>!</span>
        <span>{error}</span>
      </div>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          user ? (
            <>
              <Edit2 className="mr-2 h-4 w-4" />
              <span>Update User</span>
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              <span>Create User</span>
            </>
          )
        )}
      </Button>
    </form>
  )
}