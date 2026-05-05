import { Link } from 'react-router-dom'
import { PRODUCTS } from '../../constants/mockData'

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 3)

  return (
    <div className="space-y-12">

      {/* Герой-баннер */}
      <section className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-3xl px-8 py-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <p className="text-pink-500 font-medium text-sm uppercase tracking-wide">Город Актобе</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Торты и сладости <br />
            <span className="text-pink-500">с любовью</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Заказывайте десерты от лучших кондитерских города. Доставка или самовывоз.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/catalog"
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full transition"
            >
              Смотреть каталог
            </Link>
            <Link
              to="/constructor"
              className="bg-white hover:bg-pink-50 text-pink-500 font-semibold px-6 py-3 rounded-full border border-pink-200 transition"
            >
              Собрать свой торт ✨
            </Link>
          </div>
        </div>
        <div className="text-9xl select-none">🎂</div>
      </section>

      {/* Категории */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Что хотите?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORY_CARDS.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition hover:-translate-y-1 border border-gray-100"
            >
              <div className="text-4xl mb-2">{c.icon}</div>
              <div className="font-semibold text-gray-700">{c.label}</div>
              <div className="text-xs text-gray-400 mt-1">{c.sub}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Популярные товары */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Популярное</h2>
          <Link to="/catalog" className="text-pink-500 hover:underline text-sm font-medium">
            Все товары →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Баннер конструктора */}
      <section className="bg-gradient-to-r from-violet-500 to-pink-500 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Собери свой торт</h2>
          <p className="text-white/80">
            Выбери основу, начинку, оформление и надпись. Мы сделаем торт именно для тебя.
          </p>
        </div>
        <Link
          to="/constructor"
          className="bg-white text-pink-500 font-bold px-8 py-3 rounded-full hover:bg-pink-50 transition whitespace-nowrap"
        >
          Открыть конструктор
        </Link>
      </section>

      {/* Преимущества */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
        {BENEFITS.map((b) => (
          <div key={b.label} className="text-center space-y-2">
            <div className="text-3xl">{b.icon}</div>
            <div className="font-semibold text-gray-700 text-sm">{b.label}</div>
            <div className="text-xs text-gray-400">{b.sub}</div>
          </div>
        ))}
      </section>

    </div>
  )
}

function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition hover:-translate-y-1 border border-gray-100"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{product.venue}</p>
        <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-pink-500 font-bold text-lg">
            {product.price.toLocaleString()} ₸
          </span>
          <span className="text-xs text-gray-400">⭐ {product.rating}</span>
        </div>
      </div>
    </Link>
  )
}

const CATEGORY_CARDS = [
  { icon: '🎂', label: 'Торты', sub: 'На заказ и готовые', to: '/catalog' },
  { icon: '🥐', label: 'Выпечка', sub: 'Пирожные, эклеры', to: '/catalog' },
  { icon: '✨', label: 'Конструктор', sub: 'Собери сам', to: '/constructor' },
  { icon: '🎁', label: 'Подарки', sub: 'Наборы и боксы', to: '/catalog' },
]

const BENEFITS = [
  { icon: '🚀', label: 'Быстрая доставка', sub: 'По всему Актобе' },
  { icon: '👨‍🍳', label: 'Местные мастера', sub: 'Проверенные кондитеры' },
  { icon: '💳', label: 'Удобная оплата', sub: 'Kaspi, наличные' },
  { icon: '⭐', label: 'Гарантия качества', sub: 'Или вернём деньги' },
]
