import React, { useState, useEffect } from 'react';
import { Headphones, BookOpen, LogOut } from 'lucide-react';
import { useLocation } from 'wouter';
import { FloatingEmojis } from '@/components/FloatingEmojis';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface Book {
  id: number;
  title: string;
  author: string;
  color: string;
  hasAudio: boolean;
  type: 'story' | 'instruction';
  route: string;
}

const books: Book[] = [
  {
    id: 1,
    title: 'Needle & Yarn:\nA Love Stitched\nin Time',
    author: 'Leola "Sista" Lee',
    color: 'bg-emerald-800',
    hasAudio: true,
    type: 'story',
    route: '/book/needle-and-yarn'
  },
  {
    id: 2,
    title: 'Crochet Mastery:\nA Complete\nGuide',
    author: 'Leola "Sista" Lee',
    color: 'bg-rose-800',
    hasAudio: true,
    type: 'instruction',
    route: '/book/crochet-guide'
  }
];

const BookSpine: React.FC<{ book: Book; onClick: () => void; isSelected: boolean }> = ({
  book,
  onClick,
  isSelected
}) => (
  <button
    onClick={onClick}
    className={`
      relative h-64 w-28
      ${book.color}
      cursor-pointer
      transform transition-all duration-500 ease-in-out
      hover:translate-x-4 hover:shadow-xl
      focus:outline-none focus:ring-2 focus:ring-white/20
      ${isSelected ? 'translate-x-8 scale-110' : ''}
      rounded-r overflow-hidden
      border-r border-white/10
    `}
    style={{
      transform: `perspective(1000px) rotateY(${isSelected ? '-20deg' : '0deg'})`,
      transformOrigin: 'left center',
      background: `linear-gradient(to right, 
        ${book.color === 'bg-emerald-800' ? '#065f46' : '#991b1b'} 0%, 
        ${book.color === 'bg-emerald-800' ? '#047857' : '#be123c'} 50%, 
        ${book.color === 'bg-emerald-800' ? '#065f46' : '#991b1b'} 100%)`,
      boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.3)'
    }}
  >
    <div className="w-full h-full relative flex flex-col justify-between p-4">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '8px 8px'
        }}
      />

      <div className="flex-1 flex items-center justify-center relative">
        <div
          className="text-white/90 font-serif tracking-wide text-center px-3"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            textShadow: '0 2px 4px rgba(0,0,0,0.4)',
            fontSize: '0.9rem',
            lineHeight: '1.4'
          }}
        >
          {book.title.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < book.title.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {book.hasAudio && (
        <div className="absolute bottom-2 right-2">
          <Headphones className="w-4 h-4 text-white/70" />
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)'
        }}
      />
    </div>
  </button>
);

const Bookshelf: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [, setLocation] = useLocation();
  const { logoutMutation } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    localStorage.removeItem('lastVisitedPage');
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Logged out successfully",
        description: "Redirecting to RWD dashboard...",
      });
      // Force reload the page and clear history
      window.location.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Logout failed",
        description: "Forcing return to RWD dashboard",
        variant: "destructive"
      });
      // Even if logout fails, force return to dashboard
      window.location.replace('/');
    }
  };

  const handleForceReturn = () => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    // Force return to RWD dashboard
    window.location.replace("/");
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setTimeout(() => {
      setLocation(book.route);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <FloatingEmojis />
      <div className="max-w-6xl mx-auto p-12 relative z-10">
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-4xl font-light text-white/90 tracking-wider">
            Leola's Digital Library
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white flex items-center gap-2 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Exit Library
          </button>
          <button
            onClick={handleForceReturn}
            className="ml-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-full text-white flex items-center gap-2 transition-all"
          >
            Return to Main Site
          </button>
        </div>
        <div className="relative">
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <h3 className="text-2xl text-white/80 font-light tracking-wider">Featured Works</h3>
              <div className="ml-4 h-px bg-white/20 flex-grow"></div>
            </div>
            <div className="bg-[#3c2b1a] p-12 flex gap-6 items-end rounded-lg
                          border border-[#5c4a39] shadow-2xl transform-gpu
                          bg-[linear-gradient(45deg,#3c2b1a_25%,#4d3c2b_50%,#3c2b1a_75%)]
                          before:absolute before:inset-0 before:bg-[radial-gradient(#ffffff33_1px,transparent_1px)]
                          before:bg-[length:24px_24px] before:opacity-10 before:pointer-events-none
                          relative">
              <div className="absolute inset-0 rounded-lg opacity-30"
                   style={{
                     backgroundImage: `
                       repeating-linear-gradient(
                         90deg,
                         #000 0px,
                         #000 2px,
                         transparent 2px,
                         transparent 20px
                       )
                     `
                   }}
              />

              <div className="absolute top-0 left-0 right-0 h-4 bg-[#5c4a39] rounded-t-lg
                            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)]"></div>
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#5c4a39] rounded-b-lg
                            shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"></div>
              <div className="absolute top-0 left-0 bottom-0 w-4 bg-[#5c4a39] rounded-l-lg
                            shadow-[inset_-2px_0_4px_rgba(0,0,0,0.3)]"></div>
              <div className="absolute top-0 right-0 bottom-0 w-4 bg-[#5c4a39] rounded-r-lg
                            shadow-[inset_2px_0_4px_rgba(0,0,0,0.3)]"></div>

              {books.map((book) => (
                <BookSpine
                  key={book.id}
                  book={book}
                  onClick={() => handleBookSelect(book)}
                  isSelected={selectedBook?.id === book.id}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-12 left-0 right-0 text-center pointer-events-none">
          <span className="text-4xl font-light text-white/40 tracking-widest">
            Leola Lee
          </span>
        </div>
      </div>
    </div>
  );
};

export default Bookshelf;