import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  BookOpen, 
  Trophy, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Target,
  Award
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Level {
  id: number;
  title: string;
  description: string;
  icon: typeof BookOpen;
  color: string;
  bg: string;
  facts: string[];
  questions: Question[];
}

export default function Guide() {
  const { t, language } = useLanguage();
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showFacts, setShowFacts] = useState(true);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  useScrollReveal();

  const levels: Level[] = [
    {
      id: 1,
      title: language === "fr" ? "Les Bases du Recyclage" : "Recycling Basics",
      description: language === "fr" ? "Découvrez les fondamentaux du tri" : "Discover the fundamentals of sorting",
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
      facts: language === "fr" ? [
        "♻️ Le recyclage permet de réduire les déchets envoyés en décharge de 30%",
        "🌍 Une bouteille en plastique met 450 ans à se décomposer",
        "📦 Le carton est recyclable jusqu'à 7 fois",
        "🔋 Une pile peut polluer 1m³ de terre pendant 50 ans"
      ] : [
        "♻️ Recycling reduces landfill waste by 30%",
        "🌍 A plastic bottle takes 450 years to decompose",
        "📦 Cardboard can be recycled up to 7 times",
        "🔋 One battery can pollute 1m³ of soil for 50 years"
      ],
      questions: language === "fr" ? [
        {
          question: "Dans quelle poubelle jette-t-on une bouteille en plastique ?",
          options: ["Poubelle verte (verre)", "Poubelle jaune (recyclables)", "Poubelle noire (ordures)", "Poubelle marron (organique)"],
          correct: 1,
          explanation: "Les bouteilles en plastique vont dans la poubelle jaune avec les autres emballages recyclables."
        },
        {
          question: "Que signifie le symbole ♻️ sur un emballage ?",
          options: ["Le produit est bio", "L'emballage est recyclable", "Le produit est dangereux", "Le produit est compostable"],
          correct: 1,
          explanation: "Le symbole ♻️ indique que l'emballage peut être recyclé."
        },
        {
          question: "Combien de fois peut-on recycler le verre ?",
          options: ["3 fois", "7 fois", "À l'infini", "1 seule fois"],
          correct: 2,
          explanation: "Le verre est recyclable à l'infini sans perdre ses qualités !"
        }
      ] : [
        {
          question: "Which bin should a plastic bottle go in?",
          options: ["Green bin (glass)", "Yellow bin (recyclables)", "Black bin (waste)", "Brown bin (organic)"],
          correct: 1,
          explanation: "Plastic bottles go in the yellow bin with other recyclable packaging."
        },
        {
          question: "What does the ♻️ symbol mean on packaging?",
          options: ["The product is organic", "The packaging is recyclable", "The product is dangerous", "The product is compostable"],
          correct: 1,
          explanation: "The ♻️ symbol indicates that the packaging can be recycled."
        },
        {
          question: "How many times can glass be recycled?",
          options: ["3 times", "7 times", "Infinitely", "Only once"],
          correct: 2,
          explanation: "Glass can be recycled infinitely without losing its qualities!"
        }
      ]
    },
    {
      id: 2,
      title: language === "fr" ? "Tri Avancé" : "Advanced Sorting",
      description: language === "fr" ? "Maîtrisez les cas complexes" : "Master complex cases",
      icon: Target,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      facts: language === "fr" ? [
        "🍕 Les cartons de pizza sales ne se recyclent pas",
        "💊 Les médicaments doivent être rapportés en pharmacie",
        "📱 Un smartphone contient plus de 70 matériaux différents",
        "🧴 Les flacons de shampoing se recyclent même avec le bouchon"
      ] : [
        "🍕 Greasy pizza boxes cannot be recycled",
        "💊 Medicines must be returned to pharmacies",
        "📱 A smartphone contains more than 70 different materials",
        "🧴 Shampoo bottles can be recycled even with the cap"
      ],
      questions: language === "fr" ? [
        {
          question: "Un pot de yaourt doit-il être lavé avant d'être jeté ?",
          options: ["Oui, parfaitement propre", "Non, juste bien vidé", "Oui, avec du savon", "Ça dépend du yaourt"],
          correct: 1,
          explanation: "Il suffit de bien vider le pot, pas besoin de le laver parfaitement."
        },
        {
          question: "Où jeter une ampoule LED usagée ?",
          options: ["Poubelle jaune", "Poubelle verre", "Point de collecte spécifique", "Poubelle noire"],
          correct: 2,
          explanation: "Les ampoules LED contiennent des composants électroniques et doivent être déposées dans des points de collecte spécifiques."
        },
        {
          question: "Le papier aluminium est-il recyclable ?",
          options: ["Non, jamais", "Oui, s'il est propre et en boule", "Oui, même sale", "Seulement le papier épais"],
          correct: 1,
          explanation: "Le papier aluminium propre peut être recyclé s'il est compacté en boule."
        }
      ] : [
        {
          question: "Should a yogurt container be washed before disposal?",
          options: ["Yes, perfectly clean", "No, just well emptied", "Yes, with soap", "It depends on the yogurt"],
          correct: 1,
          explanation: "Just empty the container well, no need to wash it perfectly."
        },
        {
          question: "Where should a used LED bulb be disposed?",
          options: ["Yellow bin", "Glass bin", "Specific collection point", "Black bin"],
          correct: 2,
          explanation: "LED bulbs contain electronic components and must be deposited at specific collection points."
        },
        {
          question: "Is aluminum foil recyclable?",
          options: ["No, never", "Yes, if clean and balled up", "Yes, even dirty", "Only thick foil"],
          correct: 1,
          explanation: "Clean aluminum foil can be recycled if compacted into a ball."
        }
      ]
    },
    {
      id: 3,
      title: language === "fr" ? "Expert Écolo" : "Eco Expert",
      description: language === "fr" ? "Devenez un champion du recyclage" : "Become a recycling champion",
      icon: Award,
      color: "text-green-600",
      bg: "bg-green-600/10",
      facts: language === "fr" ? [
        "🌱 Le compostage réduit de 30% le poids de nos poubelles",
        "👕 12kg de vêtements sont jetés par personne et par an en France",
        "🚗 Recycler une canette économise assez d'énergie pour faire tourner une TV 3h",
        "📰 Recycler 1 tonne de papier sauve 17 arbres"
      ] : [
        "🌱 Composting reduces our trash weight by 30%",
        "👕 12kg of clothes are thrown away per person per year in France",
        "🚗 Recycling one can saves enough energy to run a TV for 3 hours",
        "📰 Recycling 1 ton of paper saves 17 trees"
      ],
      questions: language === "fr" ? [
        {
          question: "Quel est l'ordre des 3R du recyclage ?",
          options: ["Recycler, Réduire, Réutiliser", "Réduire, Réutiliser, Recycler", "Réutiliser, Recycler, Réduire", "Réduire, Recycler, Réutiliser"],
          correct: 1,
          explanation: "L'ordre est Réduire (notre consommation), Réutiliser (les objets), puis Recycler (en dernier recours)."
        },
        {
          question: "Qu'est-ce que l'économie circulaire ?",
          options: ["Vendre en rond", "Réutiliser les ressources en boucle", "Économiser de l'argent", "Faire du vélo"],
          correct: 1,
          explanation: "L'économie circulaire vise à réutiliser les ressources en boucle pour éviter le gaspillage."
        },
        {
          question: "Quel pourcentage de plastique produit a été recyclé dans le monde ?",
          options: ["50%", "30%", "Moins de 10%", "70%"],
          correct: 2,
          explanation: "Seulement 9% du plastique produit dans le monde a été recyclé. C'est pourquoi réduire est si important !"
        }
      ] : [
        {
          question: "What is the order of the 3Rs of recycling?",
          options: ["Recycle, Reduce, Reuse", "Reduce, Reuse, Recycle", "Reuse, Recycle, Reduce", "Reduce, Recycle, Reuse"],
          correct: 1,
          explanation: "The order is Reduce (our consumption), Reuse (objects), then Recycle (as a last resort)."
        },
        {
          question: "What is the circular economy?",
          options: ["Selling in circles", "Reusing resources in a loop", "Saving money", "Riding a bike"],
          correct: 1,
          explanation: "The circular economy aims to reuse resources in a loop to avoid waste."
        },
        {
          question: "What percentage of plastic produced has been recycled worldwide?",
          options: ["50%", "30%", "Less than 10%", "70%"],
          correct: 2,
          explanation: "Only 9% of plastic produced worldwide has been recycled. That's why reducing is so important!"
        }
      ]
    }
  ];

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    
    const level = levels.find(l => l.id === currentLevel);
    if (level && index === level.questions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    const level = levels.find(l => l.id === currentLevel);
    if (!level) return;

    if (currentQuestion < level.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Level completed
      if (!completedLevels.includes(currentLevel!)) {
        setCompletedLevels(prev => [...prev, currentLevel!]);
      }
    }
  };

  const startLevel = (levelId: number) => {
    setCurrentLevel(levelId);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setShowFacts(true);
  };

  const resetLevel = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setShowFacts(true);
  };

  const backToLevels = () => {
    setCurrentLevel(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setShowFacts(true);
  };

  // Level Selection View
  if (currentLevel === null) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>{language === "fr" ? "Apprentissage Interactif" : "Interactive Learning"}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {t("guide.title")}
            </h1>
            <p className="text-lg text-muted-foreground">{t("guide.subtitle")}</p>
          </div>

          <div className="grid gap-6">
            {levels.map((level, index) => {
              const isCompleted = completedLevels.includes(level.id);
              const isLocked = index > 0 && !completedLevels.includes(levels[index - 1].id);
              
              return (
                <Card
                  key={level.id}
                  className={`scroll-reveal overflow-hidden transition-all duration-300 ${
                    isLocked 
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onClick={() => !isLocked && startLevel(level.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl ${level.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <level.icon className={`w-8 h-8 ${level.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-muted-foreground">
                            {language === "fr" ? "Niveau" : "Level"} {level.id}
                          </span>
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              {language === "fr" ? "Complété" : "Completed"}
                            </span>
                          )}
                          {isLocked && (
                            <span className="text-xs text-muted-foreground">🔒</span>
                          )}
                        </div>
                        <h3 className="font-bold text-xl mb-1">{level.title}</h3>
                        <p className="text-muted-foreground">{level.description}</p>
                      </div>
                      {!isLocked && (
                        <ArrowRight className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {completedLevels.length === levels.length && (
            <Card className="mt-8 border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-green-500/10 animate-bounce-in">
              <CardContent className="p-8 text-center">
                <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  {language === "fr" ? "🎉 Félicitations !" : "🎉 Congratulations!"}
                </h2>
                <p className="text-muted-foreground">
                  {language === "fr" 
                    ? "Vous avez complété tous les niveaux ! Vous êtes maintenant un expert du recyclage."
                    : "You've completed all levels! You are now a recycling expert."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  const level = levels.find(l => l.id === currentLevel)!;
  const isLevelComplete = currentQuestion >= level.questions.length - 1 && showResult;
  const progress = ((currentQuestion + (showResult ? 1 : 0)) / level.questions.length) * 100;

  // Facts View
  if (showFacts) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={backToLevels} className="mb-6">
            ← {language === "fr" ? "Retour aux niveaux" : "Back to levels"}
          </Button>

          <Card className="overflow-hidden animate-scale-in">
            <div className={`${level.bg} p-6`}>
              <div className="flex items-center gap-3 mb-2">
                <level.icon className={`w-8 h-8 ${level.color}`} />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "fr" ? "Niveau" : "Level"} {level.id}
                  </p>
                  <h2 className="text-2xl font-bold">{level.title}</h2>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-lg">
                  {language === "fr" ? "Le saviez-vous ?" : "Did you know?"}
                </h3>
              </div>

              <div className="space-y-4 mb-8">
                {level.facts.map((fact, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-secondary/50 rounded-lg animate-fade-in"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <p className="text-foreground">{fact}</p>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setShowFacts(false)}
              >
                {language === "fr" ? "Commencer le quiz" : "Start the quiz"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz View
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={backToLevels} className="mb-6">
          ← {language === "fr" ? "Retour aux niveaux" : "Back to levels"}
        </Button>

        <Card className="overflow-hidden">
          <div className={`${level.bg} p-4`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <level.icon className={`w-5 h-5 ${level.color}`} />
                <span className="font-medium">{level.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="font-medium">{score}/{level.questions.length}</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {language === "fr" ? "Question" : "Question"} {currentQuestion + 1}/{level.questions.length}
            </p>
          </div>

          <CardContent className="p-6">
            {!isLevelComplete ? (
              <>
                <h3 className="text-xl font-semibold mb-6">
                  {level.questions[currentQuestion].question}
                </h3>

                <div className="space-y-3 mb-6">
                  {level.questions[currentQuestion].options.map((option, index) => {
                    const isCorrect = index === level.questions[currentQuestion].correct;
                    const isSelected = selectedAnswer === index;
                    
                    let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all ";
                    
                    if (showResult) {
                      if (isCorrect) {
                        buttonClass += "border-green-500 bg-green-500/10 text-green-700";
                      } else if (isSelected && !isCorrect) {
                        buttonClass += "border-red-500 bg-red-500/10 text-red-700";
                      } else {
                        buttonClass += "border-border opacity-50";
                      }
                    } else {
                      buttonClass += "border-border hover:border-primary hover:bg-primary/5 cursor-pointer";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className={buttonClass}
                        disabled={showResult}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-medium text-sm">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {showResult && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showResult && (
                  <div className={`p-4 rounded-lg mb-4 animate-fade-in ${
                    selectedAnswer === level.questions[currentQuestion].correct
                      ? "bg-green-500/10 border border-green-500/30"
                      : "bg-amber-500/10 border border-amber-500/30"
                  }`}>
                    <p className="text-sm font-medium mb-1">
                      {selectedAnswer === level.questions[currentQuestion].correct
                        ? (language === "fr" ? "✅ Bonne réponse !" : "✅ Correct!")
                        : (language === "fr" ? "💡 Explication" : "💡 Explanation")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {level.questions[currentQuestion].explanation}
                    </p>
                  </div>
                )}

                {showResult && (
                  <Button onClick={nextQuestion} className="w-full" size="lg">
                    {currentQuestion < level.questions.length - 1
                      ? (language === "fr" ? "Question suivante" : "Next question")
                      : (language === "fr" ? "Voir les résultats" : "See results")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </>
            ) : (
              <div className="text-center py-8 animate-scale-in">
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  score >= level.questions.length * 0.7 ? "bg-green-500/20" : "bg-amber-500/20"
                }`}>
                  {score >= level.questions.length * 0.7 ? (
                    <Trophy className="w-10 h-10 text-green-600" />
                  ) : (
                    <Star className="w-10 h-10 text-amber-500" />
                  )}
                </div>
                
                <h3 className="text-2xl font-bold mb-2">
                  {score >= level.questions.length * 0.7
                    ? (language === "fr" ? "Excellent !" : "Excellent!")
                    : (language === "fr" ? "Bien joué !" : "Well done!")}
                </h3>
                
                <p className="text-lg text-muted-foreground mb-6">
                  {language === "fr" 
                    ? `Vous avez obtenu ${score}/${level.questions.length} bonnes réponses`
                    : `You got ${score}/${level.questions.length} correct answers`}
                </p>

                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={resetLevel}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {language === "fr" ? "Recommencer" : "Restart"}
                  </Button>
                  <Button onClick={backToLevels}>
                    {language === "fr" ? "Niveaux" : "Levels"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
