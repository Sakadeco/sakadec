import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  isActive: boolean;
}

export default function AnnouncementPopup() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActiveAnnouncement();
  }, []);

  const fetchActiveAnnouncement = async () => {
    try {
      const response = await fetch("/api/announcement/active");
      if (response.ok) {
        const data = await response.json();
        if (data) {
          // Vérifier si l'utilisateur a déjà fermé cette actualité dans cette session
          const closedAnnouncementId = sessionStorage.getItem("closedAnnouncementId");
          if (closedAnnouncementId !== data._id) {
            setAnnouncement(data);
            setIsVisible(true);
          }
        }
      }
    } catch (error) {
      console.error("Erreur récupération actualité:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (announcement) {
      // Sauvegarder l'ID de l'actualité fermée dans sessionStorage
      sessionStorage.setItem("closedAnnouncementId", announcement._id);
    }
    setIsVisible(false);
  };

  if (isLoading || !isVisible || !announcement) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-w-2xl w-full relative animate-in fade-in slide-in-from-bottom-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pr-8">
            {announcement.title}
          </h2>
          <div className="text-gray-700 whitespace-pre-wrap mb-6">
            {announcement.content}
          </div>
          <div className="flex justify-end">
            <Button onClick={handleClose}>
              Fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

