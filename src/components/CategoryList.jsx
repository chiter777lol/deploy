import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api'

const CategoryList = () => {
  const { categoryId } = useParams()
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories().then(res => res.data)
  })

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold text-lg mb-4">Категории</h2>
      <div className="space-y-2">
        <Link
          to="/products"
          className={`block px-3 py-2 rounded hover:bg-gray-100 ${
            !categoryId ? 'bg-blue-50 text-blue-600' : ''
          }`}
        >
          Все товары
        </Link>
        {categories?.map(category => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className={`block px-3 py-2 rounded hover:bg-gray-100 ${
              Number(categoryId) === category.id ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoryList
