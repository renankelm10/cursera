
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button"; // Not used in the final version, but kept as per original file
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label"; // New import
import { Users, Crown, Mail } from "lucide-react";

export default function UserManager({ onStatsUpdate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await User.list("-created_date");
    setUsers(data);
    setLoading(false);
  };

  // Refactored function to toggle any boolean user property
  const toggleUserProperty = async (userId, property, currentValue) => {
    await User.update(userId, { [property]: !currentValue });
    loadUsers();
    onStatsUpdate?.();
  };

  if (loading) {
    return <div className="text-center py-8 text-zinc-400">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciar Usuários</h2>
        <div className="text-sm text-zinc-400">
          Total: {users.length} usuários
        </div>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold">
                      {user.full_name?.charAt(0) || "U"}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">
                        {user.full_name || "Usuário"}
                      </h3>
                      {user.is_admin && (
                        <Badge className="bg-red-500 text-white">
                          <Crown className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      {user.has_paid_access && (
                        <Badge className="bg-green-500 text-white">
                          Acesso Pago
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                    
                    {user.bio && (
                      <p className="text-sm text-zinc-500 mt-1">{user.bio}</p>
                    )}
                    
                    <div className="text-xs text-zinc-500 mt-1">
                      Registrado em: {new Date(user.created_date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`paid-${user.id}`} className="text-sm text-zinc-400">Acesso Pago:</Label>
                    <Switch
                      id={`paid-${user.id}`}
                      checked={user.has_paid_access || false}
                      onCheckedChange={() => toggleUserProperty(user.id, 'has_paid_access', user.has_paid_access)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`admin-${user.id}`} className="text-sm text-zinc-400">Admin:</Label>
                    <Switch
                      id={`admin-${user.id}`}
                      checked={user.is_admin || false}
                      onCheckedChange={() => toggleUserProperty(user.id, 'is_admin', user.is_admin)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400">Nenhum usuário encontrado</p>
        </div>
      )}
    </div>
  );
}
