import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, User, LogOut, Phone, Mail, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useState } from "react";
import CartIcon from "./CartIcon";
import Logo from "./Logo";

export default function Navigation() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const skdGroupServices = [
    { name: "SKD Créa", path: "/crea", color: "skd-crea", icon: "🎨", description: "Personnalisation & papeterie" },
    { name: "SKD Rent", path: "/rent", color: "skd-rent", icon: "📦", description: "Location de matériel festif" },
    { name: "SKD Events", path: "/events", color: "skd-events", icon: "🎉", description: "Décoration d'événements" },
    { name: "SKD Home", path: "/home", color: "skd-home", icon: "🏠", description: "Décoration intérieure" },
    { name: "SKD & Co", path: "/co", color: "skd-co", icon: "🤝", description: "Organisation d'événements" },
  ];

  if (isLoading) {
    return (
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gold/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Top Bar with Contact Info */}
      <div className="fixed top-0 w-full bg-gradient-to-r from-gold to-yellow-500 text-white text-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-8">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3" />
                <span className="hidden sm:inline">06 88 00 39 28</span>
                <span className="sm:hidden">06 88 00 39 28</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <Mail className="h-3 w-3" />
                <span>sakadeco.contact@gmail.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium hidden sm:inline">Île-de-France & Bordeaux Métropole</span>
              <span className="font-medium sm:hidden">Île-de-France & Bordeaux</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="fixed top-8 w-full bg-white/95 backdrop-blur-md z-40 border-b border-gold/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/">
                <div className="flex items-center space-x-2 lg:space-x-3 cursor-pointer group">
                  <Logo 
                    width={80} 
                    height={53} 
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-8">
              {/* Accueil */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link href="/" className={`relative text-gray-700 hover:text-gold transition-colors duration-300 font-medium ${location === "/" ? "text-gold" : ""}`}>
                  Accueil
                  {location === "/" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-yellow-500"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>

              {/* Boutique */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <Link href="/shop" className={`relative text-gray-700 hover:text-gold transition-colors duration-300 font-medium ${location === "/shop" ? "text-gold" : ""}`}>
                  Boutique
                  {location === "/shop" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-yellow-500"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>

              {/* SKD Group Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`relative text-gray-700 hover:text-gold transition-colors duration-300 font-medium flex items-center space-x-1 ${location.startsWith('/crea') || location.startsWith('/rent') || location.startsWith('/events') || location.startsWith('/home') || location.startsWith('/co') ? "text-gold" : ""}`}
                    >
                      <span>SKD Group</span>
                      <ChevronDown className="h-4 w-4" />
                      {(location.startsWith('/crea') || location.startsWith('/rent') || location.startsWith('/events') || location.startsWith('/home') || location.startsWith('/co')) && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-yellow-500"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2" align="start">
                    {skdGroupServices.map((service) => (
                      <DropdownMenuItem key={service.path} asChild>
                        <Link 
                          href={service.path}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <span className="text-2xl">{service.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-500">{service.description}</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>

              {/* Nos Thèmes */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <Link href="/themes" className={`relative text-gray-700 hover:text-gold transition-colors duration-300 font-medium ${location === "/themes" ? "text-gold" : ""}`}>
                  Nos Thèmes
                  {location === "/themes" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-yellow-500"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>

              {/* Nos Réalisations */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link href="/realisations" className={`relative text-gray-700 hover:text-gold transition-colors duration-300 font-medium ${location === "/realisations" ? "text-gold" : ""}`}>
                  Nos Réalisations
                  {location === "/realisations" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-yellow-500"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>

              {/* À propos */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <Link href="/about" className={`relative text-gray-700 hover:text-gold transition-colors duration-300 font-medium ${location === "/about" ? "text-gold" : ""}`}>
                  À propos
                  {location === "/about" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-yellow-500"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>

              {/* Contact */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link href="/contact" className={`relative text-gray-700 hover:text-gold transition-colors duration-300 font-medium ${location === "/contact" ? "text-gold" : ""}`}>
                  Contact
                  {location === "/contact" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-yellow-500"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>

              {/* Cart Icons */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex items-center gap-2"
              >
                <CartIcon />
              </motion.div>

              {/* User Menu */}
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 lg:h-10 lg:w-10 rounded-full hover:bg-gold/10 transition-all duration-300">
                        <Avatar className="h-8 w-8 lg:h-10 lg:w-10 ring-2 ring-gold/20 hover:ring-gold/40 transition-all duration-300">
                          <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-gold to-yellow-500 text-white font-bold">
                            {user?.firstName?.[0] || user?.email?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Profil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center space-x-2 text-red-600">
                        <LogOut className="h-4 w-4" />
                        <a href="/api/logout" className="flex items-center w-full">
                          Se déconnecter
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <a href="/api/login" className="flex items-center space-x-1 lg:space-x-2 bg-gradient-to-r from-gold to-yellow-500 text-white px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-gold transition-all duration-300 font-medium">
                    <User className="h-4 w-4" />
                    <span>Se connecter</span>
                  </a>
                </motion.div>
              )}
            </div>

            {/* Mobile Cart Icons - Always Visible */}
            <div className="xl:hidden flex items-center gap-2 mr-2">
              <CartIcon />
            </div>

            {/* Mobile Menu Button */}
            <div className="xl:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="text-left">Menu</SheetTitle>
                    <SheetDescription className="text-left">
                      Navigation principale
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-8 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Mobile Navigation Items */}
                    <Link 
                      href="/" 
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">Accueil</div>
                    </Link>

                    <Link 
                      href="/shop" 
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">Boutique</div>
                    </Link>

                    {/* SKD Group Mobile */}
                    <div className="space-y-2">
                      <div className="font-medium text-gray-900 p-3">SKD Group</div>
                      {skdGroupServices.map((service) => (
                        <Link 
                          key={service.path}
                          href={service.path} 
                          className="block p-3 pl-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{service.icon}</span>
                            <div>
                              <div className="font-medium text-gray-900">{service.name}</div>
                              <div className="text-sm text-gray-500">{service.description}</div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <Link 
                      href="/themes" 
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">Nos Thèmes</div>
                    </Link>

                    <Link 
                      href="/realisations" 
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">Nos Réalisations</div>
                    </Link>

                    <Link 
                      href="/about" 
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">À propos</div>
                    </Link>

                    <Link 
                      href="/contact" 
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">Contact</div>
                    </Link>

                    {/* Mobile Cart Links */}
                    <Link 
                      href="/cart" 
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">Mon Panier</div>
                        <div className="text-sm text-gray-500">Voir mes achats</div>
                      </div>
                    </Link>

                    <Link 
                      href="/rental-cart" 
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">Mes Locations</div>
                        <div className="text-sm text-gray-500">Voir mes locations</div>
                      </div>
                    </Link>

                    {/* Mobile Auth */}
                    {isAuthenticated ? (
                      <div className="pt-4 border-t">
                        <div className="flex items-center space-x-3 p-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || ""} />
                            <AvatarFallback className="bg-gradient-to-br from-gold to-yellow-500 text-white font-bold">
                              {user?.firstName?.[0] || user?.email?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user?.firstName} {user?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user?.email}</div>
                          </div>
                        </div>
                        <a href="/api/logout" className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                          <LogOut className="h-4 w-4 mr-3" />
                          Se déconnecter
                        </a>
                      </div>
                    ) : (
                      <div className="pt-4 border-t">
                        <a href="/api/login" className="flex items-center w-full p-3 bg-gradient-to-r from-gold to-yellow-500 text-white rounded-lg hover:from-yellow-500 hover:to-gold transition-all duration-300">
                          <User className="h-4 w-4 mr-3" />
                          Se connecter
                        </a>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
