import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompanyManagement } from "@/hooks/useCompanyManagement";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { X, ArrowLeft } from "lucide-react";

const Admin = () => {
  const [newCompany, setNewCompany] = useState("");
  const [password, setPassword] = useState("");
  const { companies, addCompany, removeCompany } = useCompanyManagement();
  const { isAdmin, login, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setPassword("");
    }
  };

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
              <Button type="submit">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/view")}
            className="bg-white hover:bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-violet-400 dark:border-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to View
          </Button>
          <h1 className="text-3xl font-bold text-violet-700 dark:text-violet-400">
            Company Management
          </h1>
        </div>
        <Button
          variant="outline"
          onClick={logout}
          className="bg-white hover:bg-red-50 text-red-700 border-red-200 dark:bg-gray-800 dark:hover:bg-red-900 dark:text-red-400 dark:border-red-800"
        >
          Logout
        </Button>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-200">Add New Company</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newCompany.trim()) {
                addCompany(newCompany.trim());
                setNewCompany("");
              }
            }}
            className="flex gap-2"
          >
            <Input
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              placeholder="Enter company name"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <Button 
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-700 dark:hover:bg-violet-800"
            >
              Add Company
            </Button>
          </form>

          <div className="mt-6 space-y-2">
            {companies.map((company) => (
              <div
                key={company.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-700"
              >
                <span className="dark:text-gray-200">{company.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCompany(company.id)}
                  className="hover:bg-red-100 dark:hover:bg-red-900"
                >
                  <X className="h-4 w-4 text-red-700 dark:text-red-400" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;