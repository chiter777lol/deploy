import { useQuery } from '@tanstack/react-query'
import { useParams, useLocation } from 'react-router-dom'
import { api } from '../api'
import ProductCard from '../components/ProductCard'
import CategoryList from '../components/CategoryList'
import SortBar from '../components/SortBar'

const ProductListPage = () => {
  const { categoryId } = useParams()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get('search')
  const sort = searchParams.get('sort')

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', categoryId, searchQuery, sort],
    queryFn: async () => {
      let params = {}
      
      if (categoryId) {
        params.categoryId = categoryId
      }
      
      let data = await api.getProducts(params).then(res => res.data)
      
      // Поиск по названию
      if (searchQuery) {
        data = data.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      // Сортировка по цене
      if (sort === 'price_asc') {
        data.sort((a, b) => a.price - b.price)
      } else if (sort === 'price_desc') {
        data.sort((a, b) => b.price - a.price)
      }
      
      return data
    }
  })

  const { data: category } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => api.getCategory(categoryId).then(res => res.data),
    enabled: !!categoryId
  })

  if (isLoading) return <div className="text-center py-8">Загрузка...</div>

  return (
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
        <h1 className="text-2xl font-bold mb-6">
          {categoryId ? category?.name : searchQuery ? `Поиск: ${searchQuery}` : 'Все товары'}
        </h1>
        
        {products?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">Товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {products?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductListPage
