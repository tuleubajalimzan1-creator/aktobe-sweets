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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="mb-10">
        <p className="text-pink-400 tracking-[0.15em] uppercase text-xs font-medium mb-3">Все позиции</p>
        <h1 className="serif text-3xl md:text-4xl font-semibold text-stone-900">Каталог</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию..."
          className="flex-1 border border-stone-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-pink-400 transition bg-white tracking-wide"
        />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-5 py-3 rounded-2xl text-sm font-medium transition tracking-wide ${
                activeCategory === c.id
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-500 hover:border-pink-300 hover:text-pink-500'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-stone-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="tracking-wide">Ничего не найдено</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-stone-100 hover:shadow-lg transition-all duration-300 group">
              <Link to={`/product/${product.id}`}>
                <div className="overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              </Link>
              <div className="p-6">
                <p className="text-stone-400 text-xs tracking-[0.15em] uppercase mb-2">{product.venue}</p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="serif font-semibold text-stone-800 text-xl hover:text-pink-500 transition-colors mb-2 leading-tight">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-stone-400 text-sm mb-4 leading-relaxed line-clamp-2" style={{ fontWeight: 300 }}>
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-pink-500 font-semibold text-xl">{product.price.toLocaleString()} ₸</span>
                  <span className="text-stone-300 text-sm">⭐ {product.rating}</span>
                </div>
                <button
                  onClick={() => handleAdd(product)}
                  className={`w-full py-2.5 rounded-2xl text-sm font-medium transition-all tracking-wide ${
                    added[product.id]
                      ? 'bg-green-50 text-green-600 border border-green-200'
                      : 'bg-stone-50 hover:bg-pink-500 hover:text-white text-stone-600 border border-stone-100'
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
