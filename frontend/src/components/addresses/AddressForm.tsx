import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { createAddress, updateAddress, fetchAddressFromViaCEP } from "@/lib/api/addresses"
import { MapPin, Loader2, Plus, Edit2, Search, Home, Building2, Flag } from "lucide-react"

const addressSchema = z.object({
  zip_code: z.string().min(8, "CEP must be 8 characters"),
  street: z.string().min(1, "Street is required"),
  number: z.string().min(1, "Number is required"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State must be 2 characters"),
})

type AddressFormData = z.infer<typeof addressSchema>

interface AddressFormProps {
  userId: number
  address: any | null
  onSave: () => void
}

export function AddressForm({ userId, address, onSave }: AddressFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      zip_code: address?.zip_code || "",
      street: address?.street || "",
      number: address?.number || "",
      complement: address?.complement || "",
      neighborhood: address?.neighborhood || "",
      city: address?.city || "",
      state: address?.state || "",
    },
  })

  const fetchAddressData = async (zipCode: string) => {
    try {
      setIsFetching(true)
      setError(null)
      const cleanedZipCode = zipCode.replace(/[^0-9]/g, "")
      if (cleanedZipCode.length === 8) {
        const addressData = await fetchAddressFromViaCEP(cleanedZipCode)
        setValue("street", addressData.logradouro || "")
        setValue("neighborhood", addressData.bairro || "")
        setValue("city", addressData.localidade || "")
        setValue("state", addressData.uf || "")
      }
    } catch (err) {
      setError("CEP not found")
    } finally {
      setIsFetching(false)
    }
  }

  const onSubmit = async (data: AddressFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      if (address) {
        await updateAddress(address.id, data)
      } else {
        await createAddress(userId, data)
      }
      onSave()
    } catch (err) {
      setError("Failed to save address")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="zip_code" className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>CEP</span>
        </Label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              id="zip_code"
              placeholder="12345678"
              className="pl-10"
              {...register("zip_code")}
              onBlur={(e) => fetchAddressData(e.target.value)}
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button
            type="button"
            onClick={() => fetchAddressData(getValues().zip_code)}
            disabled={isFetching}
            className="flex items-center space-x-2"
          >
            {isFetching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Buscar CEP</span>
              </>
            )}
          </Button>
        </div>
        {errors.zip_code && (
          <p className="text-sm text-red-500 flex items-center space-x-1">
            <span>•</span>
            <span>{errors.zip_code.message}</span>
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Enter 8-digit CEP to automatically fill address fields
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="street" className="flex items-center space-x-2">
          <Home className="h-4 w-4 text-muted-foreground" />
          <span>Street</span>
        </Label>
        <div className="relative">
          <Input
            id="street"
            placeholder="Rua Example"
            className="pl-10"
            {...register("street")}
          />
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        {errors.street && (
          <p className="text-sm text-red-500 flex items-center space-x-1">
            <span>•</span>
            <span>{errors.street.message}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="number" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span>Number</span>
          </Label>
          <div className="relative">
            <Input
              id="number"
              placeholder="123"
              className="pl-10"
              {...register("number")}
            />
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.number && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <span>•</span>
              <span>{errors.number.message}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="complement">Complement (Optional)</Label>
          <Input
            id="complement"
            placeholder="Apto 101, Bloco B"
            {...register("complement")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="neighborhood" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Neighborhood</span>
          </Label>
          <div className="relative">
            <Input
              id="neighborhood"
              placeholder="Bairro"
              className="pl-10"
              {...register("neighborhood")}
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.neighborhood && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <span>•</span>
              <span>{errors.neighborhood.message}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="flex items-center space-x-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            <span>City</span>
          </Label>
          <div className="relative">
            <Input
              id="city"
              placeholder="Cidade"
              className="pl-10"
              {...register("city")}
            />
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.city && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <span>•</span>
              <span>{errors.city.message}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="flex items-center space-x-2">
            <Flag className="h-4 w-4 text-muted-foreground" />
            <span>State</span>
          </Label>
          <div className="relative">
            <Input id="state" placeholder="SP" className="pl-10" {...register("state")} />
            <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.state && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <span>•</span>
              <span>{errors.state.message}</span>
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 rounded-md text-sm text-destructive flex items-center space-x-2">
          <span>!</span>
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Saving...</span>
          </>
        ) : address ? (
          <>
            <Edit2 className="mr-2 h-4 w-4" />
            <span>Update Address</span>
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create Address</span>
          </>
        )}
      </Button>
    </form>
  )
}
