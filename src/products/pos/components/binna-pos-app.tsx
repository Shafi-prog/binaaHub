'use client'

import { useState } from 'react'
import { Button } from '../../../core/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../core/shared/components/ui/card'

interface Product {
  id: string
  name: string
  price: number
  barcode?: string
}

interface CartItem extends Product {
  quantity: number
}

export default function BinnaPOSApp() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)

  const sampleProducts: Product[] = [
    { id: '1', name: 'أسمنت بورتلاندي', price: 25.50, barcode: '1234567890123' },
    { id: '2', name: 'حديد تسليح 12 مم', price: 850.00, barcode: '2345678901234' },
    { id: '3', name: 'رمل أبيض', price: 45.00, barcode: '3456789012345' },
    { id: '4', name: 'طوب أحمر', price: 0.75, barcode: '4567890123456' },
  ]

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
    setTotal(total + product.price)
  }

  const removeFromCart = (productId: string) => {
    const item = cart.find(item => item.id === productId)
    if (item) {
      if (item.quantity === 1) {
        setCart(cart.filter(item => item.id !== productId))
      } else {
        setCart(cart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ))
      }
      setTotal(total - item.price)
    }
  }

  const clearCart = () => {
    setCart([])
    setTotal(0)
  }

  const processPayment = () => {
    // Process payment logic here
    alert(`تم دفع ${total.toFixed(2)} ريال سعودي بنجاح!`)
    clearCart()
  }

  return (
    <div className="flex h-screen bg-gray-50 direction-rtl">
      {/* Product Grid */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">نظام نقاط البيع - بنا</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sampleProducts.map((product) => (
            <Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => addToCart(product)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  الباركود: {product.barcode}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {product.price.toFixed(2)} ر.س
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white border-l border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">سلة المشتريات</h2>
        
        <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">
                  {item.price.toFixed(2)} ر.س × {item.quantity}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}>
                  -
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button variant="outline" size="sm" onClick={() => addToCart(item)}>
                  +
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold">المجموع:</span>
            <span className="text-2xl font-bold text-green-600">
              {total.toFixed(2)} ر.س
            </span>
          </div>

          {/* Payment Buttons */}
          <div className="space-y-2">
            <Button className="w-full" onClick={processPayment} disabled={cart.length === 0}>
              دفع نقدي
            </Button>
            <Button variant="outline" className="w-full" onClick={processPayment} disabled={cart.length === 0}>
              دفع بالبطاقة (مدى)
            </Button>
            <Button variant="outline" className="w-full" onClick={processPayment} disabled={cart.length === 0}>
              دفع STC Pay
            </Button>
            <Button variant="destructive" className="w-full" onClick={clearCart} disabled={cart.length === 0}>
              مسح السلة
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold mb-2">المميزات:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ متوافق مع هيئة الزكاة والضريبة والجمارك</li>
            <li>✓ دعم المدفوعات المحلية (مدى، STC Pay)</li>
            <li>✓ إدارة المخزون في الوقت الفعلي</li>
            <li>✓ طباعة الفواتير المتوافقة</li>
            <li>✓ واجهة باللمس سهلة الاستخدام</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
