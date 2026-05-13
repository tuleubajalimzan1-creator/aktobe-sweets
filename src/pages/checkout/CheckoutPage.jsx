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
  const isTender = items.some((i) => i.isCustom)

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    delivery: 'delivery',
    address: '',
    comment: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const orderData = {
      ...form,
      items,
      total,
      userId: user?.id,
      type: isTender ? 'tender' : 'direct',
      status: isTender ? 'bidding' : 'pending',
      estimatedPrice: isTender ? total : undefined,
    }
    const newOrder = addOrder(orderData)
    setOrderId(newOrder.id)
    clearCart()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{isTender ? '🏆' : '🎉'}</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: '#1c1917', marginBottom: 8 }}>
          {isTender ? 'Тендер создан!' : 'Заказ принят!'}
        </h2>
        <p style={{ color: '#78716c', fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
          {isTender
            ? 'Ваш заказ отправлен на тендер. Кондитерские предложат свои цены — вы выберете лучшее предложение.'
            : 'Мы свяжемся с вами по телефону для подтверждения заказа.'}
        </p>
        {orderId && (
          <p style={{ color: '#a8a29e', fontSize: 12, marginBottom: 28 }}>Номер: {orderId}</p>
        )}
        {isTender && (
          <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: 16, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
            <p style={{ fontSize: 13, color: '#9d174d', fontWeight: 600, marginBottom: 4 }}>Как работает тендер?</p>
            <ol style={{ fontSize: 12, color: '#78716c', paddingLeft: 16, lineHeight: 1.8, margin: 0 }}>
              <li>Кондитерские видят ваш заказ и предлагают свою цену</li>
              <li>Вы выбираете лучшее предложение в «Моих заказах»</li>
              <li>После принятия ставки заведение начинает готовить</li>
            </ol>
          </div>
        )}
        <button
          onClick={() => navigate('/orders')}
          style={{ backgroundColor: '#1c1917', color: '#fff', fontWeight: 600, padding: '14px 36px', borderRadius: 99, border: 'none', cursor: 'pointer', fontSize: 14 }}
        >
          {isTender ? 'Смотреть ставки' : 'Мои заказы'}
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px' }}>
      <p style={{ color: '#f472b6', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 10, marginBottom: 8 }}>
        {isTender ? 'Тендерный заказ' : 'Оформление'}
      </p>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: '#1c1917', marginBottom: 32 }}>
        {isTender ? 'Отправить на тендер' : 'Оформление заказа'}
      </h1>

      {isTender && (
        <div style={{ background: '#fdf9ff', border: '1px dashed #e9d5ff', borderRadius: 16, padding: '14px 20px', marginBottom: 24, fontSize: 13, color: '#7c3aed' }}>
          ✨ Ваш торт на заказ будет отправлен всем кондитерским. Они предложат цену — вы выберете лучшую!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card title="Контактные данные">
          <Field label="Имя">
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Ваше имя" required />
          </Field>
          <Field label="Телефон">
            <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+7 700 000 00 00" required />
          </Field>
        </Card>

        <Card title="Способ получения">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            {[
              { value: 'delivery', label: '🚗 Доставка', sub: 'По городу Актобе' },
              { value: 'pickup', label: '🏪 Самовывоз', sub: 'Из заведения' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, delivery: opt.value })}
                style={{
                  padding: '14px 12px',
                  borderRadius: 14,
                  border: `2px solid ${form.delivery === opt.value ? '#ec4899' : '#e7e5e4'}`,
                  backgroundColor: form.delivery === opt.value ? '#fdf2f8' : '#fff',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <p style={{ fontWeight: 600, fontSize: 13, color: '#1c1917', marginBottom: 2 }}>{opt.label}</p>
                <p style={{ fontSize: 11, color: '#a8a29e' }}>{opt.sub}</p>
              </button>
            ))}
          </div>
          {form.delivery === 'delivery' && (
            <Field label="Адрес доставки">
              <Input name="address" value={form.address} onChange={handleChange} placeholder="Улица, дом, квартира" required />
            </Field>
          )}
          <Field label="Комментарий (необязательно)">
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Пожелания к заказу..."
              rows={3}
              style={{ width: '100%', border: '1px solid #e7e5e4', borderRadius: 12, padding: '10px 14px', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </Field>
        </Card>

        <Card title="Ваш заказ">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#78716c' }}>
                <span>{item.name} × {item.quantity}</span>
                <span>{(item.price * item.quantity).toLocaleString()} ₸</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #f0ede8', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17 }}>
              <span style={{ color: '#1c1917' }}>{isTender ? 'Ориентировочная цена' : 'Итого'}</span>
              <span style={{ color: '#ec4899' }}>{total.toLocaleString()} ₸</span>
            </div>
            {isTender && (
              <p style={{ fontSize: 11, color: '#a8a29e', marginTop: -4 }}>
                Итоговая цена будет определена по ставкам кондитерских
              </p>
            )}
          </div>
        </Card>

        <button
          type="submit"
          style={{ width: '100%', backgroundColor: '#1c1917', color: '#fff', fontWeight: 600, padding: '16px', borderRadius: 99, border: 'none', cursor: 'pointer', fontSize: 15, letterSpacing: '0.03em' }}
        >
          {isTender ? '🏆 Отправить на тендер' : 'Подтвердить заказ'}
        </button>
      </form>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 20, border: '1px solid #f0ede8', padding: '20px 22px' }}>
      <p style={{ fontWeight: 600, color: '#1c1917', marginBottom: 16, fontSize: 14 }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, color: '#a8a29e', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      style={{ width: '100%', border: '1px solid #e7e5e4', borderRadius: 12, padding: '10px 14px', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
    />
  )
}
