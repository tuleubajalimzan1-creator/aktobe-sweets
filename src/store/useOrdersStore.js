import { create } from 'zustand'

const useOrdersStore = create((set, get) => ({
  orders: [
    {
      id: 'ORD-001',
      userId: 1,
      items: [{ id: 1, name: 'Торт "Медовик"', price: 4500, quantity: 1 }],
      total: 4500,
      status: 'preparing',
      delivery: 'delivery',
      address: 'ул. Абая 12, кв. 5',
      phone: '+7 700 123 45 67',
      name: 'Алия',
      createdAt: '2026-05-03T10:00:00',
      venue: 'Кондитерская "Сладкий дом"',
    },
    {
      id: 'ORD-002',
      userId: 1,
      items: [{ id: 3, name: 'Шоколадный брауни', price: 1200, quantity: 2 }],
      total: 2400,
      status: 'delivered',
      delivery: 'pickup',
      address: '',
      phone: '+7 700 123 45 67',
      name: 'Алия',
      createdAt: '2026-04-28T14:30:00',
      venue: 'Пекарня "Уют"',
    },
  ],

  addOrder: (order) => {
    const newOrder = {
      ...order,
      id: `ORD-${String(get().orders.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    }
    set({ orders: [newOrder, ...get().orders] })
    return newOrder
  },

  updateStatus: (id, status) =>
    set({
      orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }),
}))

export default useOrdersStore
