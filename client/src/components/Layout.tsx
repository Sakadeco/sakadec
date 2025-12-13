import Navigation from "./Navigation";
import Logo from "./Logo";
import { Facebook, Instagram, MessageSquare } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            <div>
                        <div className="mb-4">
            <Logo width={120} height={80} className="filter brightness-0 invert" />
          </div>
              <p className="text-gray-300 mb-4">L'élégance au service de vos moments et de vos espaces</p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/sakadeco_events/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gold transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/SakadecoEvents/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gold transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://wa.me/33688003928" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gold transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Nos Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/shop" className="hover:text-gold transition-colors">SKD Shop</a></li>
                <li><a href="/crea" className="hover:text-gold transition-colors">SKD Créa</a></li>
                <li><a href="/rent" className="hover:text-gold transition-colors">SKD Rent</a></li>
                <li><a href="/events" className="hover:text-gold transition-colors">SKD Events</a></li>
                <li><a href="/home" className="hover:text-gold transition-colors">SKD Home</a></li>
                <li><a href="/co" className="hover:text-gold transition-colors">SKD & Co</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>06 88 00 39 28</li>
                <li>Île-de-France & Bordeaux Métropole</li>
                <li>Sur rendez-vous</li>
                <li><a href="/orders" className="hover:text-gold transition-colors">Mes commandes</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-300 mb-4">Restez informés de nos dernières créations</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  className="flex-1 p-2 rounded-l-lg text-gray-800"
                />
                <button className="bg-gold px-4 py-2 rounded-r-lg hover:bg-gold/90 transition-colors">
                  Envoyer
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">&copy; 2024 SakaDeco Group. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
