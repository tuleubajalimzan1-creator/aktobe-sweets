import { Link, useLocation } from 'react-router-dom'
import useCartStore from '../../store/useCartStore'
import useAuthStore from '../../store/useAuthStore'

export default function Header() {
  const location = useLocation()
  const items = useCartStore((s) => s.items)
  const { user, role, logout } = useAuthStore()

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const isActive = (path) =>
    location.pathname === path
      ? 'text-pink-600 font-semibold'
      : 'text-gray-600 hover:text-pink-500'

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Логотип */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎂</span>
            <span className="font-bold text-xl text-pink-600">Актобе Свитс</span>
          </Link>

          {/* Навигация — только на десктопе */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={isActive('/')}>Главная</Link>
            <Link to="/catalog" className={isActive('/catalog')}>Каталог</Link>
            <Link to="/constructor" className={isActive('/constructor')}>Конструктор</Link>
          </nav>

          {/* Правая часть */}
          <div className="flex items-center gap-3">

            {/* Корзина */}
            <Link to="/cart" className="relative p-2 text-2xl">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Авторизация */}
            {user ? (
              <div className="flex items-center gap-2">
                {role === 'admin' && (
                  <Link to="/admin" className="text-sm text-purple-600 hover:underline">Админ</Link>
                )}
                {role === 'venue' && (
                  <Link to="/venue" className="text-sm text-blue-600 hover:underline">Заведение</Link>
                )}
                <Link to="/profile" className="text-sm text-gray-700 hover:text-pink-500">
                  {user.name}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-gray-400 hover:text-red-400"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 py-2 rounded-full transition"
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Мобильная навигация — нижняя панель */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50">
        <MobileNavItem to="/" icon="🏠" label="Главная" active={location.pathname === '/'} />
        <MobileNavItem to="/catalog" icon="🍰" label="Каталог" active={location.pathname === '/catalog'} />
        <MobileNavItem to="/constructor" icon="✨" label="Конструктор" active={location.pathname === '/constructor'} />
        <MobileNavItem
          to="/cart"
          icon={`🛒${cartCount > 0 ? ` ${cartCount}` : ''}`}
          label="Корзина"
          active={location.pathname === '/cart'}
        />
        <MobileNavItem to="/profile" icon="👤" label="Профиль" active={location.pathname === '/profile'} />
      </nav>
    </>
  )
}

function MobileNavItem({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex-1 flex flex-col items-center justify-center py-2 text-xs transition ${
        active ? 'text-pink-600 font-semibold' : 'text-gray-400'
      }`}
    >
      <span className="text-xl leading-none mb-1">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
