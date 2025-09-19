import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  CreditCard, 
  Truck, 
  Shield, 
  Check, 
  User, 
  Phone, 
  MapPin, 
  Mail,
  ArrowLeft,
  ShoppingBag
} from "lucide-react";
import { generateWhatsAppMessage } from "../utils/whatsapp.js";

export default function Checkout() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "whatsapp"
  });

  const [errors, setErrors] = useState({});

  // Sample cart items (in real app, this would come from context/state)
  const cartItems = [
    {
      id: "1",
      title: "Premium Cotton T-Shirt",
      price: 599,
      quantity: 2,
      image: "/api/placeholder/80/80",
      size: "M",
      color: "Blue"
    },
    {
      id: "2",
      title: "Slim Fit Jeans",
      price: 1299,
      quantity: 1,
      image: "/api/placeholder/80/80",
      size: "32",
      color: "Dark Blue"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.floor(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order summary for WhatsApp
      const orderSummary = `
🛍️ *New Order from BOLT FIT*

👤 *Customer Details:*
Name: ${formData.firstName} ${formData.lastName}
Phone: +91-${formData.phone}
Email: ${formData.email || 'Not provided'}

📍 *Delivery Address:*
${formData.address}
${formData.city}, ${formData.state} - ${formData.pincode}

🛒 *Order Items:*
${cartItems.map(item => 
  `• ${item.title} (${item.size}, ${item.color}) x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`
).join('\n')}

💰 *Order Total:*
Subtotal: ₹${subtotal.toLocaleString()}
Shipping: ${shipping === 0 ? 'FREE' : `₹${shipping}`}
Tax: ₹${tax.toLocaleString()}
*Total: ₹${total.toLocaleString()}*

Order ID: #BF${Date.now()}
      `;

      // Generate WhatsApp link
      const whatsappUrl = generateWhatsAppMessage("Order Confirmation", orderSummary, formData.phone);
      
      // Navigate to order confirmation
      navigate('/order-confirmation', {
        state: {
          orderId: `BF${Date.now()}`,
          customerInfo: formData,
          orderItems: cartItems,
          orderTotal: total,
          whatsappUrl
        }
      });

    } catch (error) {
      console.error('Order submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Information", icon: User },
    { number: 2, title: "Review", icon: Check },
    { number: 3, title: "Confirmation", icon: ShoppingBag }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate('/cart')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-8 font-medium"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Cart
        </motion.button>

        {/* Progress Steps */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <step.icon size={20} />
                </div>
                <span className={`ml-3 font-medium ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-sm p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Checkout Information</h2>

              <form onSubmit={handleSubmit}>
                {/* Customer Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <User size={20} className="mr-2 text-blue-600" />
                    Customer Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone size={16} className="inline mr-1" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter 10-digit phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail size={16} className="inline mr-1" />
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <MapPin size={20} className="mr-2 text-blue-600" />
                    Shipping Address
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your complete address"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="City"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.state ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="State"
                        />
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.pincode ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="000000"
                          maxLength={6}
                        />
                        {errors.pincode && (
                          <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <CreditCard size={20} className="mr-2 text-blue-600" />
                    Payment Method
                  </h3>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="whatsapp"
                        name="paymentMethod"
                        value="whatsapp"
                        checked={formData.paymentMethod === "whatsapp"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <label htmlFor="whatsapp" className="ml-3 flex items-center">
                        <div className="bg-green-500 p-2 rounded-full mr-3">
                          <Phone size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">WhatsApp Order Confirmation</p>
                          <p className="text-sm text-gray-600">
                            Complete your order via WhatsApp for personalized service
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing Order...
                    </div>
                  ) : (
                    'Complete Order via WhatsApp'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-sm p-6 sticky top-8"
            >
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                      <p className="text-gray-600 text-xs">
                        {item.size} | {item.color} | Qty: {item.quantity}
                      </p>
                      <p className="font-semibold text-green-600">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (GST)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <Shield size={24} className="text-green-600 mb-2" />
                    <span className="text-xs text-gray-600">Secure Checkout</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Truck size={24} className="text-blue-600 mb-2" />
                    <span className="text-xs text-gray-600">Fast Delivery</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
