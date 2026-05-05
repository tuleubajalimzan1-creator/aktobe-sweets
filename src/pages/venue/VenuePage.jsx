import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import useOrdersStore from '../../store/useOrdersStore'
import { ORDER_STATUSES } from '../../constants/mockData'

const NEXT_STATUS = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'delivered',
}

export default function VenuePage() {
  const { user, role } = useAuthStore()
  const navigate = useNavigate()
  const { orders, updateStatus } = useOrdersStore()

  if (!user || role !== 'venue') {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔒</div>
        <p className="text-gray-500">Доступ только для заведений</p>
      </div>
    )
  }

  const active = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
  const done = orders.filter((o) => o.status === 'delivered' || o.status === 'cancelled')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Панель заведения</h1>
        <span className="bg-pink-100 text-pink-600 text-sm font-semibold px-3 py-1 rounded-full">
          {active.length} активных
        </span>
      </div>

      {/* Активные заказы */}
      <section>
        <h2 className="font-semibold text-gray-600 mb-3">Активные заказы</h2>
        {active.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
            Новых заказов нет
          </div>
        ) : (
          <div className="space-y-3">
            {active.map((order) => (
              <OrderCard key={order.id} order={order} onUpdate={updateStatus} />
            ))}
          </div>
        )}
      </section>

      {/* Выполненные */}
      {done.length > 0 && (
        <section>
          <h2 className="font-semibold text-gray-600 mb-3">Завершённые</h2>
          <div className="space-y-3">
            {done.map((order) => (
              <OrderCard key={order.id} order={order} onUpdate={updateStatus} done />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function OrderCard({ order, onUpdate, done }) {
  const status = ORDER_STATUSES[order.status]
  const nextStatus = NEXT_STATUS[order.status]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-gray-800">{order.id}</p>
          <p className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleString('ru-RU', {
              day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>👤 {order.name} · {order.phone}</p>
        <p>{order.delivery === 'delivery' ? `🚗 ${order.address}` : '🏪 Самовывоз'}</p>
      </div>

      <div className="border-t border-gray-50 pt-3 space-y-1">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-600">{item.name} × {item.quantity}</span>
            <span className="font-medium">{(item.price * item.quantity).toLocaleString()} ₸</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-pink-500 pt-1 border-t border-gray-50">
          <span>Итого</span>
          <span>{order.total.toLocaleString()} ₸</span>
        </div>
      </div>

      {!done && nextStatus && (
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate(order.id, nextStatus)}
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold py-2 rounded-xl transition"
          >
            {ORDER_STATUSES[nextStatus].label} →
          </button>
          <button
            onClick={() => onUpdate(order.id, 'cancelled')}
            className="px-4 border border-red-200 text-red-400 hover:bg-red-50 text-sm rounded-xl transition"
          >
            Отменить
          </button>
        </div>
      )}
    </div>
  )
}
