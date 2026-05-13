import { useState } from 'react'
import useAuthStore from '../../store/useAuthStore'
import useOrdersStore from '../../store/useOrdersStore'
import { PRODUCTS, VENUES, ORDER_STATUSES } from '../../constants/mockData'

const TABS = ['Заказы', 'Тендеры', 'Товары', 'Заведения', 'Пользователи']

const DEMO_USERS = [
  { id: 1, name: 'Алия', email: 'user@demo.kz', role: 'user', orders: 3 },
  { id: 2, name: 'Кондитерская', email: 'venue@demo.kz', role: 'venue', orders: 0 },
  { id: 3, name: 'Администратор', email: 'admin@demo.kz', role: 'admin', orders: 0 },
]

export default function AdminPage() {
  const { user, role } = useAuthStore()
  const { orders, updateStatus } = useOrdersStore()
  const [tab, setTab] = useState(0)

  if (!user || role !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🔒</div>
        <p style={{ color: '#a8a29e' }}>Доступ только для администраторов</p>
      </div>
    )
  }

  const directOrders = orders.filter((o) => o.type !== 'tender')
  const tenderOrders = orders.filter((o) => o.type === 'tender')
  const revenue = directOrders.filter((o) => o.status === 'delivered').reduce((s, o) => s + o.total, 0)
  const tenderRevenue = tenderOrders.filter((o) => o.acceptedBidId).reduce((s, o) => s + o.total, 0)

  const stats = [
    { icon: '📦', label: 'Прямых заказов', value: directOrders.length, sub: `${directOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length} активных` },
    { icon: '🏆', label: 'Тендеров', value: tenderOrders.length, sub: `${tenderOrders.filter((o) => o.status === 'bidding').length} в торгах` },
    { icon: '💰', label: 'Выручка', value: `${(revenue + tenderRevenue).toLocaleString()} ₸`, sub: 'доставленные заказы' },
    { icon: '🏪', label: 'Заведений', value: VENUES.length, sub: `${PRODUCTS.length} товаров` },
  ]

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
      <p style={{ color: '#f472b6', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 10, marginBottom: 8 }}>Управление</p>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: '#1c1917', marginBottom: 28 }}>
        Админ-панель
      </h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: 18, border: '1px solid #f0ede8', padding: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1c1917', marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#1c1917', fontWeight: 600, marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: '#a8a29e' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            style={{
              padding: '8px 18px',
              borderRadius: 99,
              border: `1px solid ${tab === i ? '#1c1917' : '#e7e5e4'}`,
              backgroundColor: tab === i ? '#1c1917' : '#fff',
              color: tab === i ? '#fff' : '#78716c',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Заказы */}
      {tab === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {directOrders.length === 0 ? (
            <Empty>Нет прямых заказов</Empty>
          ) : (
            directOrders.map((order) => <AdminOrderCard key={order.id} order={order} onUpdate={updateStatus} />)
          )}
        </div>
      )}

      {/* Тендеры */}
      {tab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tenderOrders.length === 0 ? (
            <Empty>Нет тендеров</Empty>
          ) : (
            tenderOrders.map((order) => {
              const status = ORDER_STATUSES[order.status] || { label: order.status, color: 'text-gray-600 bg-gray-100' }
              const bestBid = order.bids?.length > 0 ? [...order.bids].sort((a, b) => a.price - b.price)[0] : null
              const acceptedBid = order.bids?.find((b) => b.id === order.acceptedBidId)

              return (
                <div key={order.id} style={{ backgroundColor: '#fff', borderRadius: 18, border: '1px solid #f0ede8', padding: '18px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#7c3aed', background: '#f3e8ff', padding: '2px 7px', borderRadius: 99 }}>ТЕНДЕР</span>
                        <span style={{ fontWeight: 700, color: '#1c1917' }}>{order.id}</span>
                        <span style={{ fontSize: 12, color: '#a8a29e' }}>· {order.name}</span>
                      </div>
                      <p style={{ fontSize: 11, color: '#a8a29e' }}>
                        {new Date(order.createdAt).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99 }} className={status.color}>
                      {status.label}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: '#78716c', marginBottom: 12 }}>
                    <span>🏷️ Ставок: {order.bids?.length || 0}</span>
                    <span>💰 Ориент.: {order.estimatedPrice?.toLocaleString() || order.total.toLocaleString()} ₸</span>
                    {bestBid && <span>📉 Лучшая: {bestBid.price.toLocaleString()} ₸ ({bestBid.venueName})</span>}
                    {acceptedBid && <span style={{ color: '#059669', fontWeight: 600 }}>✓ Принята: {acceptedBid.venueName}</span>}
                  </div>

                  {order.bids?.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {[...order.bids].sort((a, b) => a.price - b.price).map((bid) => (
                        <div key={bid.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 10px', borderRadius: 8, backgroundColor: bid.id === order.acceptedBidId ? '#f0fdf4' : '#faf8f4' }}>
                          <span style={{ color: '#57534e' }}>{bid.venueName}</span>
                          <span style={{ fontWeight: 700, color: bid.id === order.acceptedBidId ? '#059669' : '#1c1917' }}>{bid.price.toLocaleString()} ₸</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Товары */}
      {tab === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PRODUCTS.map((p) => (
            <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #f0ede8', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <img src={p.image} alt={p.name} style={{ width: 50, height: 50, borderRadius: 10, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: '#1c1917', fontSize: 14, marginBottom: 2 }}>{p.name}</p>
                <p style={{ fontSize: 12, color: '#a8a29e' }}>{p.venue} · ⭐ {p.rating}</p>
              </div>
              <span style={{ fontWeight: 700, color: '#ec4899', fontSize: 16 }}>{p.price.toLocaleString()} ₸</span>
            </div>
          ))}
        </div>
      )}

      {/* Заведения */}
      {tab === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {VENUES.map((v) => (
            <div key={v.id} style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #f0ede8', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 28 }}>🏪</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: '#1c1917', marginBottom: 2 }}>{v.name}</p>
                <p style={{ fontSize: 12, color: '#a8a29e' }}>{PRODUCTS.filter((p) => p.venue === v.name).length} товаров в каталоге</p>
              </div>
              <span style={{ fontSize: 11, backgroundColor: '#f0fdf4', color: '#059669', padding: '4px 10px', borderRadius: 99, fontWeight: 600 }}>
                Активно
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Пользователи */}
      {tab === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DEMO_USERS.map((u) => (
            <div key={u.id} style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #f0ede8', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: u.role === 'admin' ? '#f3e8ff' : u.role === 'venue' ? '#dbeafe' : '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                {u.role === 'admin' ? '🔑' : u.role === 'venue' ? '🏪' : '👤'}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: '#1c1917', marginBottom: 2 }}>{u.name}</p>
                <p style={{ fontSize: 12, color: '#a8a29e' }}>{u.email}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 600,
                  backgroundColor: u.role === 'admin' ? '#f3e8ff' : u.role === 'venue' ? '#dbeafe' : '#fdf2f8',
                  color: u.role === 'admin' ? '#7c3aed' : u.role === 'venue' ? '#2563eb' : '#ec4899',
                }}>
                  {u.role}
                </span>
                {u.orders > 0 && <p style={{ fontSize: 11, color: '#a8a29e', marginTop: 3 }}>{u.orders} заказов</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AdminOrderCard({ order, onUpdate }) {
  const status = ORDER_STATUSES[order.status] || { label: order.status, color: 'text-gray-600 bg-gray-100' }
  const statusKeys = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 18, border: '1px solid #f0ede8', padding: '16px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div>
          <span style={{ fontWeight: 700, color: '#1c1917' }}>{order.id}</span>
          <span style={{ color: '#a8a29e', fontSize: 13, marginLeft: 8 }}>· {order.name}</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99 }} className={status.color}>
          {status.label}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, fontSize: 13, color: '#78716c' }}>
        <span>{order.items.length} позиций · {order.delivery === 'delivery' ? 'Доставка' : 'Самовывоз'}</span>
        <span style={{ fontWeight: 700, color: '#ec4899', fontSize: 16 }}>{order.total.toLocaleString()} ₸</span>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {statusKeys.map((s) => (
          <button
            key={s}
            onClick={() => onUpdate(order.id, s)}
            style={{
              flex: 1,
              fontSize: 10,
              padding: '6px 4px',
              borderRadius: 8,
              border: `1px solid ${order.status === s ? '#1c1917' : '#e7e5e4'}`,
              backgroundColor: order.status === s ? '#1c1917' : '#fff',
              color: order.status === s ? '#fff' : '#a8a29e',
              cursor: 'pointer',
              fontWeight: order.status === s ? 700 : 400,
            }}
          >
            {ORDER_STATUSES[s].label.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  )
}

function Empty({ children }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px', color: '#a8a29e', fontSize: 13, backgroundColor: '#fff', borderRadius: 16, border: '1px solid #f0ede8' }}>
      {children}
    </div>
  )
}
