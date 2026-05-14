import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PRODUCTS } from '../../constants/mockData'

const W = { maxWidth: 1280, margin: '0 auto', padding: '0 40px' }

function FadeIn({ children, delay = 0, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 3)

  return (
    <div style={{ backgroundColor: '#faf8f4' }} className="main-content">

      {/* ── HERO ── */}
      <section style={{ backgroundColor: '#faf8f4', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-grid" style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 420px 1fr', alignItems: 'center', minHeight: '88vh' }}>

          {/* Левые фото */}
          <div className="hero-photos" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, paddingRight: 32, paddingTop: 40 }}>
            <motion.img
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=85" alt="Торт"
              style={{ width: 170, height: 260, objectFit: 'cover', borderRadius: 18, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 60 }}>
              <motion.img
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.45 }}
                src="https://images.unsplash.com/photo-1562440499-64c9a111f713?w=400&q=85" alt="Наполеон"
                style={{ width: 130, height: 160, objectFit: 'cover', borderRadius: 14, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
              />
              <motion.img
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.55 }}
                src="https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&q=85" alt="Эклеры"
                style={{ width: 130, height: 120, objectFit: 'cover', borderRadius: 14, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>

          {/* Центральный текст */}
          <div className="hero-center" style={{ textAlign: 'center', padding: '60px 0', zIndex: 2 }}>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ color: '#c084fc', letterSpacing: '0.35em', textTransform: 'uppercase', fontSize: 10, fontWeight: 500, marginBottom: 20 }}
            >Город Актобе</motion.p>

            <motion.h1
              className="hero-h1"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1c1917', lineHeight: 1.05, fontWeight: 700, marginBottom: 20, fontSize: 'clamp(3.2rem, 5.5vw, 5.5rem)' }}
            >
              Торты<br />
              <em style={{ color: '#ec4899', fontStyle: 'normal' }}>с душой</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ color: '#78716c', fontSize: 15, maxWidth: 340, margin: '0 auto 32px', lineHeight: 1.75, fontWeight: 300 }}
            >
              Десерты от лучших кондитеров Актобе. Готовые изделия или созданные специально для вас.
            </motion.p>

            <motion.div
              className="hero-btns"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link to="/catalog" style={{ backgroundColor: '#1c1917', color: '#fff', fontWeight: 500, padding: '13px 32px', borderRadius: 99, textDecoration: 'none', fontSize: 13, letterSpacing: '0.08em' }}>
                СМОТРЕТЬ КАТАЛОГ
              </Link>
              <Link to="/constructor" style={{ border: '1.5px solid #1c1917', color: '#1c1917', fontWeight: 500, padding: '13px 32px', borderRadius: 99, textDecoration: 'none', fontSize: 13, letterSpacing: '0.08em' }}>
                СОБРАТЬ ТОРТ ✨
              </Link>
            </motion.div>

            {/* Мобильное фото — показывается только на телефоне */}
            <motion.img
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=85"
              alt="Торт"
              className="mob-hero-img"
              style={{ display: 'none', width: '100%', height: 260, objectFit: 'cover', borderRadius: 20, marginTop: 32, boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
            />
          </div>

          {/* Правые фото */}
          <div className="hero-photos" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 12, paddingLeft: 32, paddingTop: 40 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: -60 }}>
              <motion.img
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.45 }}
                src="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=85" alt="Чизкейк"
                style={{ width: 130, height: 150, objectFit: 'cover', borderRadius: 14, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
              />
              <motion.img
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.55 }}
                src="https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&q=85" alt="Макаруны"
                style={{ width: 130, height: 130, objectFit: 'cover', borderRadius: 14, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
              />
            </div>
            <motion.img
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.35 }}
              src="https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&q=85" alt="Торт 2"
              style={{ width: 170, height: 280, objectFit: 'cover', borderRadius: 18, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
            />
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="desk-nav"
          style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', color: '#a8a29e', fontSize: 10, letterSpacing: '0.3em' }}
        >ЛИСТАТЬ ↓</motion.div>
      </section>

      {/* ── КАТЕГОРИИ ── */}
      <section className="sec-pad" style={{ backgroundColor: '#fff', padding: '56px 0' }}>
        <div className="page-w" style={W}>
          <FadeIn style={{ marginBottom: 36 }}>
            <p style={{ color: '#c084fc', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 10, fontWeight: 500, marginBottom: 12 }}>Что вас интересует</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: '#1c1917' }}>Наш ассортимент</h2>
          </FadeIn>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {CATEGORIES_DATA.map((c, i) => (
              <FadeIn key={c.label} delay={i * 0.08}>
                <Link to={c.to} style={{ textDecoration: 'none', display: 'block', backgroundColor: '#faf8f4', borderRadius: 20, overflow: 'hidden', border: '1px solid #f0ede8' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#fbcfe8' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f0ede8' }}
                >
                  <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>{c.icon}</div>
                  <div style={{ padding: '12px 16px 16px' }}>
                    <p style={{ fontWeight: 600, color: '#1c1917', fontSize: 14, marginBottom: 3 }}>{c.label}</p>
                    <p style={{ color: '#a8a29e', fontSize: 12 }}>{c.sub}</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПОПУЛЯРНОЕ ── */}
      <section className="sec-pad" style={{ backgroundColor: '#faf8f4', padding: '56px 0' }}>
        <div className="page-w" style={W}>
          <FadeIn style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <p style={{ color: '#c084fc', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 10, fontWeight: 500, marginBottom: 12 }}>Топ недели</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: '#1c1917' }}>Популярное</h2>
            </div>
            <Link to="/catalog" style={{ color: '#a8a29e', textDecoration: 'none', fontSize: 13, letterSpacing: '0.04em' }}>Все товары →</Link>
          </FadeIn>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {featured.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.1}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── БАННЕР КОНСТРУКТОРА ── */}
      <section className="sec-pad" style={{ backgroundColor: '#fff', padding: '56px 0' }}>
        <div className="page-w" style={W}>
          <FadeIn>
            <div className="cta-banner" style={{ backgroundColor: '#1c1917', borderRadius: 24, padding: '52px 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 50%, rgba(244,114,182,0.15), transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <p style={{ color: '#c084fc', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 10, fontWeight: 500, marginBottom: 14 }}>Эксклюзив</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                  Твой торт — твои правила
                </h2>
                <p style={{ color: '#78716c', maxWidth: 400, lineHeight: 1.7, fontSize: 14, fontWeight: 300 }}>
                  Выбери основу, начинку, форму и оформление.
                </p>
              </div>
              <Link to="/constructor"
                style={{ flexShrink: 0, backgroundColor: '#fff', color: '#1c1917', fontWeight: 600, padding: '14px 36px', borderRadius: 99, textDecoration: 'none', fontSize: 13, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                ОТКРЫТЬ КОНСТРУКТОР ✨
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ПАРТНЁРЫ ── */}
      <section className="sec-pad" style={{ backgroundColor: '#faf8f4', padding: '56px 0' }}>
        <div className="page-w" style={W}>
          <FadeIn style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ color: '#c084fc', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 10, fontWeight: 500, marginBottom: 12 }}>Нам доверяют</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: '#1c1917' }}>Партнёры Актобе</h2>
          </FadeIn>
          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {PARTNERS.map((p, i) => (
              <FadeIn key={p.name} delay={i * 0.12}>
                <div className="partner-card" style={{ backgroundColor: '#fff', border: '1px solid #f0ede8', borderRadius: 20, padding: '32px', display: 'flex', alignItems: 'center', gap: 24 }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = '#fbcfe8' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f0ede8' }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: p.textColor }}>{p.short}</span>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: '#1c1917', marginBottom: 4 }}>{p.name}</h3>
                    <p style={{ color: '#a8a29e', fontSize: 13, lineHeight: 1.6, fontWeight: 300, marginBottom: 6 }}>{p.desc}</p>
                    <p style={{ color: '#ec4899', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{p.tag}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПРЕИМУЩЕСТВА ── */}
      <section className="sec-pad" style={{ backgroundColor: '#fff', borderTop: '1px solid #f0ede8', padding: '48px 0' }}>
        <div className="page-w grid-benefits" style={{ ...W, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {BENEFITS.map((b, i) => (
            <FadeIn key={b.label} delay={i * 0.08} style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{b.icon}</div>
              <p style={{ fontWeight: 600, color: '#1c1917', fontSize: 13, letterSpacing: '0.03em', marginBottom: 4 }}>{b.label}</p>
              <p style={{ color: '#a8a29e', fontSize: 12, fontWeight: 300 }}>{b.sub}</p>
            </FadeIn>
          ))}
        </div>
      </section>

    </div>
  )
}

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', display: 'block', backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #f0ede8' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.09)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ overflow: 'hidden' }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: 210, objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ padding: '18px' }}>
        <p style={{ color: '#a8a29e', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 5 }}>{product.venue}</p>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#1c1917', fontSize: 19, lineHeight: 1.2, marginBottom: 10 }}>{product.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#ec4899', fontWeight: 600, fontSize: 17 }}>{product.price.toLocaleString()} ₸</span>
          <span style={{ color: '#d6d3d1', fontSize: 12 }}>⭐ {product.rating}</span>
        </div>
      </div>
    </Link>
  )
}

const CATEGORIES_DATA = [
  { icon: '🎂', label: 'Торты', sub: 'На заказ и готовые', to: '/catalog' },
  { icon: '🥐', label: 'Выпечка', sub: 'Пирожные, эклеры', to: '/catalog' },
  { icon: '✨', label: 'Конструктор', sub: 'Собери сам', to: '/constructor' },
  { icon: '🎁', label: 'Подарки', sub: 'Наборы и боксы', to: '/catalog' },
]

const PARTNERS = [
  { name: 'Лакомка', short: 'Л', bg: '#fce7f3', textColor: '#db2777', desc: 'Сеть кулинарных магазинов Актобе. Домашние десерты с 2005 года.', tag: 'Официальный партнёр' },
  { name: 'Samal Cakes', short: 'S', bg: '#fff1f2', textColor: '#f43f5e', desc: 'Авторские торты и капкейки. Индивидуальный подход к каждому заказу.', tag: 'Официальный партнёр' },
]

const BENEFITS = [
  { icon: '🚀', label: 'Быстрая доставка', sub: 'По всему Актобе' },
  { icon: '👨‍🍳', label: 'Местные мастера', sub: 'Проверенные кондитеры' },
  { icon: '💳', label: 'Kaspi · Наличные', sub: 'Удобная оплата' },
  { icon: '⭐', label: 'Гарантия качества', sub: 'Или вернём деньги' },
]
