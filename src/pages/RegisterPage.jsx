import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import { authApi } from '../api'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Пароли не совпадают')
      return
    }
    
    try {
      const response = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      dispatch(login(user))
      toast.success('Регистрация успешна!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при регистрации')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#89CFF0]/30 p-8">
          <h1 className="text-2xl font-light text-[#1e3a5f] mb-8 text-center">Регистрация</h1>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#89CFF0] mb-1">ИМЯ</label>
              <input
                type="text"
                required
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
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
            
            <div>
              <label className="block text-xs font-medium text-[#89CFF0] mb-1">ПОДТВЕРДИТЕ ПАРОЛЬ</label>
              <input
                type="password"
                required
                className="input"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
            
            <button type="submit" className="btn-primary w-full mt-6">
              Зарегистрироваться
            </button>
            
            <div className="text-center text-xs text-[#89CFF0] pt-4">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-[#FF6B6B] hover:underline">
                Войти
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
