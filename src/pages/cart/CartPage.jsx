import { Link } from 'react-router-dom'
import useCartStore from '../../store/useCartStore'

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore()
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Корзина пуста</h2>
        <p className="text-gray-400 mb-6">Добавьте что-нибудь вкусное</p>
        <Link
          to="/catalog"
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full transition"
        >
          Перейти в каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Корзина</h1>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-center"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
            )}
            {!item.image && (
              <div className="w-16 h-16 rounded-xl bg-pink-50 flex items-center justify-center text-3xl flex-shrink-0">
                🎂
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
              <p className="text-pink-500 font-bold mt-1">{item.price.toLocaleString()} ₸</p>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="text-gray-400 hover:text-pink-500 font-bold w-5 text-center"
              >
                −
              </button>
              <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="text-gray-400 hover:text-pink-500 font-bold w-5 text-center"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-300 hover:text-red-400 transition text-xl ml-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Итог */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Товаров: {items.reduce((s, i) => s + i.quantity, 0)} шт.</span>
        </div>
        <div className="flex justify-between font-bold text-xl border-t border-gray-100 pt-3">
          <span>Итого</span>
          <span className="text-pink-500">{total.toLocaleString()} ₸</span>
        </div>
        <Link
          to="/checkout"
          className="block w-full bg-pink-500 hover:bg-pink-600 text-white text-center font-semibold py-4 rounded-2xl transition"
        >
          Оформить заказ
        </Link>
        <Link
          to="/catalog"
          className="block w-full text-center text-gray-400 hover:text-gray-600 text-sm py-2"
        >
          Продолжить покупки
        </Link>
      </div>
    </div>
  )
}
