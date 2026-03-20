import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const SortBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sort, setSort] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSort(params.get('sort') || '')
  }, [location])

  const handleSort = (value) => {
    setSort(value)
    const searchParams = new URLSearchParams(location.search)
    if (value) {
      searchParams.set('sort', value)
    } else {
      searchParams.delete('sort')
    }
    navigate(`${location.pathname}?${searchParams.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-[#89CFF0]/30 p-4">
      <h2 className="font-medium text-[#1e3a5f] mb-3">Сортировка</h2>
      <div className="space-y-2">
        <button
          onClick={() => handleSort('price_asc')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
            sort === 'price_asc' ? 'bg-[#FF6B6B] text-white' : 'text-[#1e3a5f] hover:bg-[#FFEAA7]'
          }`}
        >
          <span>По возрастанию цены</span>
          <span>↑</span>
        </button>
        <button
          onClick={() => handleSort('price_desc')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
            sort === 'price_desc' ? 'bg-[#FF6B6B] text-white' : 'text-[#1e3a5f] hover:bg-[#FFEAA7]'
          }`}
        >
          <span>По убыванию цены</span>
          <span>↓</span>
        </button>
        {sort && (
          <button
            onClick={() => handleSort('')}
            className="w-full text-xs text-[#89CFF0] hover:text-[#FF6B6B] mt-2"
          >
            Сбросить
          </button>
        )}
      </div>
    </div>
  )
}

export default SortBar
