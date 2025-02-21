import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, Layout, FolderKanban } from "lucide-react";
import { ContextualIcon } from "@/components/ui/ContextualIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const projects = [
  { id: "pda", name: "Pro Driver Academy", path: "/projects/pro-driver-academy" },
  { id: "nay", name: "Needle & Yarn", path: "/projects/needle-and-yarn" },
];

export function Navbar() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Logged out successfully",
        description: "Redirecting to RWD dashboard...",
      });
      // Force reload to clear any cached state
      window.location.href = 'https://replit.com/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Even on error, try to return to dashboard
      window.location.href = 'https://replit.com/';
    }
  };

  const handleReturnToRWD = () => {
    // Clear session data
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
    // Force return to RWD dashboard
    window.location.href = 'https://replit.com/';
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 max-w-7xl mx-auto">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleReturnToRWD}
              variant="ghost" 
              size="sm"
              className="font-bold text-xl text-primary"
            >
              Return to RWD Dashboard
            </Button>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-foreground transition-all duration-300"
                  >
                    <ContextualIcon icon={FolderKanban} className="h-4 w-4 mr-2" />
                    Projects
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {projects.map(project => (
                    <DropdownMenuItem key={project.id} asChild>
                      <Link href={project.path}>{project.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white flex items-center gap-2 transition-all"
              onClick={handleReturnToRWD}
            >
              Return to RWD Dashboard
            </Button>
            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-foreground transition-all duration-300"
                  >
                    <ContextualIcon icon={Layout} className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-gradient-to-r from-red-500/10 to-rose-500/10 hover:from-red-500/20 hover:to-rose-500/20 text-foreground transition-all duration-300"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <ContextualIcon icon={LogOut} className="h-4 w-4 mr-2" />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                >
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}