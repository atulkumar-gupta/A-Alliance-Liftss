import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { CartContext } from './cart-context'

function buildCartKey(item) {
  return item.id + '|' + (item.selectedThickness || '')
}

function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('spareparts-cart')
    return saved ? JSON.parse(saved) : []
  })

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(i => buildCartKey(i) === buildCartKey(item))
      let updated
      if (existingIdx > -1) {
        updated = prev.map((i, idx) => {
          if (idx === existingIdx) {
            return { ...i, qty: i.qty + 1 }
          }
          return i
        })
      } else {
        updated = [...prev, { ...item, qty: 1 }]
      }
      localStorage.setItem('spareparts-cart', JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeFromCart = useCallback((id, selectedThickness) => {
    setCart(prev => {
      const key = id + '|' + (selectedThickness || '')
      const updated = prev.filter(item => (item.id + '|' + (item.selectedThickness || '')) !== key)
      localStorage.setItem('spareparts-cart', JSON.stringify(updated))
      return updated
    })
  }, [])

  const updateQuantity = useCallback((id, selectedThickness, qty) => {
    setCart(prev => {
      const key = id + '|' + (selectedThickness || '')
      const updated = prev.map(item => {
        if ((item.id + '|' + (item.selectedThickness || '')) === key) {
          return { ...item, qty: Math.max(1, qty) }
        }
        return item
      })
      localStorage.setItem('spareparts-cart', JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    localStorage.removeItem('spareparts-cart')
  }, [])

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default CartProvider