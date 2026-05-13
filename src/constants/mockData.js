export const PRODUCTS = [
  {
    id: 1,
    name: 'Торт "Медовик"',
    price: 4500,
    category: 'cake',
    venue: 'Кондитерская "Сладкий дом"',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    rating: 4.8,
    description: 'Классический медовый торт с нежным кремом из сметаны.',
  },
  {
    id: 2,
    name: 'Торт "Наполеон"',
    price: 5200,
    category: 'cake',
    venue: 'Кондитерская "Сладкий дом"',
    image: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=400',
    rating: 4.9,
    description: 'Слоёный торт с заварным кремом. Тает во рту.',
  },
  {
    id: 3,
    name: 'Шоколадный брауни',
    price: 1200,
    category: 'pastry',
    venue: 'Пекарня "Уют"',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
    rating: 4.7,
    description: 'Плотный шоколадный брауни с хрустящей корочкой.',
  },
  {
    id: 4,
    name: 'Макаруны (набор 6 шт)',
    price: 2800,
    category: 'pastry',
    venue: 'Пекарня "Уют"',
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400',
    rating: 4.6,
    description: 'Французские макаруны разных вкусов.',
  },
  {
    id: 5,
    name: 'Чизкейк "Нью-Йорк"',
    price: 3800,
    category: 'cake',
    venue: 'Кафе "Десерт"',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
    rating: 4.5,
    description: 'Нежный сливочный чизкейк на песочной основе.',
  },
  {
    id: 6,
    name: 'Эклеры (набор 4 шт)',
    price: 1800,
    category: 'pastry',
    venue: 'Кафе "Десерт"',
    image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400',
    rating: 4.4,
    description: 'Классические эклеры с заварным кремом и шоколадной глазурью.',
  },
]

export const VENUES = [
  { id: 1, name: 'Кондитерская "Сладкий дом"' },
  { id: 2, name: 'Пекарня "Уют"' },
  { id: 3, name: 'Кафе "Десерт"' },
]

export const CATEGORIES = [
  { id: 'all', label: 'Все' },
  { id: 'cake', label: 'Торты' },
  { id: 'pastry', label: 'Выпечка' },
]

export const CONSTRUCTOR_OPTIONS = {
  bases: [
    { id: 'biscuit', label: 'Бисквит', price: 0 },
    { id: 'honey', label: 'Медовый', price: 300 },
    { id: 'napoleon', label: 'Слоёный', price: 500 },
    { id: 'chocolate', label: 'Шоколадный', price: 400 },
  ],
  fillings: [
    { id: 'cream', label: 'Сливочный крем', price: 0 },
    { id: 'chocolate', label: 'Шоколадный крем', price: 300 },
    { id: 'fruit', label: 'Фруктовый джем', price: 400 },
    { id: 'condensed', label: 'Варёная сгущёнка', price: 200 },
  ],
  sizes: [
    { id: 'small', label: '1 кг (до 6 чел)', price: 3000 },
    { id: 'medium', label: '2 кг (до 12 чел)', price: 5500 },
    { id: 'large', label: '3 кг (до 20 чел)', price: 8000 },
  ],
  shapes: [
    { id: 'round', label: 'Круглый', price: 0 },
    { id: 'square', label: 'Квадратный', price: 200 },
    { id: 'heart', label: 'Сердце', price: 500 },
  ],
  decorations: [
    { id: 'none', label: 'Без декора', price: 0 },
    { id: 'flowers', label: 'Цветы из крема', price: 800 },
    { id: 'berries', label: 'Свежие ягоды', price: 1200 },
    { id: 'figures', label: 'Сахарные фигурки', price: 600 },
  ],
  extras: [
    { id: 'candles', label: 'Свечи', price: 200 },
    { id: 'sparklers', label: 'Бенгальские огни', price: 300 },
    { id: 'topper', label: 'Топпер', price: 500 },
    { id: 'box', label: 'Подарочная коробка', price: 400 },
  ],
}

export const ORDER_STATUSES = {
  bidding: { label: 'Приём ставок', color: 'text-purple-600 bg-purple-50' },
  pending: { label: 'Ожидает подтверждения', color: 'text-yellow-600 bg-yellow-50' },
  confirmed: { label: 'Подтверждён', color: 'text-blue-600 bg-blue-50' },
  preparing: { label: 'Готовится', color: 'text-orange-600 bg-orange-50' },
  ready: { label: 'Готов', color: 'text-green-600 bg-green-50' },
  delivered: { label: 'Доставлен', color: 'text-gray-600 bg-gray-100' },
  cancelled: { label: 'Отменён', color: 'text-red-600 bg-red-50' },
}
