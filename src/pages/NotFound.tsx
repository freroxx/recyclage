import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      `🚨 404 Error: User attempted to access non-existent route: ${location.pathname}`
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="text-center max-w-md">
        <h1
          className="mb-4 text-6xl font-extrabold text-red-600 animate-pulse"
          role="alert"
          aria-label="404 Error"
        >
          404
        </h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Oops! La page que vous cherchez n'existe pas.
        </p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-primary px-6 py-3 text-white font-semibold shadow hover:bg-primary/90 transition-colors duration-200"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
