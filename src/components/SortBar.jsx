import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const SortBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sort, setSort] = useState('')

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
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold text-lg mb-4">Сортировка по цене</h2>
      <select
        value={sort}
        onChange={(e) => handleSort(e.target.value)}
        className="input-field"
      >
        <option value="">По умолчанию</option>
        <option value="price_asc">По возрастанию (сначала недорогие)</option>
        <option value="price_desc">По убыванию (сначала дорогие)</option>
      </select>
    </div>
  )
}

export default SortBar
