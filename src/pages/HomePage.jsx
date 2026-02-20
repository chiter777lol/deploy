import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../api'
import ProductCard from '../components/ProductCard'
import CategoryList from '../components/CategoryList'
import SortBar from '../components/SortBar'

const HomePage = () => {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts({ _limit: 6 }).then(res => res.data)
  })

  return (
    <div>
      <div className="grid grid-cols-12 gap-6">
        {/* Категории */}
        <div className="col-span-3">
          <CategoryList />
          <div className="mt-6">
            <SortBar />
          </div>
        </div>
        
        {/* Основной контент */}
        <div className="col-span-9">
          <h1 className="text-2xl font-bold mb-6">Рекомендуемые товары</h1>
          
          {/* Товары */}
          <div className="grid grid-cols-3 gap-6">
            {products?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Ссылка на все товары */}
          <div className="text-center mt-8">
            <Link to="/products" className="btn-primary inline-block">
              Все товары
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
