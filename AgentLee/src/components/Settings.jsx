import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Settings as SettingsIcon, Share2, Volume2, Sparkles, LogOut } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { useAuth } from "../hooks/use-auth";

export default function Settings({ onVoiceChange }) {
  const { logoutMutation } = useAuth();
  const [showQRCode, setShowQRCode] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [url, setUrl] = useState('');
  const [particleSpeed, setParticleSpeed] = useState(4);
  const [particleColor, setParticleColor] = useState('#ffffff');

  useEffect(() => {
    // Get available voices
    const synth = window.speechSynthesis;

    const updateVoices = () => {
      const availableVoices = synth.getVoices();
      // Filter for English voices and sort by name
      const englishVoices = availableVoices
        .filter(voice => voice.lang.startsWith('en'))
        .sort((a, b) => a.name.localeCompare(b.name));
      setVoices(englishVoices);

      // Set Microsoft Andrew Online as default if available
      if (englishVoices.length > 0 && !selectedVoice) {
        const microsoftAndrew = englishVoices.find(v => v.name === 'Microsoft Andrew Online (Natural) - English (United States)');
        if (microsoftAndrew) {
          console.log('Found Microsoft Andrew Online voice:', microsoftAndrew.name);
          setSelectedVoice(microsoftAndrew.voiceURI);
          onVoiceChange(microsoftAndrew);
        } else {
          console.log('Available voices:', englishVoices.map(v => v.name).join(', '));
          // Fallback to first English voice if Microsoft Andrew is not available
          const defaultVoice = englishVoices[0];
          setSelectedVoice(defaultVoice.voiceURI);
          onVoiceChange(defaultVoice);
        }
      }
    };

    // Initial load
    updateVoices();

    // Handle dynamic loading of voices
    synth.addEventListener('voiceschanged', updateVoices);

    // Get current URL for QR code
    if (typeof window !== 'undefined') {
      const domains = import.meta.env.VITE_REPLIT_DOMAINS?.split(',') || [];
      setUrl(domains[0] || window.location.href);
    }

    return () => synth.removeEventListener('voiceschanged', updateVoices);
  }, []);

  const handleVoiceChange = (voiceURI) => {
    const voice = voices.find(v => v.voiceURI === voiceURI);
    if (voice) {
      setSelectedVoice(voiceURI);
      onVoiceChange(voice);
    }
  };

  const handleParticleSpeedChange = (value) => {
    setParticleSpeed(value[0]);
    const particlesJS = window.pJSDom?.[0]?.pJS;
    if (particlesJS) {
      particlesJS.particles.move.speed = value[0];
    }
  };

  const handleParticleColorChange = (color) => {
    setParticleColor(color);
    const particlesJS = window.pJSDom?.[0]?.pJS;
    if (particlesJS) {
      particlesJS.particles.color.value = color;
      particlesJS.particles.line_linked.color = color;
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white border-none"
          >
            <SettingsIcon className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-black/90 border border-green-500">
          <DropdownMenuLabel className="text-green-400">Settings</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-green-500/20" />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Volume2 className="mr-2 h-4 w-4" />
                <span>Voice Settings</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-2 bg-black/90 border border-green-500">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-green-400">Select Voice</label>
                    <Select
                      value={selectedVoice}
                      onValueChange={handleVoiceChange}
                    >
                      <SelectTrigger className="w-full bg-black/50 border-green-500/50">
                        <SelectValue placeholder="Choose a voice" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-green-500">
                        {voices.map((voice) => (
                          <SelectItem
                            key={voice.voiceURI}
                            value={voice.voiceURI}
                            className="text-green-400 hover:bg-green-500/20"
                          >
                            {voice.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuItem onClick={() => setShowQRCode(true)}>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share via QR Code</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Particle Controls</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <div className="p-2 space-y-4">
                  <div>
                    <label className="text-sm font-medium">Particle Speed</label>
                    <Slider
                      value={[particleSpeed]}
                      onValueChange={handleParticleSpeedChange}
                      min={1}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Particle Color</label>
                    <div className="flex gap-2 mt-2">
                      {['#ffffff', '#00ffff', '#ff00ff', '#ffff00', '#ff0000'].map((color) => (
                        <button
                          key={color}
                          className={`w-6 h-6 rounded-full border-2 ${
                            color === particleColor ? 'border-white' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleParticleColorChange(color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-green-500/20" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share via QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                value={url}
                size={200}
                level="H"
                includeMargin={true}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
