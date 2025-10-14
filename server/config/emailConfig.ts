// Configuration pour les emails avec avatar personnalisé
export const emailConfig = {
  // Configuration de l'expéditeur
  sender: {
    name: "SakaDeco Group",
    email: process.env.EMAIL_USER || '',
    // URL de l'avatar (peut être un service comme Gravatar ou une image hébergée)
    avatarUrl: "https://www.gravatar.com/avatar/skd-group?d=https://sakadeco-api.onrender.com/logo-avatar.png"
  },
  
  // Configuration des en-têtes pour améliorer l'affichage
  headers: {
    'X-Entity-Ref-ID': 'skd-group-logo',
    'X-Auto-Response-Suppress': 'OOF, AutoReply',
    'Precedence': 'bulk'
  },
  
  // Configuration pour différents types d'emails
  templates: {
    order: {
      subject: "Commande confirmée - {orderNumber}",
      fromName: "SakaDeco Group - Boutique"
    },
    rental: {
      subject: "Location confirmée - {orderNumber}",
      fromName: "SakaDeco Group - Location"
    },
    quote: {
      subject: "Demande de devis reçue - {service}",
      fromName: "SakaDeco Group - Devis"
    },
    admin: {
      subject: "Nouvelle notification - {type}",
      fromName: "SakaDeco Group - Système"
    }
  }
};

// Fonction pour obtenir la configuration de l'expéditeur
export function getSenderConfig(type: 'order' | 'rental' | 'quote' | 'admin' = 'order') {
  return {
    name: emailConfig.templates[type].fromName,
    address: emailConfig.sender.email
  };
}

// Fonction pour obtenir les en-têtes d'email
export function getEmailHeaders() {
  return emailConfig.headers;
}
