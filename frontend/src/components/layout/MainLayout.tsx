import { Link, Outlet, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Home, Users, Phone, MapPin, LogIn, UserPlus, LogOut } from "lucide-react"

export function MainLayout() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-md">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">CMTech</span>
            </Link>
            {token && (
              <nav className="hidden md:flex items-center space-x-1">
                <Link
                  to="/users"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Users</span>
                </Link>
                <Link
                  to="/contacts"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span className="text-sm font-medium">Contacts</span>
                </Link>
                <Link
                  to="/addresses"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">Addresses</span>
                </Link>
              </nav>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!token ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="flex items-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/register")}
                  className="flex items-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t py-6 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CMTech. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
