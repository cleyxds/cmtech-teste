import { useState, useEffect } from 'react'
import { getAddressesByUser, deleteAddress } from '@/lib/api/addresses'
import { Button } from '../ui/button'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table'
import { AddressForm } from './AddressForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { ConfirmationDialog } from '../ui/confirmation-dialog'
import { MapPin, Plus, Edit2, Trash2, Loader2 } from 'lucide-react'

interface AddressListProps {
  userId: number
}

export function AddressList({ userId }: AddressListProps) {
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingAddress, setEditingAddress] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null)

  const fetchAddresses = async () => {
    try {
      const data = await getAddressesByUser(userId)
      setAddresses(data)
    } catch (err) {
      setError('Failed to fetch addresses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [userId])

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress(id)
      setAddresses(addresses.filter(address => address.id !== id))
      setIsConfirmOpen(false)
    } catch (err) {
      setError('Failed to delete address')
    }
  }

  const handleEdit = (address: any) => {
    setEditingAddress(address)
    setIsDialogOpen(true)
  }

  const handleAddressSaved = () => {
    setIsDialogOpen(false)
    setEditingAddress(null)
    fetchAddresses()
  }

  const openDeleteConfirm = (id: number) => {
    setAddressToDelete(id)
    setIsConfirmOpen(true)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading addresses...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="bg-destructive/10 p-4 rounded-full">
          <Trash2 className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Error loading addresses</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchAddresses} variant="outline">
          Try again
        </Button>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-purple-600" />
            <span>Address Management</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage user addresses with CEP lookup
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAddress(null)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Address</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {editingAddress ? (
                  <>
                    <Edit2 className="h-5 w-5 text-blue-600" />
                    <span>Edit Address</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 text-green-600" />
                    <span>Add Address</span>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <AddressForm userId={userId} address={editingAddress} onSave={handleAddressSaved} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Zip Code</TableHead>
              <TableHead>Street</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-muted p-4 rounded-full">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No addresses found</p>
                    <Button onClick={() => setIsDialogOpen(true)} size="sm">
                      Add first address
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              addresses.map((address) => (
                <TableRow key={address.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{address.id}</TableCell>
                  <TableCell>{address.zip_code}</TableCell>
                  <TableCell>{address.street}</TableCell>
                  <TableCell>{address.number}</TableCell>
                  <TableCell>{address.city}</TableCell>
                  <TableCell>{address.state}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(address)}
                        className="flex items-center space-x-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteConfirm(address.id)}
                        className="flex items-center space-x-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
        onConfirm={() => addressToDelete && handleDelete(addressToDelete)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}