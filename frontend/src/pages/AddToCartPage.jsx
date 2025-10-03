import React from 'react';
import { useCart } from '../context/CartContext'; // adjust path if needed
import { useNavigate } from 'react-router-dom';

export default function AddToCartPage() {
  const { items, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 20,
          color: '#10B981',
          background: 'linear-gradient(135deg, #D1FAE5, #FFFFFF)',
          padding: 20,
          textAlign: 'center',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        Your cart is empty.
      </div>
    );
  }

  function handleIncrease(item) {
    addToCart({ ...item, quantity: 1 });
  }

  function handleDecrease(item) {
    if (item.quantity === 1) {
      removeFromCart(item.id, item.selectedSize, item.selectedColor);
    } else {
      addToCart({ ...item, quantity: -1 });
    }
  }

  function goToProductDetails(productId) {
    navigate(`/product/${productId}`);
  }

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #D1FAE5, #FFFFFF)',
        minHeight: '100vh',
        paddingBottom: 100,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1
        style={{
          color: '#047857',
          textAlign: 'center',
          margin: '20px 0',
          fontWeight: '700',
          fontSize: '1.9rem',
          letterSpacing: '0.04em',
        }}
      >
        Your Shopping Cart
      </h1>

      <div style={{ maxWidth: 600, margin: 'auto', padding: '0 10px' }}>
        {items.map((item, index) => (
          <div
            key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
            style={{
              backgroundColor: '#fff',
              borderRadius: 15,
              padding: 15,
              marginBottom: 20,
              boxShadow:
                '0 6px 15px rgba(16, 185, 129, 0.2), 0 0 0 1.5px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 15,
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s ease',
            }}
            onClick={() => goToProductDetails(item.id)}
            onKeyDown={e => {
              if (e.key === 'Enter') goToProductDetails(item.id);
            }}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${item.title}`}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow =
                '0 8px 24px rgba(16, 185, 129, 0.35), 0 0 0 2px rgba(16, 185, 129, 0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow =
                '0 6px 15px rgba(16, 185, 129, 0.2), 0 0 0 1.5px rgba(16, 185, 129, 0.3)';
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: 100,
                height: 100,
                objectFit: 'cover',
                borderRadius: 12,
                flexShrink: 0,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              }}
            />
            <div style={{ flex: '1 1 250px', minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  color: '#065F46',
                  overflowWrap: 'break-word',
                }}
                title={item.title}
              >
                {item.title}
              </div>
              <div
                style={{
                  color: '#10B981',
                  marginTop: 4,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Seller: <span style={{ fontWeight: 'normal' }}>{item.seller || 'PRESTIGE COLLECTION'}</span>
              </div>
              <div style={{ marginTop: 10, fontSize: 14, color: '#065F46' }}>
                <span
                  style={{
                    backgroundColor: '#D1FAE5',
                    color: '#065F46',
                    fontWeight: 600,
                    padding: '5px 10px',
                    borderRadius: 10,
                    marginRight: 12,
                    userSelect: 'none',
                  }}
                >
                  Size: {item.selectedSize || 'N/A'}
                </span>
                <span
                  style={{
                    backgroundColor: '#D1FAE5',
                    color: '#065F46',
                    fontWeight: 600,
                    padding: '5px 10px',
                    borderRadius: 10,
                    userSelect: 'none',
                  }}
                >
                  Color: {item.selectedColor || 'N/A'}
                </span>
              </div>
              <div
                style={{
                  marginTop: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleDecrease(item);
                  }}
                  aria-label="Decrease quantity"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 14,
                    border: '2px solid #10B981',
                    background: '#fff',
                    color: '#10B981',
                    fontWeight: 'bold',
                    fontSize: 22,
                    cursor: 'pointer',
                    userSelect: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    minWidth: 30,
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 20,
                    color: '#065F46',
                    userSelect: 'none',
                  }}
                >
                  {item.quantity}
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleIncrease(item);
                  }}
                  aria-label="Increase quantity"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 14,
                    border: '2px solid #10B981',
                    background: '#10B981',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 22,
                    cursor: 'pointer',
                    userSelect: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  +
                </button>
              </div>

              <div
                style={{
                  marginTop: 14,
                  fontWeight: 700,
                  color: '#065F46',
                  fontSize: 20,
                }}
              >
                ₹{item.price * item.quantity}
              </div>
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                removeFromCart(item.id, item.selectedSize, item.selectedColor);
              }}
              aria-label={`Remove ${item.title} from cart`}
              style={{
                color: '#fff',
                backgroundColor: '#DC2626',
                border: 'none',
                borderRadius: 14,
                padding: '12px 18px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 6px 8px rgba(220, 38, 38, 0.5)',
                flexShrink: 0,
                userSelect: 'none',
                marginTop: 10,
                height: 42,
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Sticky Checkout Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderTop: '2px solid #D1FAE5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: 600,
          margin: '0 auto',
          padding: '15px 20px',
          boxShadow: '0 -3px 6px rgba(16, 185, 129, 0.35)',
          fontWeight: '700',
          fontSize: 20,
          color: '#065F46',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          zIndex: 1000,
        }}
      >
        <div>Total: ₹{totalPrice.toFixed(2)}</div>
        <button
          style={{
            backgroundColor: '#10B981',
            color: '#fff',
            border: 'none',
            borderRadius: 15,
            padding: '12px 25px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 6px 10px rgba(16, 185, 129, 0.6)',
            userSelect: 'none',
          }}
          onClick={() => alert('Proceed to Checkout')}
          aria-label="Proceed to checkout"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
