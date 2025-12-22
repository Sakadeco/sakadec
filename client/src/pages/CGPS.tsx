import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CGPS() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-8">
          Conditions Générales de Prestations de Services
        </h1>
        <p className="text-gray-600 mb-8">
          SKD GROUP – SKD Events/ SKD home/ SKD & Co
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Préambule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Les présentes Conditions Générales de Prestations de Services (ci-après « CGPS ») régissent l'ensemble des prestations proposées par SKD GROUP, exploité sous le statut d'Entreprise Individuelle (EI) par Youlou Pajusly, dans le domaine de la décoration, de l'organisation et de la coordination événementielle.
            </p>
            <p className="text-gray-700">
              Toute commande de prestation implique l'acceptation sans réserve des présentes CGPS par le client.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 1 – Identité du prestataire</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              <strong>Prestataire :</strong> Youlou Pajusly
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Statut :</strong> Entreprise Individuelle (EI)
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Nom commercial :</strong> SKD GROUP / SKD Events/ SKD home/ SKD & Co
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Email :</strong> sakadeco.contact@gmail.com
            </p>
            <p className="text-gray-700 mb-2">
              <strong>SIRET :</strong> 829 611 888 00035
            </p>
            <p className="text-gray-700">
              <strong>TVA intracommunautaire :</strong> FR73 829611888
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 2 – Objet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Les présentes CGPS ont pour objet de définir les conditions dans lesquelles SKD GROUP fournit des prestations de services, notamment :
            </p>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Décoration événementielle,</li>
              <li>Scénographie,</li>
              <li>Organisation complète ou partielle d'événements,</li>
              <li>Coordination jour J,</li>
              <li>Accompagnement, coaching et conseils.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 3 – Champ d'application</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Les CGPS s'appliquent à toute prestation réalisée pour des clients particuliers ou professionnels, en France ou à l'étranger, sauf conditions particulières écrites et acceptées par les deux parties.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 4 – Devis et commande</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Toute prestation fait l'objet d'un devis personnalisé, gratuit et sans engagement.
            </p>
            <p className="text-gray-700 mb-2">La commande est considérée comme ferme et définitive uniquement après :</p>
            <ul className="list-disc list-inside text-gray-700 ml-4 mb-2">
              <li>Acceptation écrite du devis (signature ou validation par email),</li>
              <li>Versement de l'acompte indiqué sur le devis.</li>
            </ul>
            <p className="text-gray-700">
              SKD GROUP se réserve le droit de refuser toute demande non conforme à ses valeurs, contraintes techniques ou disponibilités.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 5 – Tarifs et paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Les prix sont exprimés en euros, hors taxes (HT).
            </p>
            <p className="text-gray-700 mb-2">
              Les modalités de paiement (acompte, solde, échéancier) sont précisées sur le devis.
            </p>
            <p className="text-gray-700 mb-2">Sauf mention contraire :</p>
            <ul className="list-disc list-inside text-gray-700 ml-4 mb-2">
              <li>Un acompte est exigé à la commande,</li>
              <li>Le solde est dû avant la date de l'événement.</li>
            </ul>
            <p className="text-gray-700">
              Tout retard de paiement pourra entraîner la suspension de la prestation.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 6 – Délais et obligations du client</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">Le client s'engage à :</p>
            <ul className="list-disc list-inside text-gray-700 ml-4 mb-2">
              <li>Fournir des informations exactes et complètes,</li>
              <li>Respecter les délais de validation,</li>
              <li>Garantir l'accès aux lieux le jour de la prestation,</li>
              <li>Obtenir les autorisations nécessaires (lieu, mairie, prestataires tiers).</li>
            </ul>
            <p className="text-gray-700">
              Tout retard ou manquement du client pouvant impacter la prestation ne saurait engager la responsabilité de SKD GROUP exploité sous le statut d'Entreprise Individuelle (EI) par Youlou Pajusly.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 7 – Modification de la prestation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Toute modification demandée après validation du devis pourra entraîner :
            </p>
            <ul className="list-disc list-inside text-gray-700 ml-4 mb-2">
              <li>Un ajustement tarifaire,</li>
              <li>Une modification des délais,</li>
              <li>Ou un refus si la demande est incompatible avec l'organisation prévue.</li>
            </ul>
            <p className="text-gray-700">
              Aucune modification n'est garantie à moins de 30 jours de l'événement, sauf accord écrit.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 8 – Annulation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">En cas d'annulation par le client :</p>
            <ul className="list-none text-gray-700 space-y-2">
              <li>
                <strong>Plus de 60 jours avant l'événement :</strong> l'acompte reste acquis,
              </li>
              <li>
                <strong>Entre 30 et 60 jours :</strong> 50 % du montant total est dû,
              </li>
              <li>
                <strong>Moins de 30 jours :</strong> la totalité de la prestation reste due.
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              Ces conditions couvrent le temps de travail engagé, la réservation des dates et les frais engagés.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 9 – Responsabilité</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              SKD GROUP est tenue à une obligation de moyens, et non de résultat.
            </p>
            <p className="text-gray-700 mb-2">Sa responsabilité ne pourra être engagée en cas de :</p>
            <ul className="list-disc list-inside text-gray-700 ml-4 mb-2">
              <li>Force majeure,</li>
              <li>Conditions météorologiques,</li>
              <li>Défaillance d'un prestataire tiers,</li>
              <li>Décision du client ou du lieu de réception.</li>
            </ul>
            <p className="text-gray-700">
              En tout état de cause, la responsabilité de SKD GROUP exploité sous le statut d'Entreprise Individuelle (EI) par Youlou Pajusly est limitée au montant de la prestation facturée.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 10 – Propriété intellectuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Les concepts, visuels, monoboards, plans, scénographies et documents fournis restent la propriété intellectuelle exclusive de SKD GROUP exploité sous le statut d'Entreprise Individuelle (EI) par Youlou Pajusly.
            </p>
            <p className="text-gray-700">
              Toute reproduction ou utilisation sans autorisation écrite est interdite.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 11 – Communication et droit à l'image</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Sauf refus écrit du client, SKD GROUP exploité sous le statut d'Entreprise Individuelle (EI) par Youlou Pajusly se réserve le droit d'utiliser des photos anonymisées de la prestation à des fins de communication (site internet, réseaux sociaux, portfolio).
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 12 – Données personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Les données collectées sont utilisées uniquement dans le cadre de la relation commerciale et sont traitées conformément à la réglementation en vigueur (RGPD).
            </p>
            <p className="text-gray-700">
              Le client dispose d'un droit d'accès, de rectification et de suppression.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Article 13 – Droit applicable et litiges</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Les présentes CGPS sont soumises au droit français.
            </p>
            <p className="text-gray-700 mb-2">
              En cas de litige, une solution amiable sera recherchée en priorité.
            </p>
            <p className="text-gray-700">
              À défaut, les tribunaux compétents seront ceux du ressort du siège social de SKD GROUP exploité sous le statut d'Entreprise Individuelle (EI) par Youlou Pajusly.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

