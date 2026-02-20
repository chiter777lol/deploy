import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">ID: {product.id}</div>
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <div className="text-xl font-bold text-blue-600 mb-4">
          {product.price.toLocaleString()} ₽
        </div>
        <div className="flex gap-2">
          <Link 
            to={`/product/${product.id}`}
            className="flex-1 btn-secondary text-center"
          >
            Открыть карточку
          </Link>
          <button
            onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
            className="btn-primary"
          >
            Купить
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
