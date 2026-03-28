import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { categoryApi } from '../api'

const CategoryList = () => {
  const { categoryId } = useParams()
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then(res => res.data)
  })

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-[#89CFF0]/30 p-4">
      <h2 className="font-medium text-[#1e3a5f] mb-3">Категории</h2>
      <div className="space-y-1">
        <Link
          to="/products"
          className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
            !categoryId || categoryId === 'undefined'
              ? 'bg-[#FF6B6B] text-white font-medium' 
              : 'text-[#1e3a5f] hover:bg-[#FFEAA7]'
          }`}
        >
          Все товары
        </Link>
        {categories?.map(category => (
          <Link
            key={category._id}
            to={`/category/${category._id}`}
            className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
              categoryId === category._id 
                ? 'bg-[#FF6B6B] text-white font-medium' 
                : 'text-[#1e3a5f] hover:bg-[#FFEAA7]'
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
