import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { api } from '../api'
import { addToCart } from '../store/cartSlice'

const ProductDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1)
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(id).then(res => res.data)
  })

  if (isLoading) return <div className="text-center py-8">Загрузка...</div>
  if (!product) return <div className="text-center py-8">Товар не найден</div>

  return (
    <div>
      {/* Путь к товару (хлебные крошки) */}
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:underline">Главная</Link> / 
        <Link to="/products" className="hover:underline">Товары</Link> / 
        <span className="text-gray-700"> {product.name}</span>
      </div>

      <div className="grid grid-cols-2 gap-8 bg-white rounded-lg shadow p-6">
        {/* Фото */}
        <div>
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>
        
        {/* Информация о товаре */}
        <div>
          <div className="text-sm text-gray-500 mb-2">ID товара: {product.id}</div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="text-3xl font-bold text-blue-600 mb-6">
            {product.price.toLocaleString()} ₽
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Описание:</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Количество:</h3>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-24 input-field text-center"
              />
              <span className="text-sm text-gray-500">
                Доступно: {product.stock} шт.
              </span>
            </div>
          </div>
          
          <button
            onClick={() => dispatch(addToCart({ product, quantity }))}
            className="btn-primary text-xl px-8 py-3"
          >
            Купить
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
