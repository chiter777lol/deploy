import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import { authApi } from '../api'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await authApi.login(formData)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      dispatch(login(user))
      toast.success('Добро пожаловать!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при входе')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#89CFF0]/30 p-8">
          <h1 className="text-2xl font-light text-[#1e3a5f] mb-8 text-center">Вход</h1>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#89CFF0] mb-1">EMAIL</label>
              <input
                type="email"
                required
                className="input"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-[#89CFF0] mb-1">ПАРОЛЬ</label>
              <input
                type="password"
                required
                className="input"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            
            <button type="submit" className="btn-primary w-full mt-6">
              Войти
            </button>
            
            <div className="text-center text-xs text-[#89CFF0] pt-4">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-[#FF6B6B] hover:underline">
                Зарегистрироваться
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
