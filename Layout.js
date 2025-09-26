import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, User, BookOpen, Settings, LogOut } from "lucide-react";
import { User as UserEntity } from "@/entities/User";
import { PlatformConfig } from "@/entities/PlatformConfig";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LogoCruz from "./components/LogoCruz";

const navigationItems = [
{
  title: "Cursos",
  url: createPageUrl("Dashboard"),
  icon: Home
},
{
  title: "Perfil",
  url: createPageUrl("Profile"),
  icon: User
}];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [config, setConfig] = React.useState({
    platform_name: "RotaMed",
    platform_tagline: "Sua melhor rota para a medicina!"
  });

  React.useEffect(() => {
    loadUser();
    loadConfig();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await UserEntity.me();
      setUser(userData);
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const loadConfig = async () => {
    try {
      const configs = await PlatformConfig.list();
      if (configs.length > 0) {
        setConfig(configs[0]);
      }
    } catch (error) {
      console.error("Error loading platform config:", error);
    }
  };

  const handleLogout = async () => {
    await UserEntity.logout();
    setUser(null);
  };

  // Add admin navigation item ONLY if user is admin
  const allNavigationItems = React.useMemo(() => [
    ...navigationItems,
    ...(user?.is_admin === true ? [{
      title: "Painel Admin",
      url: createPageUrl("Admin"),
      icon: Settings,
    }] : [])
  ], [user?.is_admin]);

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --background: 8 8 12;
          --foreground: 250 250 250;
          --muted: 23 23 27;
          --muted-foreground: 161 161 170;
          --popover: 8 8 12;
          --popover-foreground: 250 250 250;
          --card: 15 15 19;
          --card-foreground: 250 250 250;
          --border: 39 39 42;
          --input: 39 39 42;
          --primary: 59 130 246;
          --primary-foreground: 250 250 250;
          --secondary: 39 39 42;
          --secondary-foreground: 250 250 250;
          --accent: 39 39 42;
          --accent-foreground: 250 250 250;
          --destructive: 239 68 68;
          --destructive-foreground: 250 250 250;
          --ring: 59 130 246;
          --radius: 0.5rem;
        }
        
        body {
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        
        * {
          border-color: hsl(var(--border));
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-zinc-950">
        <Sidebar className="border-r border-zinc-800 bg-zinc-900">
          <SidebarHeader className="bg-gray-900 p-6 flex flex-col gap-2 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg border border-gray-200">
                <LogoCruz className="w-8 h-8" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-white">{config.platform_name}</h2>
                <p className="text-zinc-400 text-sm">{config.platform_tagline}</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="bg-gray-900 p-4 flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {allNavigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-zinc-800 hover:text-blue-400 transition-all duration-300 rounded-lg mb-2 ${
                          location.pathname === item.url ? 'bg-blue-500/20 text-blue-400 border-l-4 border-blue-500' : 'text-zinc-300'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                          {item.title === "Painel Admin" && (
                            <Badge className="ml-auto bg-red-500 text-white text-xs">Admin</Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="bg-gray-900 p-4 flex flex-col gap-2 border-t border-zinc-800">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.full_name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">
                      {user.full_name || "Usuário"}
                      {user.is_admin && <Badge className="ml-2 bg-red-500 text-white text-xs">Admin</Badge>}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-zinc-300 hover:text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => UserEntity.login()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Entrar
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col bg-zinc-950">
          <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-zinc-800 p-2 rounded-lg transition-colors text-white" />
              <h1 className="text-xl font-bold text-white">{config.platform_name}</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}