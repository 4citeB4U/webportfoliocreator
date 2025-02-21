import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function AdminPage() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="/auth" />;
  }

  if (user.role !== 'admin') {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-2xl font-bold p-4">Admin Dashboard</h1>
      <div className="p-4">
        <p>Welcome, {user.username}!</p>
        <p>Role: {user.role}</p>
      </div>
    </div>
  );
}