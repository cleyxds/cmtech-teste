import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Users, Phone, MapPin, CheckCircle2, ShieldCheck, Smartphone, Globe } from 'lucide-react'

export function Home() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <div className="mx-auto mb-6 bg-blue-100 p-4 rounded-2xl w-fit">
          <Users className="h-12 w-12 text-blue-600 mx-auto" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          CMTech User Management
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive solution for managing users, contacts, and addresses with modern UI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="mb-4 bg-blue-100 p-3 rounded-full w-fit">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Create, read, update, and delete users with ease</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/users">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Manage Users
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="mb-4 bg-green-100 p-3 rounded-full w-fit">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Contact Management</CardTitle>
            <CardDescription>Manage user contact information efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/contacts">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Manage Contacts
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="mb-4 bg-purple-100 p-3 rounded-full w-fit">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle>Address Management</CardTitle>
            <CardDescription>Manage user addresses with CEP lookup</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/addresses">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Manage Addresses
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
            <div className="mx-auto mb-4 bg-blue-100 p-3 rounded-full w-fit">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Secure Authentication</h3>
            <p className="text-sm text-muted-foreground">JWT-based authentication for secure access</p>
          </div>

          <div className="text-center p-6 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
            <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full w-fit">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Email Validation</h3>
            <p className="text-sm text-muted-foreground">Real-time email availability checking</p>
          </div>

          <div className="text-center p-6 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
            <div className="mx-auto mb-4 bg-purple-100 p-3 rounded-full w-fit">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">CEP Lookup</h3>
            <p className="text-sm text-muted-foreground">Automatic address completion via ViaCEP</p>
          </div>

          <div className="text-center p-6 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
            <div className="mx-auto mb-4 bg-indigo-100 p-3 rounded-full w-fit">
              <Smartphone className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold mb-2">Responsive Design</h3>
            <p className="text-sm text-muted-foreground">Works perfectly on all devices</p>
          </div>
        </div>
      </div>

      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Create an account or login to start managing your data efficiently
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.location.href = '/register'} className="bg-green-600 hover:bg-green-700">
            Create Account
          </Button>
          <Button onClick={() => window.location.href = '/login'} variant="outline">
            Sign In
          </Button>
        </div>
      </div>
    </div>
  )
}