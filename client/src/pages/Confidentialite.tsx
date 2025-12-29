import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Confidentialite() {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-6 sm:mb-8">
          Politique de Confidentialité – RGPD
        </h1>

        <Card className="mb-4 sm:mb-6">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">1. Responsable du traitement</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-gray-700 mb-2">
              Les données personnelles collectées sur le site sont traitées par :
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Youlou Pajusly – Entreprise Individuelle</strong>
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Nom commercial :</strong> SKD GROUP
            </p>
            <p className="text-gray-700 mb-2">
              <strong>SIRET :</strong> 829 611 888 00035
            </p>
            <p className="text-gray-700">
              <strong>Email :</strong> sakadeco.contact@gmail.com
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. Données collectées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Nous collectons uniquement les données nécessaires à nos services, notamment :
            </p>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Nom et prénom</li>
              <li>Adresse e-mail</li>
              <li>Adresse postale</li>
              <li>Numéro de téléphone</li>
              <li>Informations de commande et de personnalisation</li>
              <li>Données de navigation (cookies)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Finalités du traitement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">Les données sont collectées pour :</p>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>La gestion des commandes et locations</li>
              <li>La facturation et le suivi client</li>
              <li>La communication avec le client</li>
              <li>Le respect des obligations légales et comptables</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Durée de conservation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">Les données sont conservées :</p>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Données clients : jusqu'à 5 ans après la dernière commande</li>
              <li>Données de facturation : 10 ans (obligation légale)</li>
              <li>Cookies : 13 mois maximum</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Destinataires des données</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Les données sont exclusivement destinées à SKD GROUP. Elles peuvent être transmises à des prestataires techniques (hébergeur, paiement, transporteurs) uniquement pour l'exécution du service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Droits des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
              <li>Droit d'accès</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit d'opposition</li>
            </ul>
            <p className="text-gray-700">
              Toute demande peut être adressée par email à : sakadeco.contact@gmail.com
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. Sécurité</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Nous mettons en œuvre toutes les mesures techniques et organisationnelles nécessaires pour protéger vos données personnelles.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Le site utilise des cookies nécessaires à son bon fonctionnement et, sous réserve de votre consentement, des cookies de mesure d'audience.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}


