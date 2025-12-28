import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CGV() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-8">
          Conditions Générales de Vente
        </h1>
        <p className="text-gray-600 mb-8">
          SKD GROUP_ SKD Shop/ SKD Créa
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Préambule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent l'ensemble des ventes réalisées via notre boutique, spécialisé dans la vente d'articles décoratifs et de produits personnalisés.
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Vendeur :</strong> Youlou Pajusly – Entreprise Individuelle, exerçant sous le nom commercial « SKD SHOP » et « SKD CREA ».
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Statut :</strong> Entreprise individuelle
            </p>
            <p className="text-gray-700 mb-2">
              <strong>SIRET :</strong> 89956934700011
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Contact :</strong> sakadeco.contact@gmail.com
            </p>
            <p className="text-gray-700">
              Les CGV s'appliquent à toute commande passée par une personne physique ou morale (ci-après « le Client ») sur le site internet de : Youlou Pajusly – Entreprise Individuelle, exerçant sous le nom commercial « SKD SHOP » et « SKD CREA ».
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 1 – Objet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Les présentes CGV définissent les droits et obligations des parties dans le cadre de la vente en ligne de produits proposés par : Youlou Pajusly – Entreprise Individuelle, exerçant sous le nom commercial « SKD SHOP » et « SKD CREA ».
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 2 – Acceptation des CGV</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Toute commande implique l'acceptation pleine et entière des présentes CGV. Le Client reconnaît en avoir pris connaissance avant validation de sa commande via une case à cocher.
            </p>
            <p className="text-gray-700">
              SKD SHOP se réserve le droit de modifier les CGV à tout moment. Les CGV applicables sont celles en vigueur à la date de paiement de la commande.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 3 – Produits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Youlou Pajusly – Entreprise Individuelle, exerçant sous le nom commercial « SKD SHOP » et « SKD CREA » propose des articles de décoration et produits personnalisables. Les caractéristiques essentielles sont présentées sur chaque fiche produit.
            </p>
            <p className="text-gray-700 mb-4">
              Les visuels sont fournis à titre indicatif. Des variations de couleurs ou de rendu peuvent exister, notamment du fait de la personnalisation ou des écrans.
            </p>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Personnalisation</h3>
              <p className="text-gray-700 mb-2">
                Le Client est responsable des informations fournies (orthographe, dates, prénoms, couleurs, thèmes). Aucune modification ne pourra être apportée après validation de la commande.
              </p>
              <p className="text-gray-700 mb-2">
                Les produits issus de thèmes existants ne font pas l'objet d'un envoi de visuel avant fabrication. Les créations sur mesure peuvent faire l'objet d'un aperçu pour validation.
              </p>
              <p className="text-gray-700">
                SKD SHOP se réserve le droit d'adapter couleurs, typographies ou éléments graphiques afin de garantir un rendu harmonieux et lisible.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 4 – Prix</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Les prix sont indiqués en euros, hors taxe, hors frais de livraison.
            </p>
            <p className="text-gray-700">
              Youlou Pajusly – Entreprise Individuelle, exerçant sous le nom commercial « SKD SHOP » et « SKD CREA » se réserve le droit de modifier ses tarifs à tout moment, sans effet rétroactif sur les commandes déjà validées.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 5 – Commande</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">La commande est validée après :</p>
            <ul className="list-disc list-inside text-gray-700 ml-4 mb-2">
              <li>Sélection des produits,</li>
              <li>Saisie des informations de personnalisation,</li>
              <li>Acceptation des CGV,</li>
              <li>Paiement intégral.</li>
            </ul>
            <p className="text-gray-700">
              Un email de confirmation est envoyé au Client après validation.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 6 – Paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Le paiement est exigible immédiatement à la commande.
            </p>
            <p className="text-gray-700 mb-2">
              Moyens de paiement acceptés : carte bancaire via une plateforme de paiement sécurisée.
            </p>
            <p className="text-gray-700">
              Toute transaction est irrévocable.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 7 – Délais de fabrication et livraison</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Les commandes sont traitées par date d'événement.
            </p>
            <p className="text-gray-700 mb-2">
              Les délais de fabrication et d'expédition varient entre 6 et 25 jours ouvrés, selon la nature des produits et la période.
            </p>
            <p className="text-gray-700 mb-2">Délais de livraison indicatifs :</p>
            <ul className="list-disc list-inside text-gray-700 ml-4 mb-2">
              <li>Colissimo : 2 jours ouvrés (France métropolitaine)</li>
              <li>Mondial Relay : 3 à 4 jours ouvrés (France métropolitaine)</li>
              <li>Chronopost : livraison le lendemain avant 18h (France métropolitaine)</li>
              <li>Europe : délais variables selon destination</li>
            </ul>
            <p className="text-gray-700">
              Les délais sont donnés à titre indicatif.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 8 – Livraison</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Les produits sont livrés à l'adresse indiquée lors de la commande.
            </p>
            <p className="text-gray-700 mb-2">
              SKD SHOP ne saurait être tenue responsable des retards imputables aux transporteurs ou à un cas de force majeure.
            </p>
            <p className="text-gray-700">
              Les produits sont conditionnés avec soin. Des emballages recyclés peuvent être utilisés dans une démarche écoresponsable.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 9 – Droit de rétractation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Conformément à l'article L221-28 du Code de la consommation, les produits personnalisés ne bénéficient d'aucun droit de rétractation.
            </p>
            <p className="text-gray-700">
              Aucune annulation ni remboursement ne pourra être accepté une fois la commande validée.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 10 – Garanties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Les produits bénéficient des garanties légales de conformité et contre les vices cachés, conformément à la législation en vigueur.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 11 – Réserve de propriété</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Les produits demeurent la propriété de Youlou Pajusly – Entreprise Individuelle, exerçant sous le nom commercial « SKD SHOP » et « SKD CREA » jusqu'au paiement intégral de la commande.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 12 – Propriété intellectuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Tous les contenus du site (textes, images, visuels, logos, créations) sont la propriété exclusive de Youlou Pajusly – Entreprise Individuelle, exerçant sous le nom commercial « SKD SHOP » et « SKD CREA ».
            </p>
            <p className="text-gray-700">
              Toute reproduction, même partielle, est strictement interdite sans autorisation écrite préalable.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Article 13 – Force majeure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Youlou Pajusly – Entreprise Individuelle, exerçant sous le nom commercial « SKD SHOP » et « SKD CREA » ne pourra être tenue responsable en cas d'événement de force majeure empêchant l'exécution de ses obligations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Article 14 – Droit applicable et litiges</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-2">
              Les présentes CGV sont soumises au droit français.
            </p>
            <p className="text-gray-700">
              En cas de litige, une solution amiable sera recherchée en priorité. À défaut, le litige sera porté devant le Tribunal de commerce compétent.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}


