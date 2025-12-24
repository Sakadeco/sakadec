import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";

export default function MentionsLegales() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-8">Mentions Légales</h1>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Éditeur du site</h2>
            <p className="text-gray-700 mb-2">
              <strong>Youlou Pajusly – Entreprise Individuelle</strong>
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Nom commercial :</strong> SAKADECO (SKD GROUP)
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Autres Noms commerciaux :</strong>
            </p>
            <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
              <li>SKD Shop</li>
              <li>SKD Events</li>
              <li>SKD Rent</li>
              <li>SKD Créa</li>
              <li>SKD Home</li>
              <li>SKD & Co</li>
            </ul>
            <p className="text-gray-700 mb-2">
              <strong>SIRET :</strong> 829 611 888 00035
            </p>
            <p className="text-gray-700 mb-2">
              <strong>TVA intracommunautaire :</strong> FR73 829611888
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Siège social</h2>
            <p className="text-gray-700">
              Rue pasteur 33200 Bordeaux
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact</h2>
            <p className="text-gray-700 mb-2">
              <strong>Email :</strong> sakadeco.contact@gmail.com
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hébergement</h2>
            <p className="text-gray-700">
              <strong>Nom de l'hébergeur :</strong> Render
            </p>
            <p className="text-gray-700">
              <strong>Adresse de l'hébergeur :</strong> render.com
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Conditions générales</h2>
            <p className="text-gray-700 mb-4">
              Toute location, prestation de service, vaut acceptation des conditions générales ci-dessus.
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Consultez les conditions générales correspondant à votre service :</strong>
            </p>
            <ul className="list-disc list-inside text-gray-700 ml-4 space-y-2">
              <li>
                <a href="/legal/cgv" className="text-blue-600 hover:text-blue-800 underline">
                  Vente
                </a>
                {' - '}
                <a href="/legal/cgv" className="text-blue-600 hover:text-blue-800">
                  Conditions Générales de Vente
                </a>
              </li>
              <li>
                <a href="/legal/cgl" className="text-blue-600 hover:text-blue-800 underline">
                  Location
                </a>
                {' - '}
                <a href="/legal/cgl" className="text-blue-600 hover:text-blue-800">
                  Conditions Générales de Location
                </a>
              </li>
              <li>
                <a href="/legal/cgps" className="text-blue-600 hover:text-blue-800 underline">
                  Prestation de service
                </a>
                {' - '}
                <a href="/legal/cgps" className="text-blue-600 hover:text-blue-800">
                  Conditions Générales de Prestations de Service
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

