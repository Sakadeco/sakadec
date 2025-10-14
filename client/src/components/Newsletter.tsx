import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const subscribeToNewsletter = useMutation({
    mutationFn: (data: { email: string; name?: string }) =>
      apiRequest("/api/newsletter/subscribe", "POST", data),
    onSuccess: () => {
      toast({
        title: "Inscription réussie !",
        description: "Vous recevrez nos dernières nouveautés et promotions.",
      });
      setEmail("");
      setName("");
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter"] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de s'inscrire. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    subscribeToNewsletter.mutate({ email, name: name || undefined });
  };

  return (
    <Card className="bg-gradient-to-br from-gold/10 to-white dark:from-gold/5 dark:to-gray-900 border-gold/20">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gold/20 rounded-full">
              <Mail className="h-6 w-6 text-gold" />
            </div>
          </div>
          <h3 className="text-2xl font-playfair font-bold text-gray-800 dark:text-gray-100 mb-2">
            Restez informé(e) !
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Promotions et nouveaux produits
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
            Soyez les premiers au courant
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Votre prénom (optionnel)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gold/30 focus:border-gold"
            />
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-gold/30 focus:border-gold"
            />
          </div>
          
          <Button
            type="submit"
            disabled={subscribeToNewsletter.isPending}
            className="w-full bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-white font-montserrat font-semibold py-3 transition-all duration-300 transform hover:scale-105"
          >
            {subscribeToNewsletter.isPending ? "Inscription..." : "S'inscrire"}
          </Button>
        </form>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
          Nous respectons votre vie privée. Désinscription à tout moment.
        </p>
      </CardContent>
    </Card>
  );
}