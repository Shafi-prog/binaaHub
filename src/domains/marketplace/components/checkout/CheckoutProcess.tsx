import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Building, 
  Truck, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useCart } from './MultiStoreCart';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  city: string;
  district: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'cod' | 'installment';
  name: string;
  details: string;
  icon: string;
  isDefault: boolean;
}

interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  estimatedDelivery: string;
}

const CheckoutProcess: React.FC = () => {
  const { carts, totalAmount } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
    estimatedDelivery: ''
  });

  const steps = [
    { id: 1, title: 'Shipping Address', icon: MapPin },
    { id: 2, title: 'Payment Method', icon: CreditCard },
    { id: 3, title: 'Order Review', icon: CheckCircle },
    { id: 4, title: 'Confirmation', icon: Shield }
  ];

  useEffect(() => {
    loadAddresses();
    loadPaymentMethods();
    calculateOrderSummary();
  }, [carts]);

  const loadAddresses = () => {
    const mockAddresses: Address[] = [
      {
        id: '1',
        type: 'home',
        name: 'Ahmed Al-Rashid',
        street: 'Al-Olaya Street, Building 123, Apt 45',
        city: 'Riyadh',
        district: 'Al-Olaya',
        postalCode: '11564',
        phone: '+966501234567',
        isDefault: true
      },
      {
        id: '2',
        type: 'work',
        name: 'Ahmed Al-Rashid',
        street: 'King Fahd Road, Tower 2, Floor 15',
        city: 'Riyadh',
        district: 'Al-Muraba',
        postalCode: '11432',
        phone: '+966501234567',
        isDefault: false
      }
    ];
    
    setAddresses(mockAddresses);
    setSelectedAddress(mockAddresses.find(addr => addr.isDefault)?.id || '');
  };

  const loadPaymentMethods = () => {
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: '1',
        type: 'card',
        name: 'Credit Card',
        details: 'Visa, MasterCard, Mada',
        icon: '💳',
        isDefault: true
      },
      {
        id: '2',
        type: 'wallet',
        name: 'STC Pay',
        details: 'Pay with your STC Pay wallet',
        icon: '📱',
        isDefault: false
      },
      {
        id: '3',
        type: 'cod',
        name: 'Cash on Delivery',
        details: 'Pay when you receive your order',
        icon: '💵',
        isDefault: false
      },
      {
        id: '4',
        type: 'installment',
        name: 'Installment',
        details: 'Pay in 3 or 6 monthly installments',
        icon: '📊',
        isDefault: false
      }
    ];
    
    setPaymentMethods(mockPaymentMethods);
    setSelectedPayment(mockPaymentMethods.find(payment => payment.isDefault)?.id || '');
  };

  const calculateOrderSummary = () => {
    const subtotal = Object.values(carts).reduce((sum, cart) => {
        return sum + cart.reduce((cartSum, item) => cartSum + (item.price * item.quantity), 0);
      }, 0);
    const shipping = Object.keys(carts).length * 5; // $5 shipping per store
    const tax = subtotal * 0.15; // 15% VAT
    const discount = 0; // No discount for now
    const total = subtotal + shipping + tax - discount;
    
    setOrderSummary({
      subtotal,
      shipping,
      tax,
      discount,
      total,
      estimatedDelivery: '2-3 business days'
    });
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Move to confirmation step
      setCurrentStep(4);
      
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep >= step.id 
              ? 'bg-orange-500 border-orange-500 text-white' 
              : 'border-gray-300 text-gray-400'
          }`}>
            {currentStep > step.id ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <step.icon className="w-5 h-5" />
            )}
          </div>
          
          <span className={`ml-3 text-sm font-medium ${
            currentStep >= step.id ? 'text-orange-600' : 'text-gray-500'
          }`}>
            {step.title}
          </span>
          
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-4 ${
              currentStep > step.id ? 'bg-orange-500' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const AddressStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Select Shipping Address</h3>
      
      {addresses.map(address => (
        <div 
          key={address.id}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedAddress === address.id 
              ? 'border-orange-500 bg-orange-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSelectedAddress(address.id)}
        >
          <div className="flex items-start space-x-3">
            <input
              type="radio"
              checked={selectedAddress === address.id}
              onChange={() => setSelectedAddress(address.id)}
              className="mt-1"
            />
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold">{address.name}</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {address.type}
                </span>
                {address.isDefault && (
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-1">{address.street}</p>
              <p className="text-gray-600 text-sm mb-1">
                {address.district}, {address.city} {address.postalCode}
              </p>
              <p className="text-gray-600 text-sm">{address.phone}</p>
            </div>
          </div>
        </div>
      ))}
      
      <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 transition-colors" onClick={() => alert('Button clicked')}>
        <div className="flex items-center justify-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>Add New Address</span>
        </div>
      </button>
    </div>
  );

  const PaymentStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
      
      {paymentMethods.map(payment => (
        <div
          key={payment.id}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedPayment === payment.id
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSelectedPayment(payment.id)}
        >
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              checked={selectedPayment === payment.id}
              onChange={() => setSelectedPayment(payment.id)}
            />
            
            <div className="text-2xl">{payment.icon}</div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold">{payment.name}</span>
                {payment.isDefault && (
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm">{payment.details}</p>
            </div>
          </div>
        </div>
      ))}
      
      {selectedPayment === '1' && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3">Card Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="Ahmed Al-Rashid"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ReviewStep = () => {
    const selectedAddr = addresses.find(addr => addr.id === selectedAddress);
    const selectedPay = paymentMethods.find(pay => pay.id === selectedPayment);
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Order Review</h3>
        
        {/* Order Items */}
        <div className="space-y-4">
          {Object.entries(carts).map(([storeId, items]) => {
            const cartSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const cartShippingCost = 5; // $5 per store
            const freeShippingThreshold = 100;
            
            return (
            <div key={storeId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Building className="w-5 h-5 text-gray-600" />
                <span className="font-semibold">Store {storeId}</span>
              </div>
              
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img 
                      src="/placeholder-product.jpg" 
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">{item.price * item.quantity} SAR</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{cartSubtotal} SAR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{cartSubtotal >= freeShippingThreshold ? 'Free' : `${cartShippingCost} SAR`}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>Estimated Delivery</span>
                  </div>
                  <span>3-5 business days</span>
                </div>
              </div>
            </div>
          );
          })}
        </div>
        
        {/* Shipping Address */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-600" />
            <span>Shipping Address</span>
          </h4>
          
          {selectedAddr && (
            <div>
              <p className="font-medium">{selectedAddr.name}</p>
              <p className="text-gray-600">{selectedAddr.street}</p>
              <p className="text-gray-600">{selectedAddr.district}, {selectedAddr.city} {selectedAddr.postalCode}</p>
              <p className="text-gray-600">{selectedAddr.phone}</p>
            </div>
          )}
        </div>
        
        {/* Payment Method */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <span>Payment Method</span>
          </h4>
          
          {selectedPay && (
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{selectedPay.icon}</span>
              <div>
                <p className="font-medium">{selectedPay.name}</p>
                <p className="text-gray-600 text-sm">{selectedPay.details}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Notes */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Order Notes (Optional)</h4>
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Add any special instructions for your order..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            rows={3}
          />
        </div>
      </div>
    );
  };

  const ConfirmationStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900">Order Confirmed!</h3>
      
      <p className="text-gray-600 max-w-md mx-auto">
        Thank you for your order. We've sent a confirmation email with your order details.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Order Number:</span>
            <span className="text-orange-600">#BIN-2024-001</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total Amount:</span>
            <span className="font-bold">{orderSummary.total} SAR</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Estimated Delivery:</span>
            <span>{orderSummary.estimatedDelivery}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <button className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors" onClick={() => alert('Button clicked')}>
          Track Your Order
        </button>
        
        <button className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors" onClick={() => alert('Button clicked')}>
          Continue Shopping
        </button>
      </div>
    </div>
  );

  const OrderSummaryPanel = () => (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{orderSummary.subtotal} SAR</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{orderSummary.shipping === 0 ? 'Free' : `${orderSummary.shipping} SAR`}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (15%)</span>
          <span>{orderSummary.tax.toFixed(2)} SAR</span>
        </div>
        {orderSummary.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{orderSummary.discount} SAR</span>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{orderSummary.total.toFixed(2)} SAR</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Estimated delivery: {orderSummary.estimatedDelivery}
        </p>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 text-blue-600">
          <Shield className="w-5 h-5" />
          <span className="font-semibold">Secure Checkout</span>
        </div>
        <p className="text-sm text-blue-600 mt-1">
          Your payment information is encrypted and secure
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StepIndicator />
          
          {currentStep === 1 && <AddressStep />}
          {currentStep === 2 && <PaymentStep />}
          {currentStep === 3 && <ReviewStep />}
          {currentStep === 4 && <ConfirmationStep />}
          
          {currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              {currentStep < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span>{isProcessing ? 'Processing...' : 'Place Order'}</span>
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <OrderSummaryPanel />
        </div>
      </div>
    </div>
  );
};

export default CheckoutProcess;
