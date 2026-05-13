import { useState } from 'react'
import useAuthStore from '../../store/useAuthStore'
import useOrdersStore from '../../store/useOrdersStore'
import { ORDER_STATUSES, PRODUCTS } from '../../constants/mockData'

const NEXT_STATUS = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'delivered',
}

const TABS = ['Заказы', 'Тендеры', 'Каталог', 'Сообщения']

const DEMO_MESSAGES = [
  { id: 1, from: 'Алия К.', text: 'Здравствуйте! Можете сделать безглютеновый вариант?', time: '10:24', unread: true },
  { id: 2, from: 'Марат Д.', text: 'Когда будет готов мой заказ ORD-003?', time: '09:15', unread: true },
  { id: 3, from: 'Зарина А.', text: 'Спасибо за торт! Очень вкусно 🎉', time: 'Вчера', unread: false },
]

export default function VenuePage() {
  const { user, role } = useAuthStore()
  const { orders, updateStatus, addBid } = useOrdersStore()
  const [tab, setTab] = useState(0)
  const [bidInputs, setBidInputs] = useState({})
  const [bidSent, setBidSent] = useState({})
  const [myProducts, setMyProducts] = useState(
    PRODUCTS.filter((p) => p.venue === 'Пекарня "Уют"')
  )
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' })
  const [addingProduct, setAddingProduct] = useState(false)

  if (!user || role !== 'venue') {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🔒</div>
        <p style={{ color: '#a8a29e' }}>Доступ только для заведений</p>
      </div>
    )
  }

  const activeOrders = orders.filter((o) => o.type !== 'tender' && o.status !== 'delivered' && o.status !== 'cancelled')
  const doneOrders = orders.filter((o) => o.type !== 'tender' && (o.status === 'delivered' || o.status === 'cancelled'))
  const openTenders = orders.filter((o) => o.type === 'tender' && o.status === 'bidding')
  const myBidTenders = orders.filter((o) => o.type === 'tender' && o.bids?.some((b) => b.venueId === user.id))

  const handleBid = (orderId) => {
    const price = parseInt(bidInputs[orderId])
    if (!price || price <= 0) return
    addBid(orderId, { venueId: user.id, venueName: user.name || 'Моё заведение', price })
    setBidSent((prev) => ({ ...prev, [orderId]: price }))
    setBidInputs((prev) => ({ ...prev, [orderId]: '' }))
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return
    const p = {
      id: Date.now(),
      name: newProduct.name,
      price: parseInt(newProduct.price),
      description: newProduct.description,
      category: 'pastry',
      venue: user.name || 'Моё заведение',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      rating: 5.0,
    }
    setMyProducts((prev) => [p, ...prev])
    setNewProduct({ name: '', price: '', description: '' })
    setAddingProduct(false)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={{ color: '#f472b6', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 10, marginBottom: 6 }}>Панель заведения</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: '#1c1917', margin: 0 }}>
            {user.name || 'Моё заведение'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Chip bg="#fdf2f8" color="#ec4899">{activeOrders.length} активных</Chip>
          {openTenders.length > 0 && <Chip bg="#f3e8ff" color="#7c3aed">{openTenders.length} тендеров</Chip>}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            style={{
              padding: '8px 20px',
              borderRadius: 99,
              border: `1px solid ${tab === i ? '#1c1917' : '#e7e5e4'}`,
              backgroundColor: tab === i ? '#1c1917' : '#fff',
              color: tab === i ? '#fff' : '#78716c',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {t}
            {t === 'Тендеры' && openTenders.length > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', backgroundColor: '#ec4899', color: '#fff', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {openTenders.length}
              </span>
            )}
            {t === 'Сообщения' && (
              <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', backgroundColor: '#ec4899', color: '#fff', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                2
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Заказы */}
      {tab === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionTitle>Активные заказы</SectionTitle>
          {activeOrders.length === 0 ? (
            <Empty>Новых заказов нет</Empty>
          ) : (
            activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} onUpdate={updateStatus} />
            ))
          )}
          {doneOrders.length > 0 && (
            <>
              <SectionTitle style={{ marginTop: 8 }}>Завершённые</SectionTitle>
              {doneOrders.map((order) => (
                <OrderCard key={order.id} order={order} onUpdate={updateStatus} done />
              ))}
            </>
          )}
        </div>
      )}

      {/* Tab: Тендеры */}
      {tab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionTitle>Открытые тендеры</SectionTitle>
          {openTenders.length === 0 ? (
            <Empty>Нет открытых тендеров</Empty>
          ) : (
            openTenders.map((order) => {
              const alreadyBid = bidSent[order.id] || order.bids?.find((b) => b.venueId === user.id)
              const minBid = order.bids?.length > 0 ? Math.min(...order.bids.map((b) => b.price)) : order.estimatedPrice

              return (
                <div key={order.id} style={{ backgroundColor: '#fff', borderRadius: 20, border: '1px solid #f0ede8', padding: '20px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', background: '#f3e8ff', padding: '2px 8px', borderRadius: 99 }}>ТЕНДЕР</span>
                        <span style={{ fontWeight: 700, color: '#1c1917' }}>{order.id}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#a8a29e' }}>
                        {new Date(order.createdAt).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 12, color: '#a8a29e' }}>Ориент. цена</p>
                      <p style={{ fontWeight: 700, color: '#1c1917', fontSize: 18 }}>{order.estimatedPrice?.toLocaleString() || order.total.toLocaleString()} ₸</p>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#faf8f4', borderRadius: 12, padding: '12px 14px', marginBottom: 14 }}>
                    {order.items.map((item, i) => (
                      <p key={i} style={{ fontSize: 13, color: '#57534e', marginBottom: 2 }}>{item.name}</p>
                    ))}
                    {order.cakeDetails && (
                      <p style={{ fontSize: 11, color: '#a8a29e', marginTop: 6 }}>
                        {[
                          order.cakeDetails.base && `Основа: ${order.cakeDetails.base}`,
                          order.cakeDetails.filling && `Начинка: ${order.cakeDetails.filling}`,
                          order.cakeDetails.size && `Размер: ${order.cakeDetails.size}`,
                          order.cakeDetails.decoration && `Декор: ${order.cakeDetails.decoration}`,
                        ].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p style={{ fontSize: 12, color: '#a8a29e', marginTop: 6 }}>
                      {order.delivery === 'delivery' ? `🚗 Доставка: ${order.address}` : '🏪 Самовывоз'}
                    </p>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 12, color: '#a8a29e', marginBottom: 6 }}>
                      Текущих ставок: {order.bids?.length || 0}
                      {minBid && order.bids?.length > 0 && ` · Минимальная: ${minBid.toLocaleString()} ₸`}
                    </p>
                  </div>

                  {alreadyBid ? (
                    <div style={{ padding: '12px 16px', borderRadius: 12, backgroundColor: '#f0fdf4', border: '1px solid #a7f3d0', fontSize: 13, color: '#059669', fontWeight: 600 }}>
                      ✓ Ваша ставка: {typeof alreadyBid === 'number' ? alreadyBid.toLocaleString() : alreadyBid.price?.toLocaleString()} ₸
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="number"
                        placeholder="Ваша цена (₸)"
                        value={bidInputs[order.id] || ''}
                        onChange={(e) => setBidInputs((prev) => ({ ...prev, [order.id]: e.target.value }))}
                        style={{ flex: 1, border: '1px solid #e7e5e4', borderRadius: 12, padding: '10px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                      />
                      <button
                        onClick={() => handleBid(order.id)}
                        style={{ padding: '10px 20px', backgroundColor: '#7c3aed', color: '#fff', borderRadius: 12, border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        Подать ставку
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          )}

          {myBidTenders.filter((o) => o.status !== 'bidding').length > 0 && (
            <>
              <SectionTitle style={{ marginTop: 8 }}>Мои ставки (завершённые)</SectionTitle>
              {myBidTenders.filter((o) => o.status !== 'bidding').map((order) => {
                const myBid = order.bids.find((b) => b.venueId === user.id)
                const won = order.acceptedBidId === myBid?.id
                return (
                  <div key={order.id} style={{ backgroundColor: '#fff', borderRadius: 16, border: `1px solid ${won ? '#a7f3d0' : '#f0ede8'}`, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: '#1c1917', marginBottom: 2 }}>{order.id}</p>
                      <p style={{ fontSize: 12, color: '#a8a29e' }}>Ставка: {myBid?.price.toLocaleString()} ₸</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99, backgroundColor: won ? '#d1fae5' : '#f3f4f6', color: won ? '#059669' : '#6b7280' }}>
                      {won ? '🏆 Победа' : 'Не выбран'}
                    </span>
                  </div>
                )
              })}
            </>
          )}
        </div>
      )}

      {/* Tab: Каталог */}
      {tab === 2 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <SectionTitle>Мои товары ({myProducts.length})</SectionTitle>
            <button
              onClick={() => setAddingProduct(!addingProduct)}
              style={{ padding: '8px 18px', backgroundColor: '#1c1917', color: '#fff', borderRadius: 99, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              + Добавить товар
            </button>
          </div>

          {addingProduct && (
            <div style={{ backgroundColor: '#fff', borderRadius: 20, border: '1px solid #f0ede8', padding: '20px 22px', marginBottom: 16 }}>
              <p style={{ fontWeight: 600, color: '#1c1917', marginBottom: 14, fontSize: 14 }}>Новый товар</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  placeholder="Название товара"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={inputStyle}
                />
                <input
                  placeholder="Цена (₸)"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  style={inputStyle}
                />
                <textarea
                  placeholder="Описание"
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={{ ...inputStyle, resize: 'none' }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleAddProduct} style={{ flex: 1, padding: '10px', backgroundColor: '#1c1917', color: '#fff', borderRadius: 12, border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                    Добавить
                  </button>
                  <button onClick={() => setAddingProduct(false)} style={{ padding: '10px 16px', backgroundColor: '#f5f4f2', color: '#78716c', borderRadius: 12, border: 'none', fontSize: 13, cursor: 'pointer' }}>
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myProducts.map((p) => (
              <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #f0ede8', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <img src={p.image} alt={p.name} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#1c1917', fontSize: 14, marginBottom: 2 }}>{p.name}</p>
                  <p style={{ fontSize: 12, color: '#a8a29e' }}>{p.description?.slice(0, 60) || '—'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: '#ec4899', fontSize: 16 }}>{p.price.toLocaleString()} ₸</p>
                  <p style={{ fontSize: 11, color: '#a8a29e' }}>⭐ {p.rating}</p>
                </div>
                <button
                  onClick={() => setMyProducts((prev) => prev.filter((x) => x.id !== p.id))}
                  style={{ padding: '6px 12px', borderRadius: 10, border: '1px solid #fecaca', backgroundColor: '#fff', color: '#ef4444', fontSize: 12, cursor: 'pointer' }}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Сообщения */}
      {tab === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SectionTitle>Сообщения от клиентов</SectionTitle>
          {DEMO_MESSAGES.map((msg) => (
            <div
              key={msg.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                border: `1px solid ${msg.unread ? '#fbcfe8' : '#f0ede8'}`,
                padding: '14px 18px',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}
            >
              <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: msg.unread ? '#fdf2f8' : '#f5f4f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                👤
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: '#1c1917', fontSize: 13 }}>{msg.from}</span>
                  <span style={{ fontSize: 11, color: '#a8a29e' }}>{msg.time}</span>
                </div>
                <p style={{ fontSize: 13, color: '#78716c' }}>{msg.text}</p>
              </div>
              {msg.unread && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ec4899', flexShrink: 0, marginTop: 4 }} />
              )}
            </div>
          ))}
          <div style={{ backgroundColor: '#faf8f4', borderRadius: 16, border: '1px dashed #e7e5e4', padding: '20px', textAlign: 'center', marginTop: 8 }}>
            <p style={{ fontSize: 13, color: '#a8a29e' }}>Чат с клиентами будет доступен в следующей версии</p>
          </div>
        </div>
      )}
    </div>
  )
}

function OrderCard({ order, onUpdate, done }) {
  const status = ORDER_STATUSES[order.status] || { label: order.status, color: 'text-gray-600 bg-gray-100' }
  const nextStatus = NEXT_STATUS[order.status]

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 18, border: '1px solid #f0ede8', padding: '18px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <p style={{ fontWeight: 700, color: '#1c1917', marginBottom: 2 }}>{order.id}</p>
          <p style={{ fontSize: 11, color: '#a8a29e' }}>
            {new Date(order.createdAt).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99 }} className={status.color}>{status.label}</span>
      </div>
      <div style={{ fontSize: 12, color: '#78716c', marginBottom: 10 }}>
        <p>👤 {order.name} · {order.phone}</p>
        <p>{order.delivery === 'delivery' ? `🚗 ${order.address}` : '🏪 Самовывоз'}</p>
      </div>
      <div style={{ borderTop: '1px solid #f5f4f2', paddingTop: 10, marginBottom: done ? 0 : 10 }}>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 3 }}>
            <span style={{ color: '#78716c' }}>{item.name} × {item.quantity}</span>
            <span style={{ fontWeight: 500 }}>{(item.price * item.quantity).toLocaleString()} ₸</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#ec4899', paddingTop: 6, borderTop: '1px solid #f5f4f2', marginTop: 4 }}>
          <span>Итого</span>
          <span>{order.total.toLocaleString()} ₸</span>
        </div>
      </div>
      {!done && nextStatus && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onUpdate(order.id, nextStatus)}
            style={{ flex: 1, backgroundColor: '#1c1917', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px', borderRadius: 12, border: 'none', cursor: 'pointer' }}
          >
            {ORDER_STATUSES[nextStatus].label} →
          </button>
          <button
            onClick={() => onUpdate(order.id, 'cancelled')}
            style={{ padding: '10px 14px', border: '1px solid #fecaca', color: '#ef4444', backgroundColor: '#fff', fontSize: 12, borderRadius: 12, cursor: 'pointer' }}
          >
            Отменить
          </button>
        </div>
      )}
    </div>
  )
}

function SectionTitle({ children, style }) {
  return <p style={{ fontWeight: 600, color: '#57534e', fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase', ...style }}>{children}</p>
}

function Empty({ children }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px', color: '#a8a29e', fontSize: 13, backgroundColor: '#fff', borderRadius: 16, border: '1px solid #f0ede8' }}>
      {children}
    </div>
  )
}

function Chip({ children, bg, color }) {
  return (
    <span style={{ backgroundColor: bg, color, fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 99 }}>
      {children}
    </span>
  )
}

const inputStyle = {
  width: '100%',
  border: '1px solid #e7e5e4',
  borderRadius: 12,
  padding: '10px 14px',
  fontSize: 13,
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}
