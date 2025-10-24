"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Menu,
  Calendar,
  Users,
  UsersRound,
  BookOpen,
  HelpCircle,
  Info,
  NotepadText,
  Search,
  Settings,
  LogIn,
  LogOut,
  User,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

const navigationItems = [
  { name: "Home", href: "/", icon: null },
  { name: "CCAs", href: "/ccas", icon: Users },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Committees", href: "/committees", icon: UsersRound },
  { name: "Resources", href: "/resources", icon: BookOpen },
  { name: "About", href: "/about", icon: Info },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
  { name: "Search", href: "/search", icon: Search },
  { name: "Contact", href: "/contact", icon: Mail },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <NotepadText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Eventure</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              // Authenticated user dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-blue-600 capitalize">{user.role.replace("_", " ")}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      {user.role === "admin" ? "Admin Panel" : "Manage CCA"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Login button for non-authenticated users
              <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent" asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <span className="text-lg">{item.name}</span>
                    </Link>
                  ))}
                  <div className="pt-4 border-t">
                    {user ? (
                      <div className="space-y-2">
                        <div className="px-2 py-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.role.replace("_", " ")}</p>
                        </div>
                        <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                          <Link href="/admin" onClick={() => setIsOpen(false)}>
                            <Settings className="h-4 w-4 mr-2" />
                            {user.role === "admin" ? "Admin Panel" : "Manage CCA"}
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            handleLogout()
                            setIsOpen(false)
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
