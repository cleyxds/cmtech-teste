import { useState } from 'react'
import { checkEmailAvailability } from '@/lib/api/users'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface EmailValidationProps {
  value: string
  onChange: (value: string) => void
  onValidChange: (isValid: boolean) => void
}

export function EmailValidation({ value, onChange, onValidChange }: EmailValidationProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleBlur = async () => {
    if (!value) return
    
    setIsChecking(true)
    setError(null)
    
    try {
      const isAvailable = await checkEmailAvailability(value)
      setIsAvailable(isAvailable)
      onValidChange(isAvailable)
    } catch (err) {
      setError('Failed to check email availability')
      onValidChange(false)
    } finally {
      setIsChecking(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    if (!e.target.value) {
      setIsAvailable(true)
      setError(null)
      onValidChange(true)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={isChecking}
      />
      {isChecking && <p className="text-sm text-muted-foreground">Checking availability...</p>}
      {!isAvailable && !isChecking && (
        <p className="text-sm text-red-500">Email is already in use</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}