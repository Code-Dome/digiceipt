import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, UserPlus, UserMinus, Edit, Save, X } from "lucide-react";

interface Organization {
  id: string;
  name: string;
}

interface Profile {
  id: string;
  username: string | null;
  organization_id: string | null;
}

export const OrganizationList = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [newOrgName, setNewOrgName] = useState("");
  const [editingOrg, setEditingOrg] = useState<{ id: string; name: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrganizations();
    fetchUsers();
  }, []);

  const fetchOrganizations = async () => {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching organizations:', error);
      toast({
        title: "Error",
        description: "Failed to load organizations",
        variant: "destructive"
      });
      return;
    }

    setOrganizations(data || []);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, organization_id');

    if (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
      return;
    }

    setUsers(data || []);
  };

  const addOrganization = async () => {
    if (!newOrgName.trim()) return;

    const { error } = await supabase
      .from('organizations')
      .insert([{ name: newOrgName.trim() }]);

    if (error) {
      console.error('Error adding organization:', error);
      toast({
        title: "Error",
        description: "Failed to add organization",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Organization added successfully"
    });

    setNewOrgName("");
    fetchOrganizations();
  };

  const updateOrganization = async () => {
    if (!editingOrg) return;

    const { error } = await supabase
      .from('organizations')
      .update({ name: editingOrg.name })
      .eq('id', editingOrg.id);

    if (error) {
      console.error('Error updating organization:', error);
      toast({
        title: "Error",
        description: "Failed to update organization",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Organization updated successfully"
    });

    setEditingOrg(null);
    fetchOrganizations();
  };

  const assignUserToOrg = async (userId: string, organizationId: string | null) => {
    const { error } = await supabase
      .from('profiles')
      .update({ organization_id: organizationId })
      .eq('id', userId);

    if (error) {
      console.error('Error assigning user:', error);
      toast({
        title: "Error",
        description: "Failed to assign user",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "User assignment updated successfully"
    });

    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="New organization name"
          value={newOrgName}
          onChange={(e) => setNewOrgName(e.target.value)}
        />
        <Button onClick={addOrganization}>
          <Building2 className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>

      <div className="space-y-4">
        {organizations.map((org) => (
          <div key={org.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              {editingOrg?.id === org.id ? (
                <div className="flex gap-2 flex-1">
                  <Input
                    value={editingOrg.name}
                    onChange={(e) => setEditingOrg({ ...editingOrg, name: e.target.value })}
                  />
                  <Button onClick={updateOrganization}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="ghost" onClick={() => setEditingOrg(null)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-lg font-semibold">{org.name}</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setEditingOrg({ id: org.id, name: org.name })}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Users</h4>
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <span>{user.username || 'Unnamed User'}</span>
                  <Button
                    variant="ghost"
                    onClick={() => assignUserToOrg(
                      user.id,
                      user.organization_id === org.id ? null : org.id
                    )}
                  >
                    {user.organization_id === org.id ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Remove
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Assign
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};