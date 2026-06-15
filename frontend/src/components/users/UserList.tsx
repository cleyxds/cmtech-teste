import { useState, useEffect } from 'react'
import { getUsers, deleteUser } from '@/lib/api/users'
import { Button } from '../ui/button'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table'
import { UserForm } from './UserForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { ConfirmationDialog } from '../ui/confirmation-dialog'
import { Users, Plus, Edit2, Trash2, Loader2 } from 'lucide-react'

export function UserList() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)

  const fetchUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id)
      setUsers(users.filter(user => user.id !== id))
      setIsConfirmOpen(false)
    } catch (err) {
      setError('Failed to delete user')
    }
  }

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setIsDialogOpen(true)
  }

  const handleUserSaved = () => {
    setIsDialogOpen(false)
    setEditingUser(null)
    fetchUsers()
  }

  const openDeleteConfirm = (id: number) => {
    setUserToDelete(id)
    setIsConfirmOpen(true)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="bg-destructive/10 p-4 rounded-full">
          <Trash2 className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Error loading users</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchUsers} variant="outline">
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
            <Users className="h-6 w-6 text-blue-600" />
            <span>User Management</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Create, edit, and manage user accounts
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUser(null)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {editingUser ? (
                  <>
                    <Edit2 className="h-5 w-5 text-blue-600" />
                    <span>Edit User</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 text-green-600" />
                    <span>Add User</span>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <UserForm user={editingUser} onSave={handleUserSaved} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-muted p-4 rounded-full">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No users found</p>
                    <Button onClick={() => setIsDialogOpen(true)} size="sm">
                      Add first user
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="flex items-center space-x-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteConfirm(user.id)}
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
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={() => userToDelete && handleDelete(userToDelete)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}