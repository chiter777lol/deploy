import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import { api } from '../api'
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
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user'
      }
      
      const response = await api.register(newUser)
      dispatch(login(response.data))
      toast.success('Регистрация успешна')
      navigate('/')
    } catch (error) {
      toast.error('Ошибка при регистрации')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Регистрация</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Имя</label>
          <input
            type="text"
            required
            className="input-field"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            className="input-field"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Пароль</label>
          <input
            type="password"
            required
            className="input-field"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Подтверждение пароля</label>
          <input
            type="password"
            required
            className="input-field"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />
        </div>
        
        <button type="submit" className="btn-primary w-full">
          Зарегистрироваться
        </button>
        
        <div className="text-center text-sm text-gray-600">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Войти
          </Link>
        </div>
      </form>
    </div>
  )
}

export default RegisterPage
