import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { createPhone, updatePhone } from '@/lib/api/contacts'
import { Phone, Loader2, Plus, Edit2 } from 'lucide-react'

const contactSchema = z.object({
  phone_number: z.string().min(10, 'Phone number must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormProps {
  userId: number
  contact: any | null
  onSave: () => void
}

export function ContactForm({ userId, contact, onSave }: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phone_number: contact?.phone_number || '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      if (contact) {
        await updatePhone(contact.id, data)
      } else {
        await createPhone(userId, data)
      }
      onSave()
    } catch (err) {
      setError('Failed to save contact')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="phone_number" className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>Phone Number</span>
        </Label>
        <div className="relative">
          <Input
            id="phone_number"
            placeholder="(XX) XXXXX-XXXX"
            className="pl-10"
            {...register('phone_number')}
          />
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        {errors.phone_number && <p className="text-sm text-red-500 flex items-center space-x-1">
          <span>•</span>
          <span>{errors.phone_number.message}</span>
        </p>}
        <p className="text-xs text-muted-foreground">
          Enter phone number with country code (e.g., +5511987654321)
        </p>
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
          contact ? (
            <>
              <Edit2 className="mr-2 h-4 w-4" />
              <span>Update Contact</span>
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              <span>Create Contact</span>
            </>
          )
        )}
      </Button>
    </form>
  )
}