'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'

type CartItem = {
  id: string
  name: string
  price: string
  image: string
  accent: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void
  updateQuantity: (id: string, quantity: number) => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'terrain-studio-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) setItems(JSON.parse(saved) as CartItem[])
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [hydrated, items])

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((total, item) => total + item.quantity, 0),
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem: (next) => {
      setItems((current) => {
        const found = current.find((item) => item.id === next.name)
        if (found) {
          return current.map((item) => item.id === found.id ? { ...item, quantity: item.quantity + 1 } : item)
        }
        return [...current, { ...next, id: next.name, quantity: 1 }]
      })
      setIsOpen(true)
    },
    updateQuantity: (id, quantity) => {
      setItems((current) => quantity < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item))
    },
  }), [isOpen, items])

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}

function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity } = useCart()
  const total = items.reduce((sum, item) => sum + Number(item.price.replace(/[^\d.]/g, '')) * item.quantity, 0)
  const enquiry = items.length
    ? `mailto:studio@terrain.studio?subject=${encodeURIComponent('TERRAIN studio request')}&body=${encodeURIComponent(`Hello TERRAIN,\n\nI would like to enquire about:\n${items.map((item) => `${item.quantity} × ${item.name}`).join('\n')}\n\nThank you.`)}`
    : 'mailto:studio@terrain.studio?subject=TERRAIN%20studio%20request'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            aria-label="Close bag"
            className="fixed inset-0 z-[180] cursor-default bg-black/65 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed bottom-0 right-0 top-0 z-[190] flex w-full max-w-md flex-col border-l border-white/10 bg-[#09090b] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.38em] text-white/45">Private selection</p>
                <h2 className="display mt-1 text-4xl text-white">YOUR BAG</h2>
              </div>
              <button onClick={closeCart} aria-label="Close bag" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/50 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 flex-1 overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="h-8 w-8 text-white/25" />
                  <p className="mt-4 text-sm text-white/55">Your selection is waiting to be made.</p>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 border-b border-white/10 pb-5">
                      <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white/[0.04]">
                        <img src={item.image} alt="" className="h-full w-full object-contain p-2" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: item.accent }}>TERRAIN studio</p>
                        <p className="mt-1 text-sm font-medium text-white">{item.name}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-white/15">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Remove one ${item.name}`} className="grid h-7 w-7 place-items-center text-white/60 hover:text-white"><Minus className="h-3 w-3" /></button>
                            <span className="w-6 text-center text-xs tabular-nums">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Add one ${item.name}`} className="grid h-7 w-7 place-items-center text-white/60 hover:text-white"><Plus className="h-3 w-3" /></button>
                          </div>
                          <span className="text-sm text-white/80">{item.price}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="flex justify-between text-sm text-white/65"><span>Estimated total</span><span className="text-white">${total.toLocaleString()}</span></div>
              <a href={enquiry} className="mt-5 flex w-full items-center justify-center rounded-full bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-black transition-transform hover:scale-[1.01]">
                Enquire about this selection
              </a>
              <p className="mt-3 text-center text-[10px] leading-relaxed text-white/40">Each piece is released in limited quantities. An atelier concierge will confirm availability.</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
