import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi, categoryApi } from '../api'
import toast from 'react-hot-toast'

const AdminProductsPage = () => {
  const queryClient = useQueryClient()
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    available: true
  })

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getAll().then(res => res.data)
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then(res => res.data)
  })

  const createMutation = useMutation({
    mutationFn: (newProduct) => productApi.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      resetForm()
      toast.success('Товар добавлен')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => productApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      resetForm()
      setEditingProduct(null)
      toast.success('Товар обновлен')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      toast.success('Товар удален')
    }
  })

  const resetForm = () => {
    setFormData({
      name: '',
      categoryId: '',
      price: '',
      stock: '',
      description: '',
      image: '',
      available: true
    })
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock,
      description: product.description,
      image: product.image,
      available: product.available
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      categoryId: parseInt(formData.categoryId)
    }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: productData })
    } else {
      createMutation.mutate(productData)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Удалить товар?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-light text-[#1e3a5f] mb-6">Управление товарами</h1>
      
      {/* Форма добавления/редактирования */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-[#89CFF0]/30 p-6 mb-8">
        <h2 className="text-lg font-medium text-[#1e3a5f] mb-4">
          {editingProduct ? 'Редактирование товара' : 'Добавление товара'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#89CFF0] mb-1">Название</label>
              <input
                type="text"
                required
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-[#89CFF0] mb-1">Категория</label>
              <select
                required
                className="input"
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              >
                <option value="">Выберите категорию</option>
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-[#89CFF0] mb-1">Цена (₽)</label>
              <input
                type="number"
                required
                min="0"
                className="input"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-[#89CFF0] mb-1">Количество</label>
              <input
                type="number"
                required
                min="0"
                className="input"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[#89CFF0] mb-1">URL изображения</label>
              <input
                type="url"
                required
                className="input"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[#89CFF0] mb-1">Описание</label>
              <textarea
                required
                rows="3"
                className="input"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Подробное описание товара..."
              />
            </div>
            
            <div className="col-span-2">
              <label className="flex items-center gap-2 text-sm text-[#1e3a5f] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({...formData, available: e.target.checked})}
                  className="w-5 h-5"
                />
                <span>Товар доступен для продажи</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn-primary">
              {editingProduct ? 'Сохранить изменения' : 'Добавить товар'}
            </button>
            
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setEditingProduct(null)
                }}
                className="btn-outline"
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Таблица товаров */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-[#89CFF0]/30 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-[#f0f7ff]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#89CFF0] uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#89CFF0] uppercase">Наименование</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#89CFF0] uppercase">Категория</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#89CFF0] uppercase">Цена</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#89CFF0] uppercase">Кол-во</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#89CFF0] uppercase">Фото</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#89CFF0] uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#89CFF0]/30">
            {products?.map(product => {
              const category = categories?.find(c => c.id === product.categoryId)
              return (
                <tr key={product.id} className="hover:bg-[#f0f7ff] transition">
                  <td className="px-6 py-4 text-sm text-[#1e3a5f]">{product.id}</td>
                  <td className="px-6 py-4 text-sm text-[#1e3a5f] font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-[#1e3a5f]">
                    <span className="bg-[#FFEAA7] px-2 py-1 rounded-full text-xs">
                      {category?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#FF6B6B] font-bold">{product.price} ₽</td>
                  <td className="px-6 py-4 text-sm text-[#1e3a5f]">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.stock > 10 ? 'bg-[#b6e3f4]' : 'bg-[#FFEAA7]'
                    }`}>
                      {product.stock} шт.
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-10 h-10 object-cover rounded-lg border-2 border-[#89CFF0]/30"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'https://api.dicebear.com/7.x/icons/svg?icon=image&backgroundColor=f0f7ff'
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-[#89CFF0] hover:text-[#FF6B6B] transition text-lg"
                        title="Редактировать"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-[#FF6B6B] hover:text-[#FF5252] transition text-lg"
                        title="Удалить"
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        
        {products?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#89CFF0]">Нет товаров. Добавьте первый товар!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProductsPage
