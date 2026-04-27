import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";
import GoogleSignInButton from "../components/GoogleSignInButton";
import {
  CheckCircleIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const getPostLoginPath = (userData) =>
  userData?.role === "ADMIN" ? "/admin" : "/dashboard";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { user, login, googleLogin, loading: authLoading } = useAuth();
  const [googleError, setGoogleError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authLoading && user) {
      navigate(getPostLoginPath(user), { replace: true });
    }
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (!location.state?.successMessage) {
      return;
    }

    setSuccessMessage(location.state.successMessage);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const userData = await login(email, password, { remember: rememberMe });
      navigate(getPostLoginPath(userData));
    } catch (err) {
       const apiMessage = getApiErrorMessage(
         err,
         "Erreur de connexion. Veuillez vérifier vos identifiants.",
       );

       if (apiMessage.toLowerCase().includes("mot de passe incorrect")) {
         setError(
           "Mot de passe incorrect. Vérifiez votre saisie puis réessayez.",
         );
      } else {
        setError(apiMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleError("");

    try {
      const userData = await googleLogin(credentialResponse.credential, {
        remember: rememberMe,
      });
      navigate(getPostLoginPath(userData));
    } catch (err) {
      setGoogleError(
        getApiErrorMessage(err, "Impossible de se connecter avec Google."),
      );
    }
  };

  const handleGoogleError = () => {
    setGoogleError("La connexion Google a échoué. Veuillez réessayer.");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center mb-4">
            <img
              src="/logo.jpg"
              alt="AIFUS"
              className="h-16 w-16 rounded-2xl object-contain"
            />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-slate-800 dark:text-white">
            Bienvenue
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Connectez-vous a votre compte AIFUS
          </p>
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
            Participant : espace membre. Admin : dashboard d'administration.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-800">
          {successMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">Réinitialisation réussie</p>
                  <p className="text-sm">{successMessage}</p>
                </div>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Connexion impossible</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="mb-6 space-y-4">
            <div className="text-center">
              <div className="mb-3 text-sm uppercase tracking-[0.3em] text-slate-500">
                Connexion rapide
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Se connecter avec Google
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Utilisez votre compte Google pour un accès instantané.
              </p>
            </div>

            <GoogleSignInButton
              text="signin_with"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

            {googleError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                {googleError}
              </div>
            )}
          </div>

          <div className="relative mb-4 text-center text-slate-400">
            <span className="relative z-10 bg-white px-4 dark:bg-slate-800">
              Ou avec email
            </span>
            <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200 dark:bg-slate-700"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field pl-12"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <LockClosedIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pl-12 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Se souvenir de moi
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Mot de passe oublie ?
              </Link>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Laissez cette option décochée pour utiliser des comptes différents
              dans plusieurs onglets.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
               <p className="text-slate-600 dark:text-slate-400">
                 Pas encore de compte ?{" "}
                 <Link
                   to="/register"
                   className="font-semibold text-primary-600 hover:text-primary-700"
                 >
                   Créer un compte
                 </Link>
               </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Festivités AIFUS 2026 • 65 ans d'excellence
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
