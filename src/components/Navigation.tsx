import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Menu, X, Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.webp";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

    const navItems = [
    { key: "nav.home", path: "/" },
    { key: "nav.project", path: "/project" },
    { key: "nav.allAges", path: "/all-ages" },
    { key: "nav.resources", path: "/resources" },
    { key: "nav.contact", path: "/contact" },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 sm:gap-3 group focus-ring rounded-lg px-2 -mx-2">
            <img 
              src={logo} 
              alt="Recyclage Maria Logo" 
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            />
            <span className="font-bold text-base sm:text-lg text-foreground transition-colors">Recyclage Maria</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className="px-3 lg:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 focus-ring"
                activeClassName="text-primary bg-primary/10"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {t(item.key)}
              </NavLink>
            ))}
            <div className="flex items-center gap-1 ml-2 border-l border-border pl-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="gap-2 hover:bg-primary/5 focus-ring"
              >
                <Languages className="w-4 h-4" />
                <span className="hidden lg:inline">{language.toUpperCase()}</span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-1 focus-ring"
              aria-label="Toggle language"
            >
              <Languages className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="focus-ring"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 border-t border-border space-y-1">
            {navItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 focus-ring"
                activeClassName="text-primary bg-primary/10"
                onClick={() => setIsOpen(false)}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: isOpen ? 'fade-in 0.3s ease-out forwards' : 'none'
                }}
              >
                {t(item.key)}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
