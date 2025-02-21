import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, Download, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Chat } from "@shared/schema";

interface ChatHistoryProps {
  onSelectChat: (chat: Chat) => void;
  onClose: () => void;
}

export function ChatHistory({ onSelectChat, onClose }: ChatHistoryProps) {
  const { data: chats, isLoading } = useQuery<Chat[]>({
    queryKey: ["/api/chats"],
  });

  const downloadChat = async (chat: Chat) => {
    const content = chat.messages.map(msg => 
      `${msg.role.toUpperCase()}: ${msg.content}\n[${new Date(msg.timestamp).toLocaleString()}]\n`
    ).join('\n---\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${chat.id}-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (isLoading) {
    return <div className="text-center p-4 text-gray-400">Loading chat history...</div>;
  }

  return (
    <Card className="w-full max-w-4xl bg-black/90 border border-cyan-500/50">
      <CardHeader className="relative">
        <CardTitle className="text-xl text-cyan-400">Chat History</CardTitle>
        <CardDescription className="text-gray-400">
          View and manage your past conversations
        </CardDescription>
        <Button 
          className="absolute top-2 right-2" 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
        >
          <X className="h-4 w-4"/>
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {chats?.map((chat) => (
              <div
                key={chat.id}
                className="p-6 rounded-lg border border-cyan-500/20 hover:border-cyan-500/50 transition-colors bg-black/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-cyan-400">
                    Conversation {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadChat(chat)}
                      className="h-8 w-8 text-cyan-400 hover:text-cyan-300"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        onSelectChat(chat);
                        onClose();
                      }}
                      className="h-8 w-8 text-cyan-400 hover:text-cyan-300"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {chat.messages.map((msg, i) => (
                    <div 
                      key={i}
                      className={`p-4 rounded ${
                        msg.role === 'user' 
                          ? 'bg-cyan-500/10 border-l-2 border-cyan-500'
                          : 'bg-green-500/10 border-l-2 border-green-500'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-300">
                          {msg.role === 'user' ? 'You' : 'Agent Lee'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center text-xs text-gray-400 mt-4 pt-3 border-t border-gray-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Started {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                  <span className="mx-2">•</span>
                  {chat.messages.length} messages
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}