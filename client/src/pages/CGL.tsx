import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CGL() {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-6 sm:mb-8">
          Conditions Générales de Location
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          SKD GROUP_ SKD Rent
        </p>

        <Card className="mb-4 sm:mb-6">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">1. GÉNÉRALITÉS</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-gray-700 mb-2">
              Les présentes Conditions Générales de Location (ci-après « CGL ») régissent la location de matériels proposés par « SKD Rent » exploité sous le statut d'Entreprise Individuelle (EI) par Youlou Pajusly.
            </p>
            <p className="text-gray-700 mb-2">
              Toute réservation implique l'acceptation pleine et entière de ces conditions par le client.
            </p>
            <p className="text-gray-700 mb-2">
              Les prix indiqués s'entendent pour une location d'un week-end complet, du vendredi (retrait) au lundi (retour), sauf mention contraire.
            </p>
            <p className="text-gray-700">
              Le terme "matériel" désigne l'ensemble des articles, accessoires et équipements loués.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. COMMANDE & PAIEMENT</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              La réservation est considérée comme définitive uniquement après paiement complet sur notre site.
            </p>
            <p className="text-gray-700 mb-2">
              Le retrait du matériel se fait uniquement à notre entrepôt.
            </p>
            <p className="text-gray-700 mb-2">
              Aucune livraison n'est proposée.
            </p>
            <p className="text-gray-700 mb-2">
              Une confirmation de commande est envoyée par e-mail une fois le paiement validé.
            </p>
            <p className="text-gray-700">
              Nos CGL prévalent sur toutes clauses contraires, notamment celles pouvant figurer dans les documents du client.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. CAUTION</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Une caution est exigée pour chaque location :
            </p>
            <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
              <li>Montant variable selon la valeur du matériel.</li>
              <li>Versée par chèque lors du retrait.</li>
              <li>Une pièce d'identité peut être demandée.</li>
            </ul>
            <p className="text-gray-700 mb-2">
              Le chèque de caution n'est pas encaissé, sauf si :
            </p>
            <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
              <li>Le matériel est perdu, volé ou non restitué.</li>
              <li>Le matériel est rendu cassé, détérioré ou inutilisable.</li>
              <li>Le matériel est rendu au-delà du délai prévu et sans accord préalable.</li>
            </ul>
            <p className="text-gray-700">
              La caution est restituée après contrôle complet du matériel, soit immédiatement lors du retour si tout est conforme, ou ultérieurement (déchirée ou remise en main propre) si une vérification approfondie est nécessaire.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. DURÉE DE LOCATION</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              La location commence dès la remise du matériel au client et se termine lorsque celui-ci est déposé de nouveau dans nos locaux.
            </p>
            <p className="text-gray-700">
              Tout retard de restitution pourra entraîner une facturation supplémentaire et/ou l'encaissement de la caution.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. RETRAIT & RETOUR DU MATÉRIEL</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Le retrait et le retour s'effectuent à l'entrepôt SKD Rent, aux horaires communiqués lors de la réservation.
            </p>
            <p className="text-gray-700 mb-2">
              Le client doit vérifier le matériel lors du retrait : un état des lieux peut être établi.
            </p>
            <p className="text-gray-700 mb-2">Le matériel doit être :</p>
            <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
              <li>Rendu complet,</li>
              <li>Propre,</li>
              <li>Dans le même état qu'au retrait.</li>
            </ul>
            <p className="text-gray-700">
              Tout article manquant ou dégradé sera facturé au prix unitaire de remplacement.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. RESPONSABILITÉ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Pendant toute la durée de la location, le client est entièrement responsable du matériel dont il a la garde (article 1384 du Code civil).
            </p>
            <p className="text-gray-700">
              SKD Rent ne peut être tenue responsable des retards, impossibilités de retrait ou autres cas liés à une force majeure (intempéries, panne, accident, etc.).
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. ÉTAT DU MATÉRIEL & UTILISATION</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Le matériel loué est fourni en bon état d'utilisation.
            </p>
            <p className="text-gray-700 mb-2">Le client s'engage à :</p>
            <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
              <li>Utiliser le matériel conformément à sa destination,</li>
              <li>Ne pas l'exposer à une mauvaise utilisation,</li>
              <li>Le protéger contre l'humidité, la casse, le vol ou les intempéries,</li>
              <li>Le transporter correctement.</li>
            </ul>
            <p className="text-gray-700">
              En cas de casse, perte, vol ou détérioration, le montant correspondant au remplacement sera facturé.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>8. NETTOYAGE</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Sauf mention contraire sur la fiche produit :
            </p>
            <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
              <li>Le nettoyage du matériel n'est pas inclus dans la location.</li>
              <li>Le matériel doit être rendu propre et sec.</li>
              <li>En cas de non-respect : forfait de nettoyage ou pénalité par article.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>9. FACTURATION</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              La location est due, que le matériel soit utilisé ou non.
            </p>
            <p className="text-gray-700 mb-2">
              Toute journée supplémentaire, non prévue initialement, sera facturée selon le tarif en vigueur.
            </p>
            <p className="text-gray-700">
              La facture est accessible dans l'espace client sur notre site.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>10. ANNULATION</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-none text-gray-700 space-y-2">
              <li>
                <strong>Annulation plus de 60 jours avant l'événement :</strong>
                <br />
                → Remboursement sous forme d'avoir (valable 12 mois).
              </li>
              <li>
                <strong>Annulation entre 30 et 60 jours avant l'événement :</strong>
                <br />
                → 50 % du montant restent dus, 50 % sous forme d'avoir.
              </li>
              <li>
                <strong>Annulation moins de 30 jours avant :</strong>
                <br />
                → Aucun remboursement (la totalité reste due).
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              Ces mesures couvrent les pertes d'exploitation et l'immobilisation du matériel.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>11. PROPRIÉTÉ DU MATÉRIEL</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Le matériel loué reste la propriété exclusive de « SKD Rent » exploité sous le statut d'Entreprise Individuelle (EI) par Youlou Pajusly et ne peut être cédé, sous-loué ou modifié.
            </p>
            <p className="text-gray-700">
              En cas de procédure judiciaire ou de liquidation, le matériel reste identifiable et exclu de toute saisie.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>12. CONFIDENTIALITÉ & COMMUNICATION</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Le client autorise « SKD Rent » exploité sous le statut d'Entreprise Individuelle (EI) par Youlou Pajusly à le citer comme référence (photos anonymisées, mentions dans un portfolio ou réseaux sociaux), sauf refus explicite.
            </p>
            <p className="text-gray-700">
              Les informations échangées dans le cadre de la réservation restent confidentielles.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>13. LITIGES</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              En cas de désaccord ou litige, et faute d'une résolution amiable, les tribunaux compétents seront ceux de la juridiction correspondant au siège de « SKD Rent » exploité sous le statut d'Entreprise Individuelle (EI) par Youlou Pajusly.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}


