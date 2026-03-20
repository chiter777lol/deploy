import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { login } from '../store/authSlice'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthDate: user?.birthDate || '',
    avatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4'
  })

  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mikhail&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Ekaterina&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=ffd5dc',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry&backgroundColor=c0aede'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedUser = { ...user, ...formData }
    dispatch(login(updatedUser))
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setIsEditing(false)
    toast.success('Профиль обновлен')
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-lg border-2 border-[#89CFF0]/30">
          <h2 className="text-xl font-light text-[#1e3a5f] mb-3">Войдите в профиль</h2>
          <p className="text-sm text-[#89CFF0] mb-6">Чтобы просматривать и редактировать данные</p>
          <Link to="/login" className="btn-primary inline-block">
            Войти
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-light text-[#1e3a5f] mb-8">Профиль</h1>
      
      <div className="bg-white rounded-2xl shadow-lg border-2 border-[#89CFF0]/30 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#b6e3f4] to-[#89CFF0]"></div>
        
        <div className="px-8 pb-8">
          <div className="flex justify-center -mt-16 mb-6">
            <div className="relative">
              <img 
                src={formData.avatar} 
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-md"
              />
            </div>
          </div>
          
          {!isEditing ? (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-medium text-[#1e3a5f] mb-1">{user.name}</h2>
                <p className="text-sm text-[#89CFF0]">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="inline-block mt-2 px-3 py-1 bg-[#FFEAA7] text-[#1e3a5f] text-xs rounded-full">Администратор</span>
                )}
              </div>
              
              <div className="space-y-4 mb-6 bg-[#f0f7ff] p-4 rounded-xl">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-[#89CFF0] w-24">Телефон:</span>
                  <span className="text-[#1e3a5f]">{user.phone || '—'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-[#89CFF0] w-24">Адрес:</span>
                  <span className="text-[#1e3a5f]">{user.address || '—'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-[#89CFF0] w-24">Дата рождения:</span>
                  <span className="text-[#1e3a5f]">{user.birthDate ? new Date(user.birthDate).toLocaleDateString('ru-RU') : '—'}</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-[#FFEAA7] text-[#1e3a5f] px-6 py-3 rounded-xl hover:bg-[#FFE48F] transition font-medium"
              >
                Редактировать профиль
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#89CFF0] mb-2">Выберите аватар</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                  {avatars.map((avatar, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({...formData, avatar})}
                      className={`rounded-full overflow-hidden border-3 transition ${
                        formData.avatar === avatar ? 'border-[#FF6B6B] scale-110' : 'border-transparent hover:border-[#89CFF0]'
                      }`}
                    >
                      <img src={avatar} alt={`avatar ${index + 1}`} className="w-full aspect-square" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#89CFF0] mb-1">Имя</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#89CFF0] mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#89CFF0] mb-1">Телефон</label>
                <input
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#89CFF0] mb-1">Адрес</label>
                <input
                  type="text"
                  className="input"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Город, улица, дом"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#89CFF0] mb-1">Дата рождения</label>
                <input
                  type="date"
                  className="input"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border-2 border-[#89CFF0] text-[#89CFF0] rounded-xl hover:bg-[#89CFF0] hover:text-white transition"
                >
                  Отмена
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
