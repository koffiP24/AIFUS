import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";
import GoogleSignInButton from "../components/GoogleSignInButton";
import {
  AcademicCapIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  TicketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const getPostRegisterPath = (userData) =>
  userData?.role === "ADMIN" ? "/admin" : "/dashboard";

const Register = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const [googleError, setGoogleError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { confirmPassword: _, ...data } = formData;
      const userData = await register(data);
      navigate(getPostRegisterPath(userData));
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Erreur d'inscription. Veuillez réessayer."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleError("");
    try {
      const userData = await googleLogin(credentialResponse.credential);
      navigate(getPostRegisterPath(userData));
    } catch (err) {
      setGoogleError(
        getApiErrorMessage(err, "Impossible de se connecter avec Google."),
      );
    }
  };

  const handleGoogleError = () => {
    setGoogleError("La connexion Google a échoué. Veuillez réessayer.");
  };

  const passwordStrength = () => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length >= 6) strength++;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    return strength;
  };

  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-400",
    "bg-green-500",
  ];
  const strengthLabels = [
    "Très faible",
    "Faible",
    "Moyen",
    "Fort",
    "Très fort",
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <img src="/logo.jpg" alt="AIFUS" className="w-16 h-16 object-contain rounded-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Créer un compte
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Rejoignez la communauté AIFUS 2026
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="space-y-4 mb-6 text-center">
            <div className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-3">
              Inscription simplifiée
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Créer un compte avec Google
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Un accès facile et rapide avec votre compte Google.
            </p>
            <GoogleSignInButton
              text="signup_with"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
            {googleError && (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
                {googleError}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Nom</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="input-field pl-12"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
              <div>
                <label className="label">Prénom</label>
                <input
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Votre prénom"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field pl-12"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="label">
                Téléphone <span className="text-slate-400">(optionnel)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="+225 00 00 00 00"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="input-field pl-12 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          passwordStrength() >= level
                            ? strengthColors[passwordStrength() - 1]
                            : "bg-slate-200 dark:bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Force:{" "}
                    <span
                      className={strengthColors[passwordStrength() - 1].replace(
                        "bg-",
                        "text-",
                      )}
                    >
                      {strengthLabels[passwordStrength() - 1]}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="label">Confirmer le mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-field pl-12"
                  placeholder="••••••••"
                />
              </div>
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword && (
                  <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                    <CheckCircleIcon className="w-3 h-3" /> Les mots de passe
                    correspondent
                  </p>
                )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
              />
              <label className="text-sm text-slate-600 dark:text-slate-400">
                J'accepte les{" "}
                <Link
                  to="/conditions"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link
                  to="/confidentialite"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  politique de confidentialité
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  Création du compte...
                </span>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
            <AcademicCapIcon className="mx-auto mb-1 h-7 w-7 text-primary-600" />
            <p className="text-xs text-slate-500">Réseau alumni</p>
          </div>
          <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
            <TicketIcon className="mx-auto mb-1 h-7 w-7 text-amber-600" />
            <p className="text-xs text-slate-500">Accès aux événements</p>
          </div>
          <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
            <UserGroupIcon className="mx-auto mb-1 h-7 w-7 text-emerald-600" />
            <p className="text-xs text-slate-500">Coopération</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
