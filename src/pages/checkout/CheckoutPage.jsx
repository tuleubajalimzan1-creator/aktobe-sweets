import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useCartStore from '../../store/useCartStore'
import useAuthStore from '../../store/useAuthStore'
import useOrdersStore from '../../store/useOrdersStore'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const addOrder = useOrdersStore((s) => s.addOrder)
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    delivery: 'delivery',
    address: '',
    comment: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    addOrder({ ...form, items, total, userId: user?.id })
    clearCart()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-24 max-w-md mx-auto">
        <div className="text-7xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Заказ принят!</h2>
        <p className="text-gray-400 mb-6">
          Мы свяжемся с вами по номеру телефона для подтверждения заказа.
        </p>
        <button
          onClick={() => navigate('/orders')}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full transition"
        >
          Мои заказы
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Оформление заказа</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Контактные данные */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Контактные данные</h2>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Имя</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ваше имя"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Телефон</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+7 700 000 00 00"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 transition"
            />
          </div>
        </div>

        {/* Способ получения */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Способ получения</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'delivery', label: '🚗 Доставка', sub: 'По городу Актобе' },
              { value: 'pickup', label: '🏪 Самовывоз', sub: 'Из заведения' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, delivery: opt.value })}
                className={`p-4 rounded-xl border-2 text-left transition ${
                  form.delivery === opt.value
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                <p className="font-medium text-sm">{opt.label}</p>
                <p className="text-xs text-gray-400 mt-1">{opt.sub}</p>
              </button>
            ))}
          </div>

          {form.delivery === 'delivery' && (
            <div>
              <label className="block text-sm text-gray-500 mb-1">Адрес доставки</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Улица, дом, квартира"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-500 mb-1">Комментарий (необязательно)</label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Пожелания к заказу..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 transition resize-none"
            />
          </div>
        </div>

        {/* Итог */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="font-semibold text-gray-700">Ваш заказ</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-gray-600">
              <span>{item.name} × {item.quantity}</span>
              <span>{(item.price * item.quantity).toLocaleString()} ₸</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
            <span>Итого</span>
            <span className="text-pink-500">{total.toLocaleString()} ₸</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 rounded-2xl text-lg transition"
        >
          Подтвердить заказ
        </button>
      </form>
    </div>
  )
}
