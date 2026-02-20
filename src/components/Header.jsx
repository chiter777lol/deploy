import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'
import { logout } from '../store/authSlice'
import SearchBar from './SearchBar'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const cartItems = useSelector(state => state.cart.items.length)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        {/* Верхняя строка */}
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Internet-Shop
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-600" />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm">{user?.name}</span>
                {user?.role === 'admin' && (
                  <Link to="/admin/products" className="text-sm text-blue-600 hover:underline">
                    Админ
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:underline"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-sm text-blue-600 hover:underline">
                  Вход
                </Link>
                <span className="text-gray-400">|</span>
                <Link to="/register" className="text-sm text-blue-600 hover:underline">
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Поисковая строка */}
        <div className="py-4 border-t">
          <SearchBar />
        </div>
      </div>
    </header>
  )
}

export default Header
