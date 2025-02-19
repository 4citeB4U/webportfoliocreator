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
import { MessageSquare, Clock, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Chat } from "@shared/schema";

export function ChatHistory({ onSelectChat }: { onSelectChat: (chat: Chat) => void }) {
  const { data: chats, isLoading } = useQuery<Chat[]>({
    queryKey: ["/api/chats"],
  });

  const downloadChat = async (chat: Chat) => {
    // Format the chat content with clear separation between messages
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
    <Card className="w-full max-w-md bg-black/70 border border-cyan-500/50">
      <CardHeader>
        <CardTitle className="text-xl text-cyan-400">Chat History</CardTitle>
        <CardDescription className="text-gray-400">
          View and manage your past conversations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {chats?.map((chat) => (
            <div
              key={chat.id}
              className="mb-4 p-4 rounded-lg border border-cyan-500/20 hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-cyan-400">
                  {chat.title || `Chat ${chat.id}`}
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
                    onClick={() => onSelectChat(chat)}
                    className="h-8 w-8 text-cyan-400 hover:text-cyan-300"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Preview last few messages */}
              <div className="mt-2 space-y-2">
                {chat.messages.slice(-2).map((msg, i) => (
                  <div 
                    key={i}
                    className={`p-2 rounded ${
                      msg.role === 'user' 
                        ? 'bg-cyan-500/10 border-l-2 border-cyan-500'
                        : 'bg-green-500/10 border-l-2 border-green-500'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1 text-gray-400">
                      {msg.role === 'user' ? 'You' : 'Agent Lee'}
                    </div>
                    <div className="text-sm text-gray-300">
                      {msg.content.length > 100
                        ? `${msg.content.substring(0, 100)}...`
                        : msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center text-sm text-gray-400 mt-2">
                <Clock className="h-4 w-4 mr-1" />
                {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                <span className="mx-2">•</span>
                {chat.messages.length} messages
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}