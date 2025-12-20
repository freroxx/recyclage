import { createContext, useContext, useState, ReactNode } from "react";

type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const translations = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.project": "Le Projet",
    "nav.resources": "Ressources",
    "nav.contact": "Contact",
    "nav.events": "Événements",
    
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
    "project.intro": "L'École Maria, située à Agadir, s'engage activement pour la protection de l'environnement à travers son projet de recyclage. Ce projet a pour objectif de sensibiliser les élèves, le personnel et la communauté scolaire aux enjeux écologiques et de les inciter à adopter des comportements responsables pour un futur durable.",
    "project.goal.title": "But du projet :",
    "project.goal.text": "Le principal objectif est de protéger l'environnement en réduisant les déchets, en promouvant le recyclage et en inculquant aux jeunes générations l'importance de préserver la planète. Il s'agit également de développer un sens civique et écologique chez chaque élève, afin qu'il devienne un acteur conscient et responsable dans sa vie quotidienne.",
    "project.actions.title": "Actions concrètes mises en place :",
    "project.bins.title": "Bacs de tri sélectif :",
    "project.bins.text": "L'école a installé des bacs de tri dans toutes les classes et espaces communs pour collecter séparément le papier, le plastique, le métal et le verre. Cette initiative permet de faciliter le recyclage et de réduire les déchets envoyés en décharge.",
    "project.campaigns.title": "Campagnes de sensibilisation :",
    "project.campaigns.text": "Des affiches, des présentations et des ateliers sont organisés régulièrement pour informer et éduquer les élèves et le personnel sur les bonnes pratiques environnementales.",
    "project.workshops.title": "Ateliers pédagogiques et créatifs :",
    "project.workshops.text": "Les élèves participent à des activités où ils apprennent à réutiliser et transformer les matériaux recyclables en objets utiles ou artistiques, stimulant ainsi leur créativité tout en consolidant leur conscience écologique.",
    "project.monitoring.title": "Suivi et évaluation :",
    "project.monitoring.text": "Des outils de suivi permettent de mesurer l'impact du projet, notamment en quantifiant les déchets collectés et recyclés, afin d'améliorer continuellement les actions mises en place.",
    "project.impact.title": "Impact attendu :",
    "project.impact.text": "Ce projet vise à :",
    "project.impact.1": "Réduire l'empreinte écologique de l'école et de la communauté.",
    "project.impact.2": "Former des citoyens responsables et engagés, conscients de l'importance de protéger la planète.",
    "project.impact.3": "Créer un esprit collectif autour de la durabilité et du respect de l'environnement.",
    "project.impact.4": "Encourager Agadir à devenir un exemple de ville écoresponsable à travers des actions concrètes menées par ses jeunes citoyens.",
    "project.why.title": "Pourquoi participer ?",
    "project.why.text": "Le recyclage n'est pas seulement une action écologique, c'est un choix de vie durable. En s'impliquant dans ce projet, chaque élève devient un acteur du changement et contribue à un avenir plus propre et plus respectueux de l'environnement. L'École Maria invite donc tous ses élèves, enseignants et parents à rejoindre cette initiative et à faire partie d'un mouvement positif pour Agadir et notre planète.",
    "project.startLearning": "Commencer à apprendre",
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
    
    // Resources
    "resources.title": "Ressources",
    "resources.subtitle": "Documents et matériel pédagogique",
    "resources.guides": "Guides de tri",
    "resources.activities": "Activités éducatives",
    "resources.videos": "Vidéos",
    "resources.posters": "Affiches",
    "resources.view": "Voir",
    
    // Posters
    "posters.title": "Affiches de Recyclage",
    "posters.subtitle": "Découvrez nos affiches éducatives sur le recyclage",
    "posters.poster1": "Affiche Sauver la Terre avec les 3R",
    "posters.poster2": "Affiche Campagne de Recyclage Minimaliste",
    "posters.yahiaSection": "Designs de Yahia",
    "posters.salsabileSection": "Designs de Salsabile",
    "posters.posters": "affiches",
    "posters.allCommunityMade": "Toutes les affiches sont créées par la communauté",
    "posters.clickToView": "Cliquer pour voir",
    "posters.viewFullSize": "Voir en Taille Réelle",
    "posters.communityNote": "Vous voulez présenter votre design ? Partagez-le avec la communauté !",
    
    // Videos
    "videos.title": "Vidéos Éducatives",
    "videos.subtitle": "Découvrez nos vidéos sur le recyclage et l'environnement",
    "videos.video1.title": "Introduction au Recyclage",
    "videos.video1.description": "Une vidéo complète sur les bases du recyclage et son importance pour l'environnement",
    
    // Activities
    "activities.title": "Activités Éducatives",
    "activities.subtitle": "Jouez et apprenez avec nos jeux interactifs sur le recyclage",
    "activities.nextLevel": "Niveau Suivant",
    "activities.goHome": "Retour à l'Accueil",
    "activities.completed": "Tous les niveaux terminés !",
    "activities.restart": "Recommencer",
    "activities.game1.title": "Champion du Tri",
    "activities.game1.description": "Apprenez à trier correctement vos déchets",
    "activities.game2.title": "Un Geste pour la Planète",
    "activities.game2.description": "Découvrez l'impact de vos gestes quotidiens",
    "activities.game3.title": "Transforme tes Déchets",
    "activities.game3.description": "Explorez le cycle de vie des déchets recyclés",
    "activities.game4.title": "Le Roi du Compost",
    "activities.game4.description": "Maîtrisez l'art du compostage",
    
    // Guide
    "guide.title": "Guide de Tri",
    "guide.subtitle": "Apprenez à trier correctement vos déchets",
    "guide.chapter1.title": "Introduction au recyclage",
    "guide.chapter1.description": "Découvrez les bases du recyclage et son importance",
    "guide.chapter2.title": "Guide de tri des matériaux",
    "guide.chapter3.title": "Réduire et réutiliser",
    "guide.open": "Ouvrir",
    "guide.comingSoon": "Bientôt disponible",
    
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
    "footer.projectName": "Recyclage Maria",
    "footer.tagline": "Promouvoir des pratiques durables à l'École Maria, Agadir",
    "footer.website": "Site Web",
    "footer.support": "Soutenir",
    "footer.contact": "Contact",
    "footer.refresh": "Actualiser",
    "footer.rights": "Tous droits réservés",
    "footer.credits": "Crédits",
    "footer.projectCredits": "Crédits du Projet",
    "footer.thankYou": "Merci de soutenir l'éducation durable !",
    "footer.followUs": "Suivez-nous",
    "footer.school": "École Maria",
    "footer.creator": "Créateur",
    "footer.organization": "Organisation",
    "footer.created": "Créé",
    "footer.date": "Novembre 2025",
    "footer.project": "Projet",
    
    // Footer Credits (new translations)
    "footer.credits.projectTitle": "Titre du projet",
    "footer.credits.projectTitleValue": "Recyclage au sein de l'école Maria",
    "footer.credits.developer": "Développeur",
    "footer.credits.hosting": "Plateforme d'hébergement",
    "footer.credits.analytics": "Analytiques",
    "footer.credits.launch": "Lancement du projet",
    "footer.credits.school": "École",
    "footer.credits.subtitle": "Initiative d'éducation durable",
    "footer.credits.builtWith": "Construit avec",
    "footer.credits.lastUpdated": "Mis à jour",
    "footer.viewSourceCode": "Voir le code source sur GitHub",
    "footer.viewSource": "Voir le code source",
    
    // Common
    "common.close": "Fermer",
    "common.download": "Télécharger",
    "common.learnMore": "En savoir plus",
    "common.readMore": "Lire plus",
    "common.seeAll": "Voir tout",
    "common.loading": "Chargement",
    "common.error": "Erreur",
    "common.success": "Succès",
    "common.cancel": "Annuler",
    "common.confirm": "Confirmer",
    "common.save": "Sauvegarder",
    "common.edit": "Modifier",
    "common.delete": "Supprimer",
    "common.share": "Partager",
    "common.copy": "Copier",
    "common.copied": "Copié",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.sort": "Trier",
    "common.view": "Voir",
    "common.back": "Retour",
    "common.next": "Suivant",
    "common.previous": "Précédent",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.project": "The Project",
    "nav.resources": "Resources",
    "nav.contact": "Contact",
    "nav.events": "Events",
    
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
    "project.intro": "École Maria, located in Agadir, is actively committed to environmental protection through its recycling project. This project aims to raise awareness among students, staff and the school community about ecological issues and encourage them to adopt responsible behaviors for a sustainable future.",
    "project.goal.title": "Project Goal:",
    "project.goal.text": "The main objective is to protect the environment by reducing waste, promoting recycling and teaching young generations the importance of preserving the planet. It is also about developing a civic and ecological sense in each student, so that they become conscious and responsible actors in their daily lives.",
    "project.actions.title": "Concrete Actions Implemented:",
    "project.bins.title": "Sorting Bins:",
    "project.bins.text": "The school has installed sorting bins in all classrooms and common areas to separately collect paper, plastic, metal and glass. This initiative makes recycling easier and reduces waste sent to landfills.",
    "project.campaigns.title": "Awareness Campaigns:",
    "project.campaigns.text": "Posters, presentations and workshops are regularly organized to inform and educate students and staff about environmental best practices.",
    "project.workshops.title": "Educational and Creative Workshops:",
    "project.workshops.text": "Students participate in activities where they learn to reuse and transform recyclable materials into useful or artistic objects, stimulating their creativity while strengthening their ecological awareness.",
    "project.monitoring.title": "Monitoring and Evaluation:",
    "project.monitoring.text": "Monitoring tools measure the project's impact, particularly by quantifying waste collected and recycled, to continuously improve the actions implemented.",
    "project.impact.title": "Expected Impact:",
    "project.impact.text": "This project aims to:",
    "project.impact.1": "Reduce the school's and community's ecological footprint.",
    "project.impact.2": "Train responsible and engaged citizens, aware of the importance of protecting the planet.",
    "project.impact.3": "Create a collective spirit around sustainability and respect for the environment.",
    "project.impact.4": "Encourage Agadir to become an example of an eco-responsible city through concrete actions led by its young citizens.",
    "project.why.title": "Why Participate?",
    "project.why.text": "Recycling is not just an ecological action, it is a sustainable lifestyle choice. By getting involved in this project, each student becomes an agent of change and contributes to a cleaner future that is more respectful of the environment. École Maria therefore invites all its students, teachers and parents to join this initiative and be part of a positive movement for Agadir and our planet.",
    "project.startLearning": "Start learning",
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
    
    // Resources
    "resources.title": "Resources",
    "resources.subtitle": "Documents and educational materials",
    "resources.guides": "Sorting Guides",
    "resources.activities": "Educational Activities",
    "resources.videos": "Videos",
    "resources.posters": "Posters",
    "resources.view": "View",
    
    // Posters
    "posters.title": "Recycling Posters",
    "posters.subtitle": "Discover our educational posters about recycling",
    "posters.poster1": "Save the Earth With 3R Poster",
    "posters.poster2": "Minimalist Recycling Campaign Poster",
    "posters.yahiaSection": "Yahia's Designs",
    "posters.salsabileSection": "Salsabile's Designs",
    "posters.posters": "posters",
    "posters.allCommunityMade": "All posters made by the community",
    "posters.clickToView": "Click to view",
    "posters.viewFullSize": "View Full Size",
    "posters.communityNote": "Want to showcase your design? Share it with the community!",
    
    // Videos
    "videos.title": "Educational Videos",
    "videos.subtitle": "Discover our videos on recycling and the environment",
    "videos.video1.title": "Introduction to Recycling",
    "videos.video1.description": "A comprehensive video on the basics of recycling and its importance for the environment",
    
    // Activities
    "activities.title": "Educational Activities",
    "activities.subtitle": "Play and learn with our interactive recycling games",
    "activities.nextLevel": "Next Level",
    "activities.goHome": "Go Back Home",
    "activities.completed": "All levels completed!",
    "activities.restart": "Restart",
    "activities.game1.title": "Sorting Champion",
    "activities.game1.description": "Learn how to sort your waste correctly",
    "activities.game2.title": "A Gesture for the Planet",
    "activities.game2.description": "Discover the impact of your daily actions",
    "activities.game3.title": "Transform Your Waste",
    "activities.game3.description": "Explore the lifecycle of recycled waste",
    "activities.game4.title": "Compost King",
    "activities.game4.description": "Master the art of composting",
    
    // Guide
    "guide.title": "Sorting Guide",
    "guide.subtitle": "Learn how to properly sort your waste",
    "guide.chapter1.title": "Introduction to Recycling",
    "guide.chapter1.description": "Discover the basics of recycling and its importance",
    "guide.chapter2.title": "Material Sorting Guide",
    "guide.chapter3.title": "Reduce and Reuse",
    "guide.open": "Open",
    "guide.comingSoon": "Coming Soon",
    
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
    "footer.projectName": "Recyclage Maria",
    "footer.tagline": "Promoting sustainable practices at Maria School, Agadir",
    "footer.website": "Website",
    "footer.support": "Support",
    "footer.contact": "Contact",
    "footer.refresh": "Refresh",
    "footer.rights": "All rights reserved",
    "footer.credits": "Credits",
    "footer.projectCredits": "Project Credits",
    "footer.thankYou": "Thank you for supporting sustainable education!",
    "footer.followUs": "Follow us",
    "footer.school": "Maria School",
    "footer.creator": "Creator",
    "footer.organization": "Organization",
    "footer.created": "Created",
    "footer.date": "November 2025",
    "footer.project": "Project",
    
    // Footer Credits (new translations)
    "footer.credits.projectTitle": "Project Title",
    "footer.credits.projectTitleValue": "Recycling within Maria School",
    "footer.credits.developer": "Developer",
    "footer.credits.hosting": "Hosting Platform",
    "footer.credits.analytics": "Analytics",
    "footer.credits.launch": "Project Launch",
    "footer.credits.school": "School",
    "footer.credits.subtitle": "Sustainable Education Initiative",
    "footer.credits.builtWith": "Built With",
    "footer.credits.lastUpdated": "Updated",
    "footer.viewSourceCode": "View Source Code on GitHub",
    "footer.viewSource": "View Source",
    
    // Common
    "common.close": "Close",
    "common.download": "Download",
    "common.learnMore": "Learn More",
    "common.readMore": "Read More",
    "common.seeAll": "See All",
    "common.loading": "Loading",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.share": "Share",
    "common.copy": "Copy",
    "common.copied": "Copied",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.view": "View",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
  },
};

// Création du contexte
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: Props) => {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: string, fallback?: string) => {
    const translation = translations[language][key];
    if (translation !== undefined) {
      return translation;
    }
    
    // If translation doesn't exist and we have a fallback, use it
    if (fallback !== undefined) {
      return fallback;
    }
    
    // If no translation and no fallback, return the key
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Export everything yeah ok i'll stfu
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
