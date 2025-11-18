import { createContext, useContext, useState, ReactNode } from "react";

type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.project": "Le Projet",
    "nav.allAges": "Pour Tous les Âges",
    "nav.resources": "Ressources",
    "nav.contact": "Contact",
    
    // Hero
    "hero.title": "Un geste simple, un avenir propre.",
    "hero.subtitle": "Initiative de recyclage à l'École Maria - Ensemble pour une école plus verte",
    "hero.cta": "Découvrir le projet",
    
    // Home Presentation
    "home.presentation.title": "Comment recycler ?",
    "home.presentation.subtitle": "Découvrez notre guide complet sur le recyclage",
    "home.presentation.by": "par",
    
    // Project
    "project.title": "Le Projet",
    "project.intro": "Notre programme de recyclage transforme l'École Maria en modèle de durabilité. Chaque jour, élèves et personnel participent activement au tri des déchets.",
    "project.bins.title": "Nos Bacs de Tri",
    "project.bins.plastic": "Plastique",
    "project.bins.paper": "Papier & Carton",
    "project.bins.organic": "Organique",
    "project.bins.metal": "Métal",
    "project.implementation": "Mise en œuvre des bacs de tri",
    "project.implementation.desc": "Installation de stations de tri dans toute l'école",
    "project.awareness": "Sensibilisation des élèves",
    "project.awareness.desc": "Ateliers et activités éducatives sur le recyclage",
    "project.mobilization": "Mobilisation de toute l'école",
    "project.mobilization.desc": "Participation active de tous les membres de la communauté",
    
    // All Ages
    "allAges.title": "Pour Tous les Âges",
    "allAges.developing": "Cette page est encore en développement",
    "allAges.coming": "Contenu à venir prochainement",
    
    // Resources
    "resources.title": "Ressources",
    "resources.subtitle": "Documents et matériel pédagogique",
    "resources.guides": "Guides de tri",
    "resources.activities": "Activités éducatives",
    "resources.videos": "Vidéos",
    "resources.posters": "Affiches",
    
    // Contact
    "contact.title": "Contactez-nous",
    "contact.subtitle": "Une question ? Une suggestion ? Écrivez-nous !",
    "contact.name": "Nom",
    "contact.email": "Email",
    "contact.message": "Message",
    "contact.send": "Envoyer",
    "contact.success": "Message envoyé avec succès !",
    "contact.error": "Erreur lors de l'envoi. Veuillez réessayer.",
    
    // Footer
    "footer.followUs": "Suivez-nous",
    "footer.school": "École Maria",
    "footer.rights": "Tous droits réservés",
    "footer.credits": "Crédits",
    "footer.creditsTitle": "Crédits du Projet",
    "footer.creator": "Créateur",
    "footer.organization": "Organisation",
    "footer.created": "Créé",
    "footer.date": "Novembre 2025",
    "footer.project": "Projet",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.project": "The Project",
    "nav.allAges": "For All Ages",
    "nav.resources": "Resources",
    "nav.contact": "Contact",
    
    // Hero
    "hero.title": "A simple action for a cleaner future.",
    "hero.subtitle": "Recycling initiative at École Maria - Together for a greener school",
    "hero.cta": "Discover the project",
    
    // Home Presentation
    "home.presentation.title": "How to Recycle?",
    "home.presentation.subtitle": "Discover our complete guide on recycling",
    "home.presentation.by": "by",
    
    // Project
    "project.title": "The Project",
    "project.intro": "Our recycling program transforms École Maria into a sustainability model. Every day, students and staff actively participate in waste sorting.",
    "project.bins.title": "Our Sorting Bins",
    "project.bins.plastic": "Plastic",
    "project.bins.paper": "Paper & Cardboard",
    "project.bins.organic": "Organic",
    "project.bins.metal": "Metal",
    "project.implementation": "Installation of sorting bins",
    "project.implementation.desc": "Setting up sorting stations throughout the school",
    "project.awareness": "Student awareness",
    "project.awareness.desc": "Workshops and educational activities on recycling",
    "project.mobilization": "Whole school involvement",
    "project.mobilization.desc": "Active participation from all community members",
    
    // All Ages
    "allAges.title": "For All Ages",
    "allAges.developing": "This page is still under development",
    "allAges.coming": "Content coming soon",
    
    // Resources
    "resources.title": "Resources",
    "resources.subtitle": "Documents and educational materials",
    "resources.guides": "Sorting Guides",
    "resources.activities": "Educational Activities",
    "resources.videos": "Videos",
    "resources.posters": "Posters",
    
    // Contact
    "contact.title": "Contact Us",
    "contact.subtitle": "Have a question? A suggestion? Write to us!",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.message": "Message",
    "contact.send": "Send",
    "contact.success": "Message sent successfully!",
    "contact.error": "Error sending message. Please try again.",
    
    // Footer
    "footer.followUs": "Follow us",
    "footer.school": "École Maria",
    "footer.rights": "All rights reserved",
    "footer.credits": "Credits",
    "footer.creditsTitle": "Project Credits",
    "footer.creator": "Creator",
    "footer.organization": "Organization",
    "footer.created": "Created",
    "footer.date": "November 2025",
    "footer.project": "Project",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
