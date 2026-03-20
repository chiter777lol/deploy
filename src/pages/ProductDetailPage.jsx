import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { productApi } from '../api'
import { addToCart } from '../store/cartSlice'
import ProductCard from '../components/ProductCard'

const ProductDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1)
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getById(id).then(res => res.data)
  })

  const { data: relatedProducts } = useQuery({
    queryKey: ['relatedProducts', product?.categoryId?._id || product?.categoryId],
    queryFn: () => productApi.getAll({ categoryId: product?.categoryId?._id || product?.categoryId, _limit: 4 }).then(res => res.data),
    enabled: !!product?.categoryId
  })

  if (isLoading) return <div className="text-center py-12">Загрузка...</div>
  if (!product) return <div className="text-center py-12">Товар не найден</div>

  const productId = product._id || product.id

  return (
    <div>
      <div className="text-xs text-gray-400 mb-6">
        <Link to="/" className="hover:text-gray-600">Главная</Link> / 
        <Link to="/products" className="hover:text-gray-600">Каталог</Link> / 
        <span className="text-gray-600"> {product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 bg-white rounded-2xl shadow-lg border-2 border-[#89CFF0]/30 p-8">
        <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#f0f7ff]">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div>
          <div className="text-sm text-[#89CFF0] mb-2">Арт. {productId}</div>
          <h1 className="text-3xl font-light text-[#1e3a5f] mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-bold text-[#FF6B6B]">
              {product.price.toLocaleString()} ₽
            </span>
            <span className="text-sm text-[#89CFF0]">
              ★ {product.rating} · {product.reviews} отзывов
            </span>
          </div>
          
          <div className="prose prose-sm text-gray-600 mb-8">
            <p>{product.description}</p>
          </div>
          
          <div className="mb-8">
            <label className="block text-xs font-medium text-[#89CFF0] mb-2">КОЛИЧЕСТВО</label>
            <div className="flex items-center gap-3">
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="input w-24"
              >
                {[...Array(Math.min(10, product.stock))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <span className="text-xs text-[#89CFF0]">
                В наличии: {product.stock} шт.
              </span>
            </div>
          </div>
          
          <button
            onClick={() => dispatch(addToCart({ product: {...product, id: productId}, quantity }))}
            className="btn-primary w-full py-4 text-base"
          >
            Добавить в корзину
          </button>
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-light text-[#1e3a5f] mb-6">Похожие товары</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts
              .filter(p => (p._id || p.id) !== productId)
              .slice(0, 4)
              .map(p => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
