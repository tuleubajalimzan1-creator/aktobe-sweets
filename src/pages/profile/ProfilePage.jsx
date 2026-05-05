import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import useOrdersStore from '../../store/useOrdersStore'

export default function ProfilePage() {
  const { user, role, logout } = useAuthStore()
  const orders = useOrdersStore((s) => s.orders)
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">👤</div>
        <p className="text-gray-500 mb-4">Войдите в аккаунт</p>
        <Link to="/login" className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold">
          Войти
        </Link>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const ROLE_LABELS = { user: 'Покупатель', venue: 'Заведение', admin: 'Администратор' }
  const ROLE_ICONS = { user: '👤', venue: '🏪', admin: '🔑' }

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Аватар и имя */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-3xl p-6 text-center">
        <div className="text-6xl mb-3">{ROLE_ICONS[role]}</div>
        <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
        <p className="text-gray-400 text-sm">{user.email}</p>
        <span className="inline-block mt-2 text-xs font-semibold bg-white text-pink-500 px-3 py-1 rounded-full">
          {ROLE_LABELS[role]}
        </span>
      </div>

      {/* Меню */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        <MenuItem to="/orders" icon="📦" label="Мои заказы" sub={`${orders.length} заказов`} />
        {role === 'venue' && (
          <MenuItem to="/venue" icon="🏪" label="Панель заведения" sub="Управление заказами" />
        )}
        {role === 'admin' && (
          <MenuItem to="/admin" icon="🔑" label="Админ-панель" sub="Управление системой" />
        )}
        <MenuItem to="/catalog" icon="🍰" label="Каталог" sub="Смотреть товары" />
        <MenuItem to="/constructor" icon="✨" label="Конструктор" sub="Собрать торт" />
      </div>

      {/* Выйти */}
      <button
        onClick={handleLogout}
        className="w-full border border-red-100 text-red-400 hover:bg-red-50 py-3 rounded-2xl font-semibold transition"
      >
        Выйти из аккаунта
      </button>
    </div>
  )
}

function MenuItem({ to, icon, label, sub }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition first:rounded-t-2xl last:rounded-b-2xl"
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="font-semibold text-gray-700 text-sm">{label}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
      <span className="text-gray-300">›</span>
    </Link>
  )
}
