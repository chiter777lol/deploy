import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  
  const productId = product._id || product.id

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#89CFF0]/30 overflow-hidden">
      <div className="aspect-[3/4] overflow-hidden bg-[#f0f7ff] relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 bg-[#FFEAA7] px-3 py-1 rounded-full text-xs font-bold text-[#1e3a5f] border-2 border-[#89CFF0]">
          ★ {product.rating}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-[#1e3a5f] mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-[#FF6B6B]">
            {product.price.toLocaleString()} ₽
          </span>
          <span className="text-xs font-medium text-[#89CFF0]">
            {product.reviews} отзывов
          </span>
        </div>
        <div className="flex gap-2">
          <Link 
            to={`/product/${productId}`}
            className="flex-1 btn-outline text-sm py-2 text-center"
          >
            Подробнее
          </Link>
          <button
            onClick={() => dispatch(addToCart({ product: {...product, id: productId}, quantity: 1 }))}
            className="btn-primary text-sm py-2 px-4"
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
