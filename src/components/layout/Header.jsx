import { useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useCartStore from '../../store/useCartStore'
import useAuthStore from '../../store/useAuthStore'

const NAV_LEFT = [
  {
    label: 'Каталог',
    items: ['Все товары', 'Торты', 'Выпечка и пирожные', 'Подарочные наборы', 'Сезонное меню'],
    links: ['/catalog', '/catalog', '/catalog', '/catalog', '/catalog'],
  },
  {
    label: 'Конструктор',
    items: ['Собрать свой торт', 'Свадебный торт', 'Детский торт', 'Корпоративный'],
    links: ['/constructor', '/constructor', '/constructor', '/constructor'],
  },
]

const NAV_RIGHT = [
  {
    label: 'Заведения',
    items: ['Лакомка', 'Samal Cakes', 'Все партнёры'],
    links: ['/catalog', '/catalog', '/catalog'],
  },
  {
    label: 'Доставка',
    items: ['Условия доставки', 'Зоны Актобе', 'Самовывоз'],
    links: ['/', '/', '/'],
  },
  { label: 'Акции', to: '/catalog' },
]

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const { user, role, logout } = useAuthStore()
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const [openMenu, setOpenMenu] = useState(null)
  const timerRef = useRef(null)

  const open = (label) => { clearTimeout(timerRef.current); setOpenMenu(label) }
  const close = () => { timerRef.current = setTimeout(() => setOpenMenu(null), 180) }

  return (
    <>
      {/* Топ-бар */}
      <div style={{ backgroundColor: '#1c1917', color: '#a8a29e', fontSize: 11, textAlign: 'center', padding: '9px 0', letterSpacing: '0.2em' }}>
        ДОСТАВКА ПО ВСЕМУ АКТОБЕ · +7 700 000 00 00
      </div>

      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #f0ede8', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', height: 70, display: 'flex', alignItems: 'center', position: 'relative' }}>

          {/* Левая навигация — прижата к правому краю (к логотипу) */}
          <nav style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end', paddingRight: 56 }}>
            {NAV_LEFT.map((item) => (
              <NavItem key={item.label} item={item} open={open} close={close} openMenu={openMenu} setOpenMenu={setOpenMenu} />
            ))}
          </nav>

          {/* Логотип — точно по центру через absolute */}
          <Link to="/" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textDecoration: 'none', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: '#1c1917', letterSpacing: '0.1em', lineHeight: 1 }}>
              Актобе
            </div>
            <div style={{ fontSize: 9, letterSpacing: '0.45em', color: '#f472b6', textTransform: 'uppercase', fontWeight: 500, marginTop: 3 }}>
              Sweets
            </div>
          </Link>

          {/* Правая навигация — прижата к левому краю (к логотипу) */}
          <nav style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-start', paddingLeft: 56 }}>
            {(user ? NAV_RIGHT.filter((i) => i.label === 'Акции') : NAV_RIGHT).map((item) => (
              <NavItem key={item.label} item={item} open={open} close={close} openMenu={openMenu} setOpenMenu={setOpenMenu} alignRight />
            ))}

            <div style={{ width: 1, height: 18, backgroundColor: '#e7e5e4', margin: '0 14px' }} />

            <Link to="/cart" style={{ position: 'relative', padding: '6px 8px', textDecoration: 'none', fontSize: 17 }}>
              🛒
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#ec4899', color: '#fff', fontSize: 9, borderRadius: '50%', width: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <Link
                to={role === 'admin' ? '/admin' : role === 'venue' ? '/venue' : '/profile'}
                style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px 5px 7px', borderRadius: 99, border: '1px solid #f0ede8', backgroundColor: '#faf8f6', textDecoration: 'none' }}
              >
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, letterSpacing: '0.04em',
                  backgroundColor: role === 'admin' ? '#f3e8ff' : role === 'venue' ? '#dbeafe' : '#fce7f3',
                  color: role === 'admin' ? '#9333ea' : role === 'venue' ? '#2563eb' : '#ec4899',
                }}>
                  {role === 'admin' ? 'Админ' : role === 'venue' ? 'Кондитер' : 'Клиент'}
                </span>
                <span style={{ fontSize: 12, color: '#57534e', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                <button
                  onClick={(e) => { e.preventDefault(); logout(); navigate('/') }}
                  style={{ fontSize: 11, color: '#d4cdc8', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}
                >✕</button>
              </Link>
            ) : (
              <Link to="/login"
                style={{ marginLeft: 12, backgroundColor: '#1c1917', color: '#fff', fontSize: 12, fontWeight: 500, padding: '8px 20px', borderRadius: 99, textDecoration: 'none', letterSpacing: '0.05em' }}>
                Войти
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Мобильная нижняя навигация */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 flex z-50">
        {[
          { to: '/', icon: '🏠', label: 'Главная' },
          { to: '/catalog', icon: '🍰', label: 'Каталог' },
          { to: '/constructor', icon: '✨', label: 'Конструктор' },
          { to: '/cart', icon: '🛒', label: cartCount > 0 ? `(${cartCount})` : 'Корзина' },
          { to: '/profile', icon: '👤', label: 'Профиль' },
        ].map((item) => (
          <Link key={item.to} to={item.to}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 4px', textDecoration: 'none', fontSize: 11, color: location.pathname === item.to ? '#ec4899' : '#a8a29e' }}>
            <span style={{ fontSize: 18, lineHeight: 1, marginBottom: 3 }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  )
}

function NavItem({ item, open, close, openMenu, setOpenMenu, alignRight }) {
  const isOpen = openMenu === item.label

  if (!item.items) {
    return (
      <Link to={item.to}
        style={{ padding: '0 14px', height: 70, display: 'flex', alignItems: 'center', fontSize: 13, color: '#78716c', textDecoration: 'none', letterSpacing: '0.04em', fontWeight: 500, whiteSpace: 'nowrap' }}>
        {item.label}
      </Link>
    )
  }

  return (
    <div style={{ position: 'relative' }} onMouseEnter={() => open(item.label)} onMouseLeave={close}>
      <button style={{ padding: '0 14px', height: 70, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: isOpen ? '#1c1917' : '#78716c', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', fontWeight: 500, whiteSpace: 'nowrap' }}>
        {item.label}
        <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ opacity: 0.45, marginTop: 1 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.14 }}
            onMouseEnter={() => open(item.label)}
            onMouseLeave={close}
            style={{
              position: 'absolute',
              top: '100%',
              ...(alignRight ? { right: 0 } : { left: 0 }),
              minWidth: 210,
              backgroundColor: '#fff',
              border: '1px solid #f0ede8',
              borderRadius: 14,
              boxShadow: '0 16px 48px rgba(0,0,0,0.1)',
              padding: '8px 0',
              zIndex: 100,
            }}
          >
            {item.items.map((label, i) => (
              <Link
                key={label}
                to={item.links[i]}
                onClick={() => setOpenMenu(null)}
                style={{ display: 'block', padding: '10px 22px', fontSize: 13, color: '#78716c', textDecoration: 'none', letterSpacing: '0.03em' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ec4899'; e.currentTarget.style.backgroundColor = '#fdf2f8' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#78716c'; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
