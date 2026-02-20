import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  
  return isAuthenticated && user?.role === 'admin' 
    ? children 
    : <Navigate to="/" />
}

export default AdminRoute
