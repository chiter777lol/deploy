import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
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
    <header className="bg-white border-b-2 border-[#89CFF0] sticky top-0 z-50 shadow-md">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-[#FF6B6B] hover:text-[#FF5252]">
            MODA
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/cart" className="relative text-sm font-medium text-[#1e3a5f] hover:text-[#FF6B6B]">
              Корзина
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-4 bg-[#FF6B6B] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <img 
                    src={user?.avatar} 
                    alt={user?.name}
                    className="w-8 h-8 rounded-full border-2 border-[#89CFF0] group-hover:border-[#FF6B6B] transition"
                  />
                  <span className="text-sm font-medium text-[#1e3a5f] hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin/products" className="text-sm font-medium text-[#1e3a5f] hover:text-[#FF6B6B]">
                    Админ
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-[#89CFF0] hover:text-[#FF6B6B]"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-[#1e3a5f] hover:text-[#FF6B6B]">
                  Вход
                </Link>
                <Link to="/register" className="text-sm bg-[#FF6B6B] text-white px-4 py-1.5 rounded-full hover:bg-[#FF5252] transition shadow-md">
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="py-4 border-t-2 border-[#89CFF0]/30">
          <SearchBar />
        </div>
      </div>
    </header>
  )
}

export default Header
