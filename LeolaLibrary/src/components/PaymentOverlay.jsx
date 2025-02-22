import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Debug: Log the Stripe key to verify it's available
console.log('Stripe key available:', !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : Promise.reject(new Error('Stripe publishable key is not configured'));

interface PaymentOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
}

export function PaymentOverlay({ isOpen, onClose, bookTitle }: PaymentOverlayProps) {
  const [currentUrl, setCurrentUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Generate the canonical URL for the book using window.location
    const bookPath = encodeURIComponent('needle-and-yarn-a-love-stitched-in-time');
    const canonicalUrl = `${window.location.origin}/book/${bookPath}`;
    console.log('Setting QR code URL:', canonicalUrl); // Debug: Log the URL
    setCurrentUrl(canonicalUrl);
  }, []);

  useEffect(() => {
    let expressCheckoutElement: any = null;

    async function initializeStripe() {
      if (!isOpen) return;

      try {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Failed to initialize Stripe. Please check your configuration.');
        }

        const elements = stripe.elements({
          mode: 'payment',
          amount: 200, // $2.00
          currency: 'usd',
          appearance: {
            theme: 'stripe',
            variables: {
              borderRadius: '8px',
            },
          },
        });

        expressCheckoutElement = elements.create('expressCheckout');
        const container = document.getElementById('express-checkout-element');
        if (container) {
          expressCheckoutElement.mount('#express-checkout-element');
        }
      } catch (err) {
        console.error('Stripe initialization error:', err);
        setError(err instanceof Error ? err.message : 'Payment system initialization failed');
      }
    }

    initializeStripe();

    // Cleanup function
    return () => {
      if (expressCheckoutElement) {
        expressCheckoutElement.destroy();
      }
    };
  }, [isOpen]); // Only re-run when isOpen changes

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Support the Author</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">{bookTitle}</p>
            <p className="text-sm text-gray-600 mt-2">
              Your $2 gift helps Leola continue her writing journey and share more heartwarming stories with the world.
            </p>
          </div>

          {error ? (
            <div className="text-red-500 text-center p-4 border border-red-200 rounded">
              {error}
            </div>
          ) : (
            <div className="border-t border-b border-gray-200 py-4">
              <div id="express-checkout-element" className="min-h-[40px]" />
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Share this story:</p>
            <div className="inline-block bg-white p-4 rounded-lg shadow-sm">
              <QRCodeSVG
                value={currentUrl}
                size={128}
                level="L"
                includeMargin={true}
                className="mx-auto"
              />
              <p className="text-xs text-gray-500 mt-2 break-all">
                <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {currentUrl}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}