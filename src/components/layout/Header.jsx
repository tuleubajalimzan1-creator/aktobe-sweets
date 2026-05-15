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
      {/* Top bar */}
      <div className="desk-nav" style={{ backgroundColor: '#2c1810', color: 'rgba(232,213,188,0.7)', fontSize: 10.5, textAlign: 'center', padding: '9px 0', letterSpacing: '0.22em' }}>
        ДОСТАВКА ПО ВСЕМУ АКТОБЕ · +7 700 000 00 00
      </div>

      {/* Main header — glassmorphism */}
      <header style={{
        backgroundColor: 'rgba(253, 248, 243, 0.88)',
        backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        borderBottom: '1px solid rgba(232,213,188,0.5)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div className="mob-header-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', height: 70, display: 'flex', alignItems: 'center', position: 'relative' }}>

          {/* Left nav — desktop only */}
          <nav className="desk-nav" style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end', paddingRight: 56 }}>
            {NAV_LEFT.map((item) => (
              <NavItem key={item.label} item={item} open={open} close={close} openMenu={openMenu} setOpenMenu={setOpenMenu} />
            ))}
          </nav>

          {/* Logo — centered */}
          <Link to="/" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textDecoration: 'none', textAlign: 'center' }}>
            <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.22 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 23, fontWeight: 700, color: '#2c1810', letterSpacing: '0.08em', lineHeight: 1 }}>
                Актобе
              </div>
              <div style={{ fontSize: 8.5, letterSpacing: '0.52em', color: '#c9a96e', textTransform: 'uppercase', fontWeight: 600, marginTop: 3 }}>
                Sweets
              </div>
            </motion.div>
          </Link>

          {/* Right nav — desktop only */}
          <nav className="desk-nav" style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-start', paddingLeft: 56 }}>
            {(user ? NAV_RIGHT.filter((i) => i.label === 'Акции') : NAV_RIGHT).map((item) => (
              <NavItem key={item.label} item={item} open={open} close={close} openMenu={openMenu} setOpenMenu={setOpenMenu} alignRight />
            ))}
            <div style={{ width: 1, height: 18, backgroundColor: 'rgba(232,213,188,0.8)', margin: '0 14px' }} />
          </nav>

          {/* Cart + user — always visible */}
          <div style={{ position: 'absolute', right: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }} transition={{ duration: 0.18 }}>
              <Link to="/cart" style={{ position: 'relative', padding: '7px 9px', textDecoration: 'none', fontSize: 18, display: 'block' }}>
                🛒
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#e8698a', color: '#fff', fontSize: 9, borderRadius: '50%', width: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            {user ? (
              <Link
                to={role === 'admin' ? '/admin' : role === 'venue' ? '/venue' : '/profile'}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px 5px 7px', borderRadius: 99, border: '1px solid rgba(232,213,188,0.7)', backgroundColor: 'rgba(253,248,243,0.9)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', textDecoration: 'none' }}
              >
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, letterSpacing: '0.04em',
                  backgroundColor: role === 'admin' ? '#f3e8ff' : role === 'venue' ? '#dbeafe' : '#fce8ed',
                  color: role === 'admin' ? '#9333ea' : role === 'venue' ? '#2563eb' : '#e8698a',
                }}>
                  {role === 'admin' ? 'Админ' : role === 'venue' ? 'Кондитер' : 'Клиент'}
                </span>
                <span className="desk-nav" style={{ fontSize: 12, color: '#5c3325', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                <button
                  onClick={(e) => { e.preventDefault(); logout(); navigate('/') }}
                  style={{ fontSize: 11, color: '#c4b4a8', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}
                >✕</button>
              </Link>
            ) : (
              <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
                <Link to="/login" style={{ display: 'block', backgroundColor: '#2c1810', color: '#fdf8f3', fontSize: 12, fontWeight: 500, padding: '8px 20px', borderRadius: 99, textDecoration: 'none', letterSpacing: '0.06em', boxShadow: '0 4px 14px rgba(44,24,16,0.22)' }}>
                  Войти
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 flex z-50" style={{ backgroundColor: 'rgba(253,248,243,0.96)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(232,213,188,0.5)' }}>
        {[
          { to: '/', icon: '🏠', label: 'Главная' },
          { to: '/catalog', icon: '🍰', label: 'Каталог' },
          { to: '/constructor', icon: '✨', label: 'Конструктор' },
          { to: '/cart', icon: '🛒', label: cartCount > 0 ? `(${cartCount})` : 'Корзина' },
          { to: '/profile', icon: '👤', label: 'Профиль' },
        ].map((item) => (
          <Link key={item.to} to={item.to}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 4px', textDecoration: 'none', fontSize: 10.5, fontWeight: 500, color: location.pathname === item.to ? '#e8698a' : '#8c7b6e', letterSpacing: '0.02em' }}>
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
        style={{ padding: '0 14px', height: 70, display: 'flex', alignItems: 'center', fontSize: 13, color: '#6b5e54', textDecoration: 'none', letterSpacing: '0.04em', fontWeight: 500, whiteSpace: 'nowrap' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#e8698a' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#6b5e54' }}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div style={{ position: 'relative' }} onMouseEnter={() => open(item.label)} onMouseLeave={close}>
      <button style={{ padding: '0 14px', height: 70, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: isOpen ? '#2c1810' : '#6b5e54', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', fontWeight: 500, whiteSpace: 'nowrap', transition: 'color 0.2s' }}>
        {item.label}
        <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ opacity: 0.4, marginTop: 1 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => open(item.label)}
            onMouseLeave={close}
            style={{
              position: 'absolute',
              top: '100%',
              ...(alignRight ? { right: 0 } : { left: 0 }),
              minWidth: 216,
              backgroundColor: 'rgba(253, 248, 243, 0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(232,213,188,0.7)',
              borderRadius: 16,
              boxShadow: '0 20px 64px rgba(44,24,16,0.14)',
              padding: '8px 0',
              zIndex: 100,
            }}
          >
            {item.items.map((label, i) => (
              <Link
                key={label}
                to={item.links[i]}
                onClick={() => setOpenMenu(null)}
                style={{ display: 'block', padding: '10px 22px', fontSize: 13, color: '#6b5e54', textDecoration: 'none', letterSpacing: '0.03em', transition: 'color 0.15s, background-color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#e8698a'; e.currentTarget.style.backgroundColor = 'rgba(232,105,138,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#6b5e54'; e.currentTarget.style.backgroundColor = 'transparent' }}
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
