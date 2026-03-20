import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { categoryApi, productApi } from '../api'
import ProductCard from '../components/ProductCard'

const HomePage = () => {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getAll({ _limit: 8 }).then(res => res.data)
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then(res => res.data)
  })

  return (
    <div>
      {/* Hero секция */}
      <div className="mb-16">
        <div className="h-[60vh] rounded-3xl overflow-hidden relative bg-gradient-to-br from-[#fef9c3] to-[#dbeafe] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-light text-[#1e3a5f] mb-4">MODA</h1>
            <p className="text-lg text-[#475569] mb-8">Искусство быть собой</p>
            <Link to="/products" className="btn-primary inline-block">
              Начать покупки
            </Link>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
        </div>
      </div>

      {/* Категории */}
      <div className="mb-16">
        <h2 className="text-2xl font-light text-[#1e3a5f] mb-6">Категории</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories?.map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group"
            >
              <div className="aspect-square rounded-xl overflow-hidden mb-2 relative">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <h3 className="absolute bottom-2 left-2 text-white text-sm font-medium">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Новинки */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-light text-[#1e3a5f]">Новинки</h2>
          <Link to="/products" className="text-sm text-[#b91c1c] hover:text-[#991b1b] flex items-center gap-1">
            Все товары
            <span>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Баннер */}
      <div className="bg-gradient-to-r from-[#b91c1c] to-[#991b1b] rounded-2xl p-8 text-white text-center">
        <h3 className="text-2xl font-light mb-2">Летняя коллекция</h3>
        <p className="text-white/80 mb-4">Скидка 20% на все товары</p>
        <Link to="/products" className="inline-block bg-white text-[#b91c1c] px-8 py-3 rounded-full hover:bg-[#fef9c3] transition">
          Посмотреть
        </Link>
      </div>
    </div>
  )
}

export default HomePage
