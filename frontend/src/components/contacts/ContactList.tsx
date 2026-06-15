import { useState, useEffect } from 'react'
import { getPhonesByUser, deletePhone } from '@/lib/api/contacts'
import { Button } from '../ui/button'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table'
import { ContactForm } from './ContactForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { ConfirmationDialog } from '../ui/confirmation-dialog'
import { Phone, Plus, Edit2, Trash2, Loader2 } from 'lucide-react'

interface ContactListProps {
  userId: number
}

export function ContactList({ userId }: ContactListProps) {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingContact, setEditingContact] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<number | null>(null)

  const fetchContacts = async () => {
    try {
      const data = await getPhonesByUser(userId)
      setContacts(data)
    } catch (err) {
      setError('Failed to fetch contacts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [userId])

  const handleDelete = async (id: number) => {
    try {
      await deletePhone(id)
      setContacts(contacts.filter(contact => contact.id !== id))
      setIsConfirmOpen(false)
    } catch (err) {
      setError('Failed to delete contact')
    }
  }

  const handleEdit = (contact: any) => {
    setEditingContact(contact)
    setIsDialogOpen(true)
  }

  const handleContactSaved = () => {
    setIsDialogOpen(false)
    setEditingContact(null)
    fetchContacts()
  }

  const openDeleteConfirm = (id: number) => {
    setContactToDelete(id)
    setIsConfirmOpen(true)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading contacts...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="bg-destructive/10 p-4 rounded-full">
          <Trash2 className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Error loading contacts</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchContacts} variant="outline">
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
            <Phone className="h-6 w-6 text-green-600" />
            <span>Contact Management</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage user contact information
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingContact(null)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Contact</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {editingContact ? (
                  <>
                    <Edit2 className="h-5 w-5 text-blue-600" />
                    <span>Edit Contact</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 text-green-600" />
                    <span>Add Contact</span>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <ContactForm userId={userId} contact={editingContact} onSave={handleContactSaved} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-muted p-4 rounded-full">
                      <Phone className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No contacts found</p>
                    <Button onClick={() => setIsDialogOpen(true)} size="sm">
                      Add first contact
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{contact.id}</TableCell>
                  <TableCell>{contact.phone_number}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      contact.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {contact.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(contact)}
                        className="flex items-center space-x-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteConfirm(contact.id)}
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
        title="Delete Contact"
        description="Are you sure you want to delete this contact? This action cannot be undone."
        onConfirm={() => contactToDelete && handleDelete(contactToDelete)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}