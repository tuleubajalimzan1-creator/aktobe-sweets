import { Link } from 'react-router-dom'
import useOrdersStore from '../../store/useOrdersStore'
import useAuthStore from '../../store/useAuthStore'
import { ORDER_STATUSES } from '../../constants/mockData'

export default function OrdersPage() {
  const { user } = useAuthStore()
  const orders = useOrdersStore((s) => s.orders)

  if (!user) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔒</div>
        <p className="text-gray-500 mb-4">Войдите чтобы видеть заказы</p>
        <Link to="/login" className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold">
          Войти
        </Link>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-gray-500 mb-4">У вас пока нет заказов</p>
        <Link to="/catalog" className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold">
          Перейти в каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Мои заказы</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = ORDER_STATUSES[order.status]
          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-gray-800">{order.id}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                  {status.label}
                </span>
              </div>

              <div className="border-t border-gray-50 pt-3 space-y-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString()} ₸</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="text-xs text-gray-400">
                  {order.delivery === 'delivery' ? `🚗 ${order.address}` : '🏪 Самовывоз'}
                </div>
                <span className="font-bold text-pink-500">{order.total.toLocaleString()} ₸</span>
              </div>

              {/* Прогресс статуса */}
              <StatusBar status={order.status} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']

function StatusBar({ status }) {
  const currentIndex = STATUS_FLOW.indexOf(status)
  if (status === 'cancelled') {
    return <p className="text-xs text-red-400 text-center">Заказ отменён</p>
  }
  return (
    <div className="flex gap-1 items-center">
      {STATUS_FLOW.map((s, i) => (
        <div
          key={s}
          className={`flex-1 h-1 rounded-full ${
            i <= currentIndex ? 'bg-pink-400' : 'bg-gray-100'
          }`}
        />
      ))}
    </div>
  )
}
