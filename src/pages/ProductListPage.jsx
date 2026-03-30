import { useQuery } from '@tanstack/react-query'
import { useParams, useLocation } from 'react-router-dom'
import { productApi, categoryApi } from '../api'
import ProductCard from '../components/ProductCard'
import CategoryList from '../components/CategoryList'
import SortBar from '../components/SortBar'

const ProductListPage = () => {
  const { categoryId } = useParams()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get('search')
  const sort = searchParams.get('sort')

  // Получаем все категории
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then(res => res.data)
  })

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', categoryId, searchQuery, sort],
    queryFn: async () => {
      const params = {}
      
      if (categoryId && categoryId !== 'undefined') {
        // Находим категорию по числовому ID и берем её MongoDB _id
        const category = categories?.find(c => String(c.id) === categoryId || String(c._id) === categoryId)
        if (category && category._id) {
          params.categoryId = category._id  // Отправляем MongoDB ObjectId
        } else {
          // Если категория не найдена, возвращаем пустой массив
          return []
        }
      }
      if (searchQuery) {
        params.search = searchQuery
      }
      if (sort) {
        params.sort = sort
      }
      
      const response = await productApi.getAll(params)
      return response.data
    },
    enabled: !!categories // Ждем загрузки категорий
  })

  const { data: category } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => categoryApi.getById(categoryId).then(res => res.data),
    enabled: !!categoryId && categoryId !== 'undefined'
  })

  if (isLoading || !categories) return <div className="text-center py-8">Загрузка...</div>

  const categoryName = categoryId && categoryId !== 'undefined' && category ? category.name : 'Все товары'
  const searchText = searchQuery ? `Поиск: ${searchQuery}` : categoryName

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <CategoryList />
        <div className="mt-6">
          <SortBar />
        </div>
      </div>
      
      <div className="col-span-9">
        <h1 className="text-2xl font-light text-[#1e3a5f] mb-6">{searchText}</h1>
        
        {!products || products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border-2 border-[#89CFF0]/30">
            <p className="text-gray-500">Товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductListPage