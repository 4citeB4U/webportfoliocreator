import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function QRCodeDisplay() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Get the current URL for QR code
      if (typeof window !== 'undefined') {
        const domains = import.meta.env.VITE_REPLIT_DOMAINS?.split(',') || [];
        const currentHost = window.location.host;
        // Ensure we use the same protocol (http/https) as the current page
        const protocol = window.location.protocol;

        // If we're already on a Replit domain, use the current URL
        if (domains.includes(currentHost)) {
          setUrl(window.location.href);
        } else {
          // Otherwise use the first Replit domain
          setUrl(`${protocol}//${domains[0] || 'agentlee.com'}`);
        }
      }
    } catch (err) {
      console.error('Error generating QR code URL:', err);
      setError('Unable to generate QR code at this time');
    }
  }, []);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Connect with AgentLee.com</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG 
            value={url}
            size={200}
            level="H"
            includeMargin={true}
            className="max-w-full h-auto"
          />
        </div>
      </CardContent>
    </Card>
  );
}