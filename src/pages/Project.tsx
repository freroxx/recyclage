import { Card, CardContent } from "@/components/ui/card";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Trash2, FileText, Apple, Package, Target, Users, Lightbulb, TrendingUp, Leaf, Recycle } from "lucide-react";

export default function Project() {
  useScrollReveal();

  const bins = [
    { icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10", label: "Papier" },
    { icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", label: "Plastique" },
    { icon: Trash2, color: "text-gray-500", bg: "bg-gray-500/10", label: "Métal" },
    { icon: Apple, color: "text-green-500", bg: "bg-green-500/10", label: "Verre" },
  ];

  const actions = [
    {
      icon: Recycle,
      title: "Bacs de tri sélectif",
      description: "L'école a installé des bacs de tri dans toutes les classes et espaces communs pour collecter séparément le papier, le plastique, le métal et le verre. Cette initiative permet de faciliter le recyclage et de réduire les déchets envoyés en décharge.",
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-500"
    },
    {
      icon: Lightbulb,
      title: "Campagnes de sensibilisation",
      description: "Des affiches, des présentations et des ateliers sont organisés régulièrement pour informer et éduquer les élèves et le personnel sur les bonnes pratiques environnementales.",
      gradient: "from-amber-500/10 to-orange-500/10",
      iconColor: "text-amber-500"
    },
    {
      icon: Users,
      title: "Ateliers pédagogiques et créatifs",
      description: "Les élèves participent à des activités où ils apprennent à réutiliser et transformer les matériaux recyclables en objets utiles ou artistiques, stimulant ainsi leur créativité tout en consolidant leur conscience écologique.",
      gradient: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Suivi et évaluation",
      description: "Des outils de suivi permettent de mesurer l'impact du projet, notamment en quantifiant les déchets collectés et recyclés, afin d'améliorer continuellement les actions mises en place.",
      gradient: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-500"
    }
  ];

  const impacts = [
    "Réduire l'empreinte écologique de l'école et de la communauté.",
    "Former des citoyens responsables et engagés, conscients de l'importance de protéger la planète.",
    "Créer un esprit collectif autour de la durabilité et du respect de l'environnement.",
    "Encourager Agadir à devenir un exemple de ville écoresponsable à travers des actions concrètes menées par ses jeunes citoyens."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" />
            <span>Projet de Recyclage</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-green-600 to-primary bg-clip-text text-transparent leading-tight">
            L'École Maria s'engage pour l'environnement
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            L'École Maria, située à Agadir, s'engage activement pour la protection de l'environnement à travers son projet de recyclage. Ce projet a pour objectif de sensibiliser les élèves, le personnel et la communauté scolaire aux enjeux écologiques et de les inciter à adopter des comportements responsables pour un futur durable.
          </p>
        </div>

        {/* Goal Section */}
        <div className="max-w-5xl mx-auto mb-20 scroll-rotate-in">
          <Card className="border-2 border-primary/20 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group cursor-pointer">
            <div className="bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 p-8 transition-all duration-500 group-hover:from-primary/20 group-hover:via-green-500/20 group-hover:to-primary/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:bg-primary/30">
                  <Target className="w-6 h-6 text-primary transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h2 className="text-3xl font-bold transition-colors duration-300 group-hover:text-primary">But du projet</h2>
              </div>
              <p className="text-lg leading-relaxed text-foreground/90">
                Le principal objectif est de <span className="font-semibold text-primary">protéger l'environnement</span> en réduisant les déchets, en promouvant le recyclage et en inculquant aux jeunes générations l'importance de préserver la planète. Il s'agit également de développer un <span className="font-semibold text-primary">sens civique et écologique</span> chez chaque élève, afin qu'il devienne un acteur conscient et responsable dans sa vie quotidienne.
              </p>
            </div>
          </Card>
        </div>

        {/* Sorting Bins */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 scroll-reveal">Nos Bacs de Tri</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bins.map((bin, index) => (
              <Card
                key={bin.label}
                className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 scroll-reveal border-2 group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-8 pb-6 text-center">
                  <div className={`w-20 h-20 rounded-2xl ${bin.bg} flex items-center justify-center mx-auto mb-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12`}>
                    <bin.icon className={`w-10 h-10 ${bin.color} transition-transform duration-500`} />
                  </div>
                  <h3 className="font-bold text-lg transition-colors duration-300 group-hover:text-primary">{bin.label}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-4 scroll-reveal">Actions concrètes mises en place</h2>
          <p className="text-center text-muted-foreground mb-12 scroll-reveal">
            Découvrez comment nous agissons au quotidien pour un avenir plus vert
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {actions.map((action, index) => (
              <Card
                key={action.title}
                className={`scroll-reveal hover:shadow-2xl transition-all duration-500 border-2 overflow-hidden group cursor-pointer hover:-translate-y-2`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                <CardContent className="pt-8 pb-8 relative">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6`}>
                    <action.icon className={`w-7 h-7 ${action.iconColor} transition-transform duration-500 group-hover:scale-110`} />
                  </div>
                  <h3 className="font-bold text-xl mb-3 transition-colors duration-300 group-hover:text-primary">{action.title}</h3>
                  <p className="text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div className="max-w-5xl mx-auto mb-20 scroll-fade-left">
          <Card className="border-2 border-green-500/20 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group cursor-pointer">
            <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 p-8 transition-all duration-500 group-hover:from-green-500/20 group-hover:via-emerald-500/20 group-hover:to-green-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:bg-green-500/30">
                  <TrendingUp className="w-6 h-6 text-green-600 transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h2 className="text-3xl font-bold transition-colors duration-300 group-hover:text-green-600">Impact attendu</h2>
              </div>
              <p className="text-lg mb-6 text-muted-foreground">Ce projet vise à :</p>
              <div className="space-y-4">
                {impacts.map((impact, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:bg-green-500/30">
                      <Leaf className="w-4 h-4 text-green-600 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <p className="text-foreground/90 leading-relaxed transition-colors duration-300 group-hover:text-foreground">{impact}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto text-center scroll-fade-right">
          <Card className="border-2 border-primary/30 shadow-2xl overflow-hidden hover:shadow-[0_0_60px_-15px_rgba(var(--primary),0.5)] transition-all duration-700 hover:scale-[1.03] group cursor-pointer">
            <div className="bg-gradient-to-br from-primary/20 via-green-500/20 to-primary/20 p-12 transition-all duration-700 group-hover:from-primary/30 group-hover:via-green-500/30 group-hover:to-primary/30">
              <h2 className="text-4xl font-bold mb-6">Pourquoi participer ?</h2>
              <p className="text-lg leading-relaxed mb-6">
                Le recyclage n'est pas seulement une action écologique, c'est un <span className="font-semibold text-primary">choix de vie durable</span>. En s'impliquant dans ce projet, chaque élève devient un acteur du changement et contribue à un avenir plus propre et plus respectueux de l'environnement.
              </p>
              <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 inline-block">
                <p className="text-xl font-semibold text-primary mb-2">
                  Rejoignez le mouvement !
                </p>
                <p className="text-muted-foreground">
                  L'École Maria invite tous ses élèves, enseignants et parents à rejoindre cette initiative et à faire partie d'un mouvement positif pour Agadir et notre planète.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
