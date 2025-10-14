import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Review } from "@shared/schema";

export function ReviewsSection() {
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const publishedReviews = reviews?.filter(review => review.isPublished) || [];

  if (publishedReviews.length === 0) {
    return (
      <div className="text-center py-12">
        <Quote className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Aucun avis pour le moment</p>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-playfair font-bold text-gray-800 dark:text-gray-100 mb-2">
          Témoignages Clients
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          L'avis de nos clients qui nous font confiance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-lg transition-shadow duration-300 border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                {renderStars(review.rating)}
                <Quote className="h-6 w-6 text-gold/50" />
              </div>
              
              <blockquote className="text-gray-700 dark:text-gray-300 mb-4 italic">
                "{review.comment}"
              </blockquote>
              
              <div className="flex items-center justify-between">
                <cite className="text-sm font-semibold text-gray-800 dark:text-gray-200 not-italic">
                  {review.customerName}
                </cite>
                {review.serviceType && (
                  <span className="text-xs px-2 py-1 bg-gold/20 text-gold rounded-full">
                    {review.serviceType}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-green-800 dark:text-green-300">
            5.0 / 5 basé sur {publishedReviews.length} avis
          </span>
        </div>
      </div>
    </div>
  );
}