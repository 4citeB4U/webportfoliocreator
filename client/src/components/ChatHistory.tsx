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
        <ScrollArea className="h-[600px] pr-4"> {/* Increased height for more content */}
          {chats?.map((chat) => (
            <div
              key={chat.id}
              className="mb-6 p-4 rounded-lg border border-cyan-500/20 hover:border-cyan-500/50 transition-colors"
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
                    onClick={() => onSelectChat(chat)}
                    className="h-8 w-8 text-cyan-400 hover:text-cyan-300"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Show all messages in the conversation */}
              <div className="space-y-3">
                {chat.messages.map((msg, i) => (
                  <div 
                    key={i}
                    className={`p-3 rounded ${
                      msg.role === 'user' 
                        ? 'bg-cyan-500/10 border-l-2 border-cyan-500'
                        : 'bg-green-500/10 border-l-2 border-green-500'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-400">
                        {msg.role === 'user' ? 'You' : 'Agent Lee'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300 whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center text-xs text-gray-400 mt-3 pt-2 border-t border-gray-800">
                <Clock className="h-3 w-3 mr-1" />
                Started {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
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