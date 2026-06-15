import { Navigate, Outlet } from 'react-router-dom'

interface ProtectedRouteProps {
  redirectPath?: string
}

export function ProtectedRoute({ redirectPath = '/login' }: ProtectedRouteProps) {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}