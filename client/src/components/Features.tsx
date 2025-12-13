import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Truck, 
  Heart, 
  Globe, 
  Award,
  Clock,
  Shield
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Palette,
      title: "Personnalisation à l'infini",
      description: "Tous nos produits sont personnalisables sur tous les thèmes. Créez un univers unique qui vous ressemble.",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: Heart,
      title: "Fabrication fait main",
      description: "Chaque création est réalisée avec soin et passion par nos artisans. Qualité garantie.",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
    {
      icon: Globe,
      title: "Expédition Europe",
      description: "Livraison dans toute l'Europe. Vos créations voyagent jusqu'à vous en toute sécurité.",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Clock,
      title: "Service rapide",
      description: "Préparation et expédition rapides pour que vos événements soient parfaits à temps.",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: Award,
      title: "Qualité premium",
      description: "Matériaux de haute qualité et finitions soignées pour des résultats exceptionnels.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      icon: Shield,
      title: "Satisfaction garantie",
      description: "Votre satisfaction est notre priorité. Service client réactif et bienveillant.",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-3xl font-playfair font-bold text-gray-800 dark:text-gray-100">
            Pourquoi choisir SakaDeco ?
          </h2>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Une expérience unique alliant créativité, qualité et personnalisation 
          pour transformer vos moments en souvenirs inoubliables.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-gold/20">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-playfair font-bold text-gray-800 dark:text-gray-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
}