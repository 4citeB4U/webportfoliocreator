import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const QRCodeDisplay = ({ url, size = 128 }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (url) {
      QRCode.toDataURL(url, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
        .then(dataUrl => setQrDataUrl(dataUrl))
        .catch(err => console.error('Error generating QR code:', err));
    }
  }, [url, size]);

  if (!qrDataUrl) return null;

  return (
    <div className="inline-block bg-white p-2 rounded shadow-sm">
      <img
        src={qrDataUrl}
        alt="QR Code"
        width={size}
        height={size}
        className="max-w-full"
      />
    </div>
  );
};

export default QRCodeDisplay;
