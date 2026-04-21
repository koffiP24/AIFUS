import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { 
  EnvelopeIcon, 
  DevicePhoneMobileIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import api from "../services/api";
import { getApiErrorMessage } from "../utils/apiError";

const schema = z.object({
  identifiant: z.string().min(1, "Email ou numéro de téléphone requis"),
});

const codeSchema = z.object({
  code: z.string().length(6, "Code à 6 chiffres"),
  newPassword: z.string().min(6, "Mot de passe minimum 6 caractères"),
});

const ForgotPassword = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("");
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { identifiant: "" },
  });

  const { register: registerCode, handleSubmit: handleCodeSubmit, formState: { errors: errorsCode } } = useForm({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "", newPassword: "" },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (method === "phone") {
        const phoneValue = data.identifiant;
        setPhone(phoneValue);
        const res = await api.post("/auth/send-sms-code", { phone: phoneValue });
        setMessage(res.data.message);
        setShowCodeForm(true);
      } else {
        const payload = { identifiant: data.identifiant };
        const res = await api.post("/auth/forgot-password", payload);
        setMessage(res.data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(getApiErrorMessage(err, "Erreur lors de la demande."));
    } finally {
      setLoading(false);
    }
  };

  const sendSmsCode = async () => {
    if (!phone) return;
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/send-sms-code", { phone });
      setMessage(res.data.message);
      setShowCodeForm(true);
    } catch (err) {
      console.error("Error:", err);
      setError(getApiErrorMessage(err, "Erreur lors de l'envoi du code."));
    } finally {
      setLoading(false);
    }
  };

  const onCodeSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/verify-sms-code", {
        phone: phone,
        code: data.code,
        newPassword: data.newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(getApiErrorMessage(err, "Code invalide ou expiré."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-2">Mot de passe oublié</h1>
        
        {!method ? (
          <>
            <p className="text-slate-500 mb-6">
              Choisissez comment récupérer votre compte.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setMethod("email")}
                className="w-full py-4 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 flex items-center gap-3 hover:border-primary-500 transition-all"
              >
                <EnvelopeIcon className="w-6 h-6 text-slate-400" />
                <div className="text-left">
                  <div className="font-medium">Par Email</div>
                  <div className="text-sm text-slate-500">Recevoir un lien de réinitialisation</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => { setMethod("phone"); setPhone(""); }}
                className="w-full py-4 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 flex items-center gap-3 hover:border-primary-500 transition-all"
              >
                <DevicePhoneMobileIcon className="w-6 h-6 text-slate-400" />
                <div className="text-left">
                  <div className="font-medium">Par SMS</div>
                  <div className="text-sm text-slate-500">Recevoir un code par téléphone</div>
                </div>
              </button>
            </div>
          </>
        ) : showCodeForm && method === "phone" ? (
          <>
            <p className="text-slate-500 mb-6">
              Entrez le code envoyé à <span className="font-medium">{phone}</span> et créez un nouveau mot de passe.
            </p>

            {message && (
              <div className="mb-4 rounded-xl bg-green-50 text-green-800 border border-green-200 p-4 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5" />
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 text-red-800 border border-red-200 p-4">
                {error}
              </div>
            )}

            <form onSubmit={handleCodeSubmit(onCodeSubmit)} className="space-y-4">
              <div>
                <label className="label">Code de vérification</label>
                <input
                  type="text"
                  {...registerCode("code")}
                  className="input-field w-full"
                  placeholder="123456"
                  maxLength={6}
                />
                {errorsCode.code && (
                  <p className="text-red-500 text-sm mt-1">{errorsCode.code.message}</p>
                )}
              </div>

              <div>
                <label className="label">Nouveau mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    {...registerCode("newPassword")}
                    className="input-field w-full pl-12"
                    placeholder="Nouveau mot de passe"
                  />
                </div>
                {errorsCode.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errorsCode.newPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3"
              >
                {loading ? "Vérification..." : "Réinitialiser mon mot de passe"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button 
                onClick={() => sendSmsCode()}
                disabled={loading}
                className="text-primary-600 hover:underline text-sm flex items-center gap-1 mx-auto"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Renvoyer le code
              </button>
            </div>

            <div className="mt-4 text-center">
              <button 
                onClick={() => { setShowCodeForm(false); setMethod(""); setMessage(""); setError(""); }}
                className="text-primary-600 hover:underline text-sm"
              >
                Choisir une autre méthode
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-slate-500 mb-6">
              {method === "email" 
                ? "Entrez votre adresse email pour recevoir un lien de réinitialisation."
                : "Entrez votre numéro de téléphone pour recevoir un code par SMS."}
            </p>

            {message && (
              <div className="mb-4 rounded-xl bg-green-50 text-green-800 border border-green-200 p-4 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5" />
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 text-red-800 border border-red-200 p-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">
                  {method === "email" ? "Adresse email" : "Numéro de téléphone"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {method === "email" ? (
                      <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                    ) : (
                      <DevicePhoneMobileIcon className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <input
                    type={method === "email" ? "email" : "tel"}
                    {...register("identifiant")}
                    className="input-field w-full pl-12"
                    placeholder={
                      method === "email" 
                        ? "votre@email.com" 
                        : "+225 07 00 00 00 00"
                    }
                  />
                </div>
                {errors.identifiant && (
                  <p className="text-red-500 text-sm mt-1">{errors.identifiant.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={method === "phone" ? "btn-secondary w-full py-3" : "btn-primary w-full py-3"}
              >
                {loading
                  ? "Envoi en cours..."
                  : method === "phone"
                  ? "Recevoir le code par SMS"
                  : "Envoyer le lien par email"}
              </button>
              {method === "phone" && (
                <button
                  type="button"
                  onClick={sendSmsCode}
                  disabled={loading || !phone}
                  className="w-full py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-primary-600 hover:bg-primary-50 transition-all"
                >
                  {loading ? "Renvoyer le code..." : "Renvoyer le code"}
                </button>
              )}
            </form>

            <div className="mt-4 text-center">
              <button 
                onClick={() => { setMethod(""); setMessage(""); setError(""); }}
                className="text-primary-600 hover:underline text-sm"
              >
                Choisir une autre méthode
              </button>
            </div>
          </>
        )}

        {(method || showCodeForm) && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Link to="/login" className="text-primary-600 hover:underline">
              Retour à la connexion
            </Link>
          </div>
        )}
        
        {!method && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 text-sm mb-2">Vous n'avez pas de compte ?</p>
            <Link to="/register" className="text-primary-600 hover:underline font-medium">
              Créer un compte
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
