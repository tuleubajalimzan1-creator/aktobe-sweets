import { useState } from 'react'
import { Link } from 'react-router-dom'
import useOrdersStore from '../../store/useOrdersStore'
import useAuthStore from '../../store/useAuthStore'
import { ORDER_STATUSES } from '../../constants/mockData'

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']

export default function OrdersPage() {
  const { user } = useAuthStore()
  const { orders, acceptBid } = useOrdersStore()
  const [activeTab, setActiveTab] = useState('all')

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🔒</div>
        <p style={{ color: '#a8a29e', marginBottom: 20 }}>Войдите чтобы видеть заказы</p>
        <Link to="/login" style={{ backgroundColor: '#1c1917', color: '#fff', padding: '12px 28px', borderRadius: 99, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>
          Войти
        </Link>
      </div>
    )
  }

  const myOrders = orders.filter((o) => o.userId === user.id || o.userId === 1)
  const tenders = myOrders.filter((o) => o.type === 'tender')
  const direct = myOrders.filter((o) => o.type !== 'tender')
  const shown = activeTab === 'tender' ? tenders : activeTab === 'direct' ? direct : myOrders

  if (myOrders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>📦</div>
        <p style={{ color: '#a8a29e', marginBottom: 20 }}>У вас пока нет заказов</p>
        <Link to="/catalog" style={{ backgroundColor: '#1c1917', color: '#fff', padding: '12px 28px', borderRadius: 99, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>
          Перейти в каталог
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
      <p style={{ color: '#f472b6', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 10, marginBottom: 8 }}>История</p>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: '#1c1917', marginBottom: 24 }}>
        Мои заказы
      </h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { key: 'all', label: `Все (${myOrders.length})` },
          { key: 'tender', label: `🏆 Тендеры (${tenders.length})` },
          { key: 'direct', label: `Прямые (${direct.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '8px 18px',
              borderRadius: 99,
              border: `1px solid ${activeTab === t.key ? '#1c1917' : '#e7e5e4'}`,
              backgroundColor: activeTab === t.key ? '#1c1917' : '#fff',
              color: activeTab === t.key ? '#fff' : '#78716c',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {shown.map((order) =>
          order.type === 'tender'
            ? <TenderCard key={order.id} order={order} onAccept={acceptBid} />
            : <DirectCard key={order.id} order={order} />
        )}
      </div>
    </div>
  )
}

function TenderCard({ order, onAccept }) {
  const [expanded, setExpanded] = useState(true)

  const sortedBids = [...(order.bids || [])].sort((a, b) => a.price - b.price)
  const bestBid = sortedBids[0]
  const accepted = order.bids?.find((b) => b.id === order.acceptedBidId)

  const statusColor = order.status === 'bidding'
    ? { bg: '#fef9c3', text: '#a16207' }
    : order.status === 'confirmed'
    ? { bg: '#dbeafe', text: '#1d4ed8' }
    : { bg: '#f0fdf4', text: '#15803d' }

  const statusLabel = order.status === 'bidding' ? 'Приём ставок' : ORDER_STATUSES[order.status]?.label || order.status

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 20, border: '1px solid #f0ede8', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', background: '#f3e8ff', padding: '2px 8px', borderRadius: 99 }}>
              ТЕНДЕР
            </span>
            <span style={{ fontWeight: 700, color: '#1c1917', fontSize: 15 }}>{order.id}</span>
          </div>
          <p style={{ fontSize: 12, color: '#a8a29e' }}>
            {new Date(order.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99, backgroundColor: statusColor.bg, color: statusColor.text }}>
          {statusLabel}
        </span>
      </div>

      {/* Items */}
      <div style={{ padding: '0 22px 14px', borderBottom: '1px solid #f0ede8' }}>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#78716c' }}>
            <span>{item.name}</span>
            <span style={{ color: '#a8a29e' }}>~{item.price.toLocaleString()} ₸</span>
          </div>
        ))}
        {order.cakeDetails && (
          <div style={{ marginTop: 8, padding: '10px 12px', backgroundColor: '#faf8f4', borderRadius: 10, fontSize: 11, color: '#a8a29e', lineHeight: 1.7 }}>
            {order.cakeDetails.base && <span>Основа: {order.cakeDetails.base} · </span>}
            {order.cakeDetails.filling && <span>Начинка: {order.cakeDetails.filling} · </span>}
            {order.cakeDetails.size && <span>Размер: {order.cakeDetails.size}</span>}
          </div>
        )}
      </div>

      {/* Bids section */}
      <div style={{ padding: '14px 22px' }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1c1917', padding: 0, marginBottom: expanded ? 12 : 0 }}
        >
          🏷️ Ставки ({order.bids?.length || 0})
          <span style={{ fontSize: 10, color: '#a8a29e', fontWeight: 400 }}>{expanded ? '▲' : '▼'}</span>
        </button>

        {expanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {order.bids?.length === 0 ? (
              <p style={{ fontSize: 13, color: '#a8a29e', textAlign: 'center', padding: '16px 0' }}>
                Пока нет ставок. Кондитерские скоро предложат цены.
              </p>
            ) : (
              sortedBids.map((bid, i) => {
                const isAccepted = bid.id === order.acceptedBidId
                const isBest = i === 0 && order.status === 'bidding'

                return (
                  <div
                    key={bid.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      borderRadius: 14,
                      border: `1.5px solid ${isAccepted ? '#a7f3d0' : isBest ? '#fbcfe8' : '#f0ede8'}`,
                      backgroundColor: isAccepted ? '#f0fdf4' : isBest ? '#fdf2f8' : '#faf8f4',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1c1917' }}>{bid.venueName}</span>
                        {isBest && !isAccepted && (
                          <span style={{ fontSize: 10, color: '#ec4899', backgroundColor: '#fce7f3', padding: '1px 6px', borderRadius: 99, fontWeight: 600 }}>
                            Лучшая цена
                          </span>
                        )}
                        {isAccepted && (
                          <span style={{ fontSize: 10, color: '#059669', backgroundColor: '#d1fae5', padding: '1px 6px', borderRadius: 99, fontWeight: 600 }}>
                            ✓ Принята
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 11, color: '#a8a29e', marginTop: 2 }}>
                        {new Date(bid.createdAt).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 700, color: isBest ? '#ec4899' : '#57534e' }}>
                      {bid.price.toLocaleString()} ₸
                    </span>
                    {order.status === 'bidding' && !isAccepted && (
                      <button
                        onClick={() => onAccept(order.id, bid.id)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 10,
                          border: 'none',
                          backgroundColor: isBest ? '#ec4899' : '#1c1917',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Принять
                      </button>
                    )}
                  </div>
                )
              })
            )}

            {order.status === 'bidding' && order.bids?.length > 0 && (
              <p style={{ fontSize: 11, color: '#a8a29e', textAlign: 'center', marginTop: 4 }}>
                Сохраняйте сумму — после принятия ставки заказ уйдёт в работу
              </p>
            )}
          </div>
        )}
      </div>

      {/* Accepted summary */}
      {accepted && (
        <div style={{ margin: '0 22px 18px', padding: '12px 16px', borderRadius: 14, backgroundColor: '#f0fdf4', border: '1px solid #a7f3d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>Заказ размещён в {accepted.venueName}</p>
            <StatusBar status={order.status} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#059669' }}>{accepted.price.toLocaleString()} ₸</span>
        </div>
      )}
    </div>
  )
}

function DirectCard({ order }) {
  const status = ORDER_STATUSES[order.status] || { label: order.status, color: 'text-gray-600 bg-gray-100' }

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 20, border: '1px solid #f0ede8', padding: '18px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <p style={{ fontWeight: 700, color: '#1c1917', fontSize: 15 }}>{order.id}</p>
          <p style={{ fontSize: 12, color: '#a8a29e' }}>
            {new Date(order.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            {order.venue && ` · ${order.venue}`}
          </p>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 99 }} className={status.color}>
          {status.label}
        </span>
      </div>

      <div style={{ borderTop: '1px solid #f7f5f2', paddingTop: 12, marginBottom: 12 }}>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#78716c', marginBottom: 4 }}>
            <span>{item.name} × {item.quantity}</span>
            <span>{(item.price * item.quantity).toLocaleString()} ₸</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f7f5f2', paddingTop: 12, marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: '#a8a29e' }}>
          {order.delivery === 'delivery' ? `🚗 ${order.address}` : '🏪 Самовывоз'}
        </p>
        <span style={{ fontWeight: 700, color: '#ec4899', fontSize: 17 }}>{order.total.toLocaleString()} ₸</span>
      </div>

      <StatusBar status={order.status} />
    </div>
  )
}

function StatusBar({ status }) {
  const idx = STATUS_FLOW.indexOf(status)
  if (status === 'cancelled') {
    return <p style={{ fontSize: 11, color: '#ef4444', textAlign: 'center' }}>Заказ отменён</p>
  }
  if (status === 'bidding') return null
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {STATUS_FLOW.map((s, i) => (
        <div key={s} style={{ flex: 1, height: 4, borderRadius: 99, backgroundColor: i <= idx ? '#ec4899' : '#f0ede8' }} />
      ))}
    </div>
  )
}
