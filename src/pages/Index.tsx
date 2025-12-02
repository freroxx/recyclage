import React from "react"; // Needed for JSX to work in some setups
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-lg">
        <h1 className="mb-4 text-5xl font-extrabold text-primary animate-fade-in">
          Bienvenue sur votre application !
        </h1>
        <p className="mb-6 text-lg text-muted-foreground animate-fade-in delay-200">
          Commencez à construire votre projet incroyable dès maintenant.
        </p>
        <Link
          to="/dashboard"
          className="inline-block rounded-lg bg-primary px-6 py-3 text-white font-semibold shadow hover:bg-primary/90 transition-all duration-200 animate-fade-in delay-400"
        >
          Commencer
        </Link>
      </div>
    </div>
  );
};

export default Index;
