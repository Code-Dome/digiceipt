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
import { Shield, User, Building2 } from "lucide-react";

interface Profile {
  id: string;
  username: string | null;
  is_admin: boolean;
  organization_id: string | null;
  organizations: {
    name: string;
  } | null;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const { toast } = useToast();

  const loadUsers = async () => {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select(`
        id, 
        username, 
        is_admin,
        organization_id,
        organizations:organizations (
          name
        )
      `);

    if (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
      return;
    }

    console.log("Loaded users:", profiles);
    setUsers(profiles || []);
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
    <Card className="p-4 sm:p-6 bg-background border border-border">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-primary" />
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          User Management
        </h2>
      </div>

      <div className="overflow-auto">
        <div className="min-w-[320px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px] sm:w-[200px]">Username</TableHead>
                <TableHead className="hidden sm:table-cell w-[200px]">
                  Organization
                </TableHead>
                <TableHead className="w-[100px] sm:w-[150px]">Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="truncate max-w-[120px] sm:max-w-[200px]">
                      {user.username || "No username"}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">
                        {user.organizations?.name || "No organization"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.is_admin}
                        onCheckedChange={() =>
                          toggleAdminStatus(user.id, user.is_admin)
                        }
                      />
                      {user.is_admin && (
                        <Shield className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};