import { useState } from 'react'
import useAuthStore from '../../store/useAuthStore'
import useOrdersStore from '../../store/useOrdersStore'
import { PRODUCTS, VENUES, ORDER_STATUSES } from '../../constants/mockData'

const TABS = ['Заказы', 'Товары', 'Заведения', 'Пользователи']

const DEMO_USERS = [
  { id: 1, name: 'Алия', email: 'user@demo.kz', role: 'user' },
  { id: 2, name: 'Кондитерская', email: 'venue@demo.kz', role: 'venue' },
  { id: 3, name: 'Администратор', email: 'admin@demo.kz', role: 'admin' },
]

export default function AdminPage() {
  const { user, role } = useAuthStore()
  const { orders, updateStatus } = useOrdersStore()
  const [tab, setTab] = useState(0)

  if (!user || role !== 'admin') {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔒</div>
        <p className="text-gray-500">Доступ только для администраторов</p>
      </div>
    )
  }

  const stats = [
    { icon: '📦', label: 'Всего заказов', value: orders.length },
    { icon: '🍰', label: 'Товаров', value: PRODUCTS.length },
    { icon: '🏪', label: 'Заведений', value: VENUES.length },
    { icon: '👤', label: 'Пользователей', value: DEMO_USERS.length },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Админ-панель</h1>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-800">{s.value}</div>
            <div className="text-xs text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Вкладки */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === i ? 'bg-pink-500 text-white' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Заказы */}
      {tab === 0 && (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = ORDER_STATUSES[order.status]
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-gray-800">{order.id}</span>
                    <span className="text-gray-400 text-sm ml-2">· {order.name}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {order.items.length} позиций · {order.delivery === 'delivery' ? 'Доставка' : 'Самовывоз'}
                  </span>
                  <span className="font-bold text-pink-500">{order.total.toLocaleString()} ₸</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {['pending','confirmed','preparing','ready','delivered'].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(order.id, s)}
                      className={`flex-1 text-xs py-1 rounded-lg transition border ${
                        order.status === s
                          ? 'bg-pink-500 text-white border-pink-500'
                          : 'border-gray-200 text-gray-500 hover:border-pink-300'
                      }`}
                    >
                      {ORDER_STATUSES[s].label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Товары */}
      {tab === 1 && (
        <div className="space-y-3">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-center">
              <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                <p className="text-xs text-gray-400">{p.venue}</p>
              </div>
              <span className="font-bold text-pink-500">{p.price.toLocaleString()} ₸</span>
            </div>
          ))}
        </div>
      )}

      {/* Заведения */}
      {tab === 2 && (
        <div className="space-y-3">
          {VENUES.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <span className="text-3xl">🏪</span>
              <div>
                <p className="font-semibold text-gray-800">{v.name}</p>
                <p className="text-xs text-gray-400">
                  {PRODUCTS.filter((p) => p.venue === v.name).length} товаров
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Пользователи */}
      {tab === 3 && (
        <div className="space-y-3">
          {DEMO_USERS.map((u) => (
            <div key={u.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <span className="text-3xl">
                {u.role === 'admin' ? '🔑' : u.role === 'venue' ? '🏪' : '👤'}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{u.name}</p>
                <p className="text-xs text-gray-400">{u.email}</p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                {u.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
