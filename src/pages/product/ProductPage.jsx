import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { PRODUCTS } from '../../constants/mockData'
import useCartStore from '../../store/useCartStore'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = PRODUCTS.find((p) => p.id === Number(id))
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <p className="text-gray-500">Товар не найден</p>
      </div>
    )
  }

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1 text-sm"
      >
        ← Назад
      </button>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-72 object-cover"
        />
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">{product.venue}</p>
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-400">⭐</span>
              <span className="text-sm text-gray-500">{product.rating} — отличный рейтинг</span>
            </div>
          </div>

          <p className="text-gray-500">{product.description}</p>

          <div className="flex items-center justify-between py-4 border-t border-gray-100">
            <span className="text-3xl font-bold text-pink-500">
              {(product.price * quantity).toLocaleString()} ₸
            </span>

            {/* Количество */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="text-gray-500 hover:text-pink-500 font-bold text-lg w-6 text-center"
              >
                −
              </button>
              <span className="font-semibold w-4 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="text-gray-500 hover:text-pink-500 font-bold text-lg w-6 text-center"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition ${
              added
                ? 'bg-green-100 text-green-600'
                : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
          >
            {added ? '✓ Добавлено в корзину' : 'Добавить в корзину'}
          </button>
        </div>
      </div>
    </div>
  )
}
