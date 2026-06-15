import "./index.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { MainLayout } from "./components/layout/MainLayout"
import { LoginForm } from "./components/auth/LoginForm"
import { RegisterForm } from "./components/auth/RegisterForm"
import { UserList } from "./components/users/UserList"
import { ContactList } from "./components/contacts/ContactList"
import { AddressList } from "./components/addresses/AddressList"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { Home } from "./components/Home"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/users" element={<UserList />} />
            <Route path="/contacts" element={<ContactList userId={1} />} />
            <Route path="/addresses" element={<AddressList userId={1} />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
