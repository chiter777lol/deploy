import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
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
    queryFn: () => api.getProducts().then(res => res.data)
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories().then(res => res.data)
  })

  const createMutation = useMutation({
    mutationFn: (newProduct) => api.createProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      resetForm()
      toast.success('Товар добавлен')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      resetForm()
      setEditingProduct(null)
      toast.success('Товар обновлен')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteProduct(id),
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
      <h1 className="text-3xl font-bold mb-8">Управление товарами</h1>
      
      {/* Форма добавления/редактирования */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? 'Редактирование товара' : 'Добавление товара'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Категория</label>
              <select
                required
                className="input-field"
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
              <label className="block text-sm font-medium mb-1">Цена</label>
              <input
                type="number"
                required
                min="0"
                className="input-field"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Количество</label>
              <input
                type="number"
                required
                min="0"
                className="input-field"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">URL изображения</label>
              <input
                type="url"
                required
                className="input-field"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Описание</label>
              <textarea
                required
                rows="3"
                className="input-field"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({...formData, available: e.target.checked})}
                />
                <span>Товар доступен для продажи</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              {editingProduct ? 'Сохранить' : 'Добавить'}
            </button>
            
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setEditingProduct(null)
                }}
                className="btn-secondary"
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Таблица товаров */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Наименование</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Категория</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Стоимость</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Кол-во</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Фото</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products?.map(product => {
              const category = categories?.find(c => c.id === product.categoryId)
              return (
                <tr key={product.id}>
                  <td className="px-6 py-4">{product.id}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{category?.name}</td>
                  <td className="px-6 py-4">{product.price} ₽</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminProductsPage
