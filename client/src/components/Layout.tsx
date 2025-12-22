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
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold mb-2">Informations légales</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li><a href="/legal/mentions" className="hover:text-gold transition-colors">Mentions légales</a></li>
                  <li><a href="/legal/cgv" className="hover:text-gold transition-colors">Conditions Générales de Vente</a></li>
                  <li><a href="/legal/cgl" className="hover:text-gold transition-colors">Conditions Générales de Location</a></li>
                  <li><a href="/legal/cgps" className="hover:text-gold transition-colors">Conditions Générales de Prestations</a></li>
                  <li><a href="/legal/confidentialite" className="hover:text-gold transition-colors">Politique de confidentialité</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Ressources</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>
                    <a 
                      href="https://www.canva.com/design/DAG73Mhxi4A/OOhLKfNuA-r9WHHT6a50EQ/view?utm_content=DAG73Mhxi4A&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hdf441ab7c0" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-gold transition-colors"
                    >
                      Catalogue_SKD_Group
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-300">&copy; 2024 SakaDeco Group. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
