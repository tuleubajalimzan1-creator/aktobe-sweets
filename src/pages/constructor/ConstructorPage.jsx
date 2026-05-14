import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CONSTRUCTOR_OPTIONS } from '../../constants/mockData'
import useCartStore from '../../store/useCartStore'

const STEPS = [
  { key: 'base',        label: 'Основа',   icon: '🍰', options: CONSTRUCTOR_OPTIONS.bases },
  { key: 'filling',     label: 'Начинка',  icon: '🍫', options: CONSTRUCTOR_OPTIONS.fillings },
  { key: 'size',        label: 'Размер',   icon: '📏', options: CONSTRUCTOR_OPTIONS.sizes },
  { key: 'shape',       label: 'Форма',    icon: '⬡',  options: CONSTRUCTOR_OPTIONS.shapes },
  { key: 'decoration',  label: 'Декор',    icon: '🌸', options: CONSTRUCTOR_OPTIONS.decorations },
  { key: 'inscription', label: 'Надпись',  icon: '✍️', options: null },
  { key: 'extras',      label: 'Допы',     icon: '🎁', options: CONSTRUCTOR_OPTIONS.extras },
]

const BASE_COLORS = {
  biscuit:   ['#f5deb3', '#e8c88a'],
  honey:     ['#e8a84c', '#d4922e'],
  napoleon:  ['#f0d090', '#dfc070'],
  chocolate: ['#6b3a20', '#3d2008'],
}
const FILL_COLORS = {
  cream:      '#fce4ec',
  chocolate:  '#4e342e',
  fruit:      '#ef5350',
  condensed:  '#c8a050',
}
const DECOR_CONFIG = {
  none:    { dots: [], label: '' },
  flowers: { dots: ['#f48fb1','#f8bbd0','#e91e63'], label: '🌸' },
  berries: { dots: ['#c62828','#e53935','#b71c1c'], label: '🍒' },
  figures: { dots: ['#fff9c4','#fff176','#f9a825'], label: '⭐' },
}

export default function ConstructorPage() {
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [choices, setChoices] = useState({
    base:        CONSTRUCTOR_OPTIONS.bases[0],
    filling:     CONSTRUCTOR_OPTIONS.fillings[0],
    size:        CONSTRUCTOR_OPTIONS.sizes[0],
    shape:       CONSTRUCTOR_OPTIONS.shapes[0],
    decoration:  CONSTRUCTOR_OPTIONS.decorations[0],
    inscription: '',
    extras:      [],
  })

  const total =
    choices.base.price + choices.filling.price + choices.size.price +
    choices.shape.price + choices.decoration.price +
    choices.extras.reduce((s, e) => s + e.price, 0)

  const go = (n) => { setDir(n > step ? 1 : -1); setStep(n) }

  const toggleExtra = (extra) => {
    const has = choices.extras.find((e) => e.id === extra.id)
    setChoices({ ...choices, extras: has ? choices.extras.filter((e) => e.id !== extra.id) : [...choices.extras, extra] })
  }

  const handleCart = () => {
    addItem({ id: `custom-${Date.now()}`, name: `Торт на заказ (${choices.size.label})`, price: total, quantity: 1, isCustom: true })
    navigate('/cart')
  }

  const baseGrad = BASE_COLORS[choices.base?.id] || BASE_COLORS.biscuit
  const fillColor = FILL_COLORS[choices.filling?.id] || FILL_COLORS.cream
  const decorDots = DECOR_CONFIG[choices.decoration?.id]?.dots || []
  const decorLabel = DECOR_CONFIG[choices.decoration?.id]?.label || ''
  const isRound = choices.shape?.id !== 'square'
  const sizeW = choices.size?.id === 'small' ? 0.78 : choices.size?.id === 'large' ? 1.12 : 1
  const hasCandles = choices.extras.find((e) => e.id === 'candles')
  const hasTopper  = choices.extras.find((e) => e.id === 'topper')
  const hasSpark   = choices.extras.find((e) => e.id === 'sparklers')

  return (
    <div style={{ backgroundColor: '#faf8f4', minHeight: '100vh' }}>
      <div className="constructor-wrap" style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px' }}>

        {/* Заголовок */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: '#c084fc', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 10, fontWeight: 500, marginBottom: 10 }}>Создай сам</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontWeight: 700, color: '#1c1917' }}>Конструктор торта</h1>
        </div>

        {/* Шаги — горизонтальные таблетки */}
        <div className="constructor-steps" style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {STEPS.map((s, i) => {
            const done = i < step
            const active = i === step
            return (
              <button key={s.key} onClick={() => go(i)} className="constructor-step-btn"
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 99, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                  backgroundColor: active ? '#1c1917' : done ? '#fce7f3' : '#fff',
                  color: active ? '#fff' : done ? '#ec4899' : '#a8a29e',
                  boxShadow: active ? '0 4px 16px rgba(0,0,0,0.15)' : '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                <span style={{ fontSize: 15 }}>{s.icon}</span>
                <span>{s.label}</span>
                {done && <span style={{ fontSize: 11 }}>✓</span>}
              </button>
            )
          })}
        </div>

        {/* Прогресс-бар */}
        <div style={{ height: 3, backgroundColor: '#f0ede8', borderRadius: 99, marginBottom: 40, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ height: '100%', backgroundColor: '#ec4899', borderRadius: 99 }}
          />
        </div>

        {/* Основная сетка */}
        <div className="constructor-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32, alignItems: 'start' }}>

          {/* Левая панель — опции */}
          <div>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                initial={{ opacity: 0, x: dir * 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -32 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="constructor-options"
                style={{ backgroundColor: '#fff', borderRadius: 24, border: '1px solid #f0ede8', padding: 32 }}
              >
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: '#1c1917', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span>{STEPS[step].icon}</span> {STEPS[step].label}
                </h2>

                {/* Обычные опции */}
                {STEPS[step].options && step !== 6 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {STEPS[step].options.map((opt) => {
                      const sel = choices[STEPS[step].key]?.id === opt.id
                      return (
                        <motion.button key={opt.id} whileTap={{ scale: 0.97 }}
                          onClick={() => setChoices({ ...choices, [STEPS[step].key]: opt })}
                          style={{ padding: '18px 20px', borderRadius: 16, border: `2px solid ${sel ? '#ec4899' : '#f0ede8'}`, backgroundColor: sel ? '#fdf2f8' : '#faf8f4', cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s' }}
                        >
                          <div style={{ fontWeight: 600, color: sel ? '#ec4899' : '#1c1917', fontSize: 14, marginBottom: 4 }}>{opt.label}</div>
                          <div style={{ fontSize: 12, color: sel ? '#f9a8d4' : '#a8a29e' }}>
                            {opt.price === 0 ? 'Включено' : `+${opt.price.toLocaleString()} ₸`}
                          </div>
                          {sel && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                              style={{ marginTop: 8, width: 20, height: 20, borderRadius: 99, backgroundColor: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff' }}>
                              ✓
                            </motion.div>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                )}

                {/* Надпись */}
                {step === 5 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <input
                      value={choices.inscription}
                      onChange={(e) => setChoices({ ...choices, inscription: e.target.value })}
                      placeholder="Например: С днём рождения, Азиз! 🎉"
                      maxLength={50}
                      style={{ border: '2px solid #f0ede8', borderRadius: 14, padding: '16px 20px', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#1c1917', backgroundColor: '#faf8f4', transition: 'border 0.18s' }}
                      onFocus={e => e.target.style.borderColor = '#ec4899'}
                      onBlur={e => e.target.style.borderColor = '#f0ede8'}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#a8a29e' }}>
                      <span>Оставьте пустым, если надпись не нужна</span>
                      <span>{choices.inscription.length}/50</span>
                    </div>
                    {choices.inscription && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        style={{ backgroundColor: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: 14, padding: '16px 20px', textAlign: 'center' }}>
                        <p style={{ color: '#ec4899', fontWeight: 600, fontSize: 15, fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif" }}>
                          «{choices.inscription}»
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Допы */}
                {step === 6 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {CONSTRUCTOR_OPTIONS.extras.map((extra) => {
                      const sel = choices.extras.find((e) => e.id === extra.id)
                      return (
                        <motion.button key={extra.id} whileTap={{ scale: 0.97 }}
                          onClick={() => toggleExtra(extra)}
                          style={{ padding: '18px 20px', borderRadius: 16, border: `2px solid ${sel ? '#ec4899' : '#f0ede8'}`, backgroundColor: sel ? '#fdf2f8' : '#faf8f4', cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s' }}
                        >
                          <div style={{ fontWeight: 600, color: sel ? '#ec4899' : '#1c1917', fontSize: 14, marginBottom: 4 }}>{extra.label}</div>
                          <div style={{ fontSize: 12, color: '#a8a29e' }}>+{extra.price.toLocaleString()} ₸</div>
                        </motion.button>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Кнопки навигации */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {step > 0 && (
                <button onClick={() => go(step - 1)}
                  style={{ flex: 1, padding: '16px', borderRadius: 16, border: '1.5px solid #f0ede8', backgroundColor: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#78716c', transition: 'all 0.18s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#1c1917'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#f0ede8'}
                >
                  ← Назад
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button onClick={() => go(step + 1)}
                  style={{ flex: 1, padding: '16px', borderRadius: 16, border: 'none', backgroundColor: '#1c1917', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ec4899'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1c1917'}
                >
                  Далее →
                </button>
              ) : (
                <motion.button whileTap={{ scale: 0.98 }} onClick={handleCart}
                  style={{ flex: 1, padding: '16px', borderRadius: 16, border: 'none', backgroundColor: '#ec4899', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
                >
                  Добавить в корзину 🛒
                </motion.button>
              )}
            </div>
          </div>

          {/* Правая панель — превью торта */}
          <div className="constructor-preview" style={{ position: 'sticky', top: 100 }}>
            <div className="constructor-preview-inner" style={{ backgroundColor: '#fff', borderRadius: 24, border: '1px solid #f0ede8', padding: '32px 24px', textAlign: 'center' }}>
              <p style={{ color: '#a8a29e', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10, marginBottom: 32 }}>Предварительный вид</p>

              {/* Торт */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                  className="constructor-cake-scale"
                  style={{ transform: `scale(${sizeW})`, transformOrigin: 'bottom center' }}
                >
                  <CakeView
                    baseGrad={baseGrad} fillColor={fillColor} decorDots={decorDots}
                    decorLabel={decorLabel} isRound={isRound} inscription={choices.inscription}
                    hasCandles={hasCandles} hasTopper={hasTopper} hasSpark={hasSpark}
                  />
                </motion.div>
              </div>

              {/* Цена */}
              <motion.div key={total} initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: '#ec4899', marginBottom: 4 }}>
                  {total.toLocaleString()} ₸
                </div>
                <div style={{ fontSize: 11, color: '#a8a29e', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>итоговая стоимость</div>
              </motion.div>

              {/* Параметры */}
              <div style={{ borderTop: '1px solid #f0ede8', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { k: 'Основа',  v: choices.base?.label },
                  { k: 'Начинка', v: choices.filling?.label },
                  { k: 'Размер',  v: choices.size?.label },
                  { k: 'Форма',   v: choices.shape?.label },
                  { k: 'Декор',   v: choices.decoration?.label },
                  choices.inscription && { k: 'Надпись', v: `«${choices.inscription}»` },
                  choices.extras.length > 0 && { k: 'Допы', v: choices.extras.map((e) => e.label).join(', ') },
                ].filter(Boolean).map((row) => (
                  <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#a8a29e' }}>{row.k}</span>
                    <span style={{ color: '#1c1917', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Красивый торт ── */
function CakeView({ baseGrad, fillColor, decorDots, decorLabel, isRound, inscription, hasCandles, hasTopper, hasSpark }) {
  const r = isRound ? 999 : 14
  const style = (w, h, colors) => ({
    width: w, height: h, borderRadius: r,
    background: `linear-gradient(170deg, ${colors[0]}, ${colors[1]})`,
    boxShadow: `0 6px 20px ${colors[1]}55`,
    position: 'relative',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>

      {/* Топпер */}
      {hasTopper && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 22, marginBottom: 4 }}>🎉</motion.div>
      )}

      {/* Свечи / бенгальские огни */}
      {(hasCandles || hasSpark) && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 6, alignItems: 'flex-end' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.2 }}
                style={{ width: 8, height: 10, borderRadius: 99, background: hasSpark ? 'radial-gradient(#fff, #fbbf24)' : 'linear-gradient(#fff9c4, #f59e0b)' }}
              />
              <div style={{ width: hasCandles ? 6 : 3, height: hasCandles ? 24 : 20, borderRadius: 4, background: hasCandles ? 'linear-gradient(#f9a8d4, #ec4899)' : 'linear-gradient(#fbbf24, #f59e0b)' }} />
            </div>
          ))}
        </div>
      )}

      {/* Декор */}
      {decorDots.length > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
          {decorDots.map((c, i) => (
            <motion.div key={i} animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.3 }}
              style={{ width: 14, height: 14, borderRadius: 99, backgroundColor: c, boxShadow: `0 2px 6px ${c}88` }} />
          ))}
        </motion.div>
      )}

      {/* Крем на верхнем слое */}
      <motion.div layout style={{ width: 105, height: 14, borderRadius: 99, background: 'linear-gradient(#fff, #fce4ec)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', zIndex: 3 }} />

      {/* Верхний слой */}
      <motion.div layout transition={{ duration: 0.4 }} style={style(100, 44, baseGrad)}>
        {inscription && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 9, color: '#fff', fontWeight: 600, fontFamily: 'cursive', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
              {inscription.slice(0, 10)}
            </span>
          </div>
        )}
      </motion.div>

      {/* Начинка (слой между) */}
      <motion.div layout transition={{ duration: 0.4 }}
        style={{ width: 144, height: 10, borderRadius: r, background: `linear-gradient(90deg, ${fillColor}cc, ${fillColor})`, boxShadow: `0 2px 8px ${fillColor}66`, zIndex: 2 }} />

      {/* Средний слой */}
      <motion.div layout transition={{ duration: 0.4 }} style={style(140, 52, baseGrad)} />

      {/* Начинка */}
      <motion.div layout transition={{ duration: 0.4 }}
        style={{ width: 184, height: 10, borderRadius: r, background: `linear-gradient(90deg, ${fillColor}cc, ${fillColor})`, boxShadow: `0 2px 8px ${fillColor}66`, zIndex: 2 }} />

      {/* Нижний слой */}
      <motion.div layout transition={{ duration: 0.4 }} style={style(180, 64, baseGrad)} />

      {/* Тарелка */}
      <div style={{ width: 210, height: 14, borderRadius: 99, background: 'linear-gradient(180deg, #f0ede8, #e7e5e4)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginTop: -2 }} />

      {/* Тень на полу */}
      <div style={{ width: 180, height: 10, borderRadius: 99, backgroundColor: 'rgba(0,0,0,0.06)', filter: 'blur(6px)', marginTop: 4 }} />
    </div>
  )
}
