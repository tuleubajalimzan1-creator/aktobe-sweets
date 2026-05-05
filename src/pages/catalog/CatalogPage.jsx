import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCTS, CATEGORIES } from '../../constants/mockData'
import useCartStore from '../../store/useCartStore'

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState({})

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleAdd = (product) => {
    addItem(product)
    setAdded((prev) => ({ ...prev, [product.id]: true }))
    setTimeout(() => setAdded((prev) => ({ ...prev, [product.id]: false })), 1500)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Каталог</h1>

      {/* Поиск */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск по названию..."
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 transition"
      />

      {/* Категории */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === c.id
                ? 'bg-pink-500 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-pink-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Сетка товаров */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🔍</div>
          <p>Ничего не найдено</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{product.venue}</p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-gray-800 hover:text-pink-500 transition mb-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-pink-500 font-bold text-lg">
                    {product.price.toLocaleString()} ₸
                  </span>
                  <span className="text-xs text-gray-400">⭐ {product.rating}</span>
                </div>
                <button
                  onClick={() => handleAdd(product)}
                  className={`mt-3 w-full py-2 rounded-xl text-sm font-semibold transition ${
                    added[product.id]
                      ? 'bg-green-100 text-green-600'
                      : 'bg-pink-50 hover:bg-pink-500 hover:text-white text-pink-500'
                  }`}
                >
                  {added[product.id] ? '✓ Добавлено' : 'В корзину'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
