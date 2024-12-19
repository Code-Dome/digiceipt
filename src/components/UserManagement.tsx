import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Shield, User } from "lucide-react";

interface Profile {
  id: string;
  username: string | null;
  is_admin: boolean;
  email?: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const { toast } = useToast();

  const loadUsers = async () => {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, username, is_admin");

    if (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
      return;
    }

    // Get emails from auth.users (only available to admin users through RLS)
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    
    const usersWithEmail = profiles.map((profile) => ({
      ...profile,
      email: authUsers?.users.find((u) => u.id === profile.id)?.email || "",
    }));

    setUsers(usersWithEmail);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: !currentStatus })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "User role updated successfully",
    });

    loadUsers();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-violet-600" />
        <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-400">
          User Management
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Admin Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username || "No username"}</TableCell>
              <TableCell>{user.email || "No email"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={user.is_admin}
                    onCheckedChange={() => toggleAdminStatus(user.id, user.is_admin)}
                  />
                  {user.is_admin && (
                    <Shield className="w-4 h-4 text-violet-600" />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};