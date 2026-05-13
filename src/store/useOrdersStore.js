import { create } from 'zustand'

const useOrdersStore = create((set, get) => ({
  orders: [
    {
      id: 'TND-001',
      type: 'tender',
      status: 'bidding',
      estimatedPrice: 10000,
      items: [{ id: 'c1', name: 'Торт на заказ (2 кг)', price: 10000, quantity: 1, isCustom: true }],
      bids: [
        { id: 'b1', venueId: 2, venueName: 'Лакомка', price: 9400, createdAt: '2026-05-04T10:00:00' },
        { id: 'b2', venueId: 3, venueName: 'Samal Cakes', price: 8800, createdAt: '2026-05-04T10:30:00' },
      ],
      acceptedBidId: null,
      total: 10000,
      name: 'Алия', phone: '+7 700 123 45 67',
      delivery: 'delivery', address: 'ул. Абая 12, кв. 5',
      userId: 1, createdAt: '2026-05-04T09:00:00',
      cakeDetails: { base: 'Медовый', filling: 'Сливочный крем', size: '2 кг', shape: 'Круглый', decoration: 'Ягоды', inscription: 'С днём рождения!' },
    },
    {
      id: 'ORD-001',
      type: 'direct',
      status: 'preparing',
      items: [{ id: 1, name: 'Торт "Медовик"', price: 4500, quantity: 1 }],
      total: 4500, bids: [],
      name: 'Алия', phone: '+7 700 123 45 67',
      delivery: 'delivery', address: 'ул. Абая 12, кв. 5',
      userId: 1, createdAt: '2026-05-03T10:00:00', venue: 'Кондитерская "Сладкий дом"',
    },
    {
      id: 'ORD-002',
      type: 'direct',
      status: 'delivered',
      items: [{ id: 3, name: 'Шоколадный брауни', price: 1200, quantity: 2 }],
      total: 2400, bids: [],
      name: 'Алия', phone: '+7 700 123 45 67',
      delivery: 'pickup', address: '',
      userId: 1, createdAt: '2026-04-28T14:30:00', venue: 'Пекарня "Уют"',
    },
  ],

  addOrder: (order) => {
    const id = order.type === 'tender'
      ? `TND-${String(get().orders.filter(o => o.type === 'tender').length + 1).padStart(3, '0')}`
      : `ORD-${String(get().orders.filter(o => o.type !== 'tender').length + 1).padStart(3, '0')}`
    const newOrder = { ...order, id, createdAt: new Date().toISOString(), bids: order.bids || [], acceptedBidId: null }
    set({ orders: [newOrder, ...get().orders] })
    return newOrder
  },

  addBid: (orderId, bid) => {
    const newBid = { ...bid, id: `b${Date.now()}`, createdAt: new Date().toISOString() }
    set({
      orders: get().orders.map((o) =>
        o.id === orderId ? { ...o, bids: [...(o.bids || []), newBid] } : o
      ),
    })
  },

  acceptBid: (orderId, bidId) => {
    set({
      orders: get().orders.map((o) =>
        o.id === orderId
          ? { ...o, acceptedBidId: bidId, status: 'confirmed', total: o.bids.find(b => b.id === bidId)?.price || o.total }
          : o
      ),
    })
  },

  updateStatus: (id, status) =>
    set({ orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)) }),
}))

export default useOrdersStore
