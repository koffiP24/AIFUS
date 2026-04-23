import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  KeyIcon,
  LockClosedIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import api from "../services/api";
import { getApiErrorMessage } from "../utils/apiError";

const requestSchema = z.object({
  identifiant: z.string().email("Adresse email invalide"),
});

const verifySchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Code a 6 chiffres"),
});

const passwordSchema = z
  .object({
    password: z.string().min(6, "Mot de passe minimum 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirmez votre mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

const stepMeta = {
  request: {
    title: "Mot de passe oublie",
    description: "Entrez votre adresse email pour recevoir un code de 6 chiffres.",
    icon: EnvelopeIcon,
  },
  code: {
    title: "Verification du code",
    description: "Saisissez le code recu par email pour continuer.",
    icon: KeyIcon,
  },
  password: {
    title: "Nouveau mot de passe",
    description: "Definissez maintenant votre nouveau mot de passe.",
    icon: LockClosedIcon,
  },
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [verifiedCode, setVerifiedCode] = useState("");

  const {
    register: registerRequest,
    handleSubmit: handleRequestSubmit,
    formState: { errors: requestErrors },
  } = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: { identifiant: "" },
  });

  const {
    register: registerVerify,
    handleSubmit: handleVerifySubmit,
    formState: { errors: verifyErrors },
  } = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const requestResetCode = async (data) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const normalizedEmail = data.identifiant.trim().toLowerCase();
      const res = await api.post("/auth/forgot-password", {
        identifiant: normalizedEmail,
      });

      setEmail(normalizedEmail);
      setVerifiedCode("");
      setStep("code");
      setMessage(res.data.message);
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de l'envoi du code."));
    } finally {
      setLoading(false);
    }
  };

  const verifyResetCode = async (data) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const code = data.code.trim();
      const res = await api.post("/auth/verify-reset-code", {
        identifiant: email,
        code,
      });

      setVerifiedCode(code);
      setStep("password");
      setMessage(
        res.data.message ||
          "Code verifie. Vous pouvez maintenant definir un nouveau mot de passe.",
      );
    } catch (err) {
      setError(getApiErrorMessage(err, "Code invalide ou expire."));
    } finally {
      setLoading(false);
    }
  };

  const submitNewPassword = async (data) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await api.post("/auth/reset-password", {
        identifiant: email,
        code: verifiedCode,
        password: data.password,
      });

      setMessage(
        "Mot de passe reinitialise avec succes. Redirection vers la connexion...",
      );
      setTimeout(
        () =>
          navigate("/login", {
            state: {
              successMessage:
                "Votre mot de passe a ete reinitialise avec succes. Connectez-vous avec votre nouveau mot de passe.",
            },
          }),
        1400,
      );
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Impossible de mettre a jour le mot de passe. Verifiez a nouveau votre code.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!email) {
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/forgot-password", {
        identifiant: email,
      });

      setVerifiedCode("");
      setStep("code");
      setMessage(res.data.message);
    } catch (err) {
      setError(getApiErrorMessage(err, "Impossible de renvoyer le code."));
    } finally {
      setLoading(false);
    }
  };

  const changeEmail = () => {
    setStep("request");
    setEmail("");
    setVerifiedCode("");
    setMessage("");
    setError("");
  };

  const goBackToCode = () => {
    setStep("code");
    setMessage("");
    setError("");
  };

  const currentStep = stepMeta[step];
  const StepIcon = currentStep.icon;

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)] dark:border-slate-700/80 dark:bg-slate-900/95">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300">
            <StepIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="mb-2 text-3xl font-bold">{currentStep.title}</h1>
            <p className="text-slate-500 dark:text-slate-400">
              {currentStep.description}
              {step !== "request" && email ? ` Adresse concernee : ${email}.` : ""}
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2">
          {["request", "code", "password"].map((item, index) => {
            const isActive = step === item;
            const isDone =
              (item === "request" && step !== "request") ||
              (item === "code" && step === "password");

            return (
              <div
                key={item}
                className={`rounded-2xl border px-3 py-3 text-center text-sm font-medium transition ${
                  isActive
                    ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/60 dark:bg-sky-900/20 dark:text-sky-200"
                    : isDone
                      ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800/60 dark:bg-green-900/20 dark:text-green-200"
                      : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400"
                }`}
              >
                Etape {index + 1}
              </div>
            );
          })}
        </div>

        {message && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-200">
            <CheckCircleIcon className="h-5 w-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        )}

        {step === "request" && (
          <form onSubmit={handleRequestSubmit(requestResetCode)} className="space-y-4">
            <div>
              <label className="label">Adresse email</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  {...registerRequest("identifiant")}
                  className="input-field w-full pl-12"
                  placeholder="votre@email.com"
                  autoComplete="email"
                />
              </div>
              {requestErrors.identifiant && (
                <p className="mt-1 text-sm text-red-500">
                  {requestErrors.identifiant.message}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              <span className="inline-flex items-center gap-2">
                <PaperAirplaneIcon className="h-5 w-5" />
                {loading ? "Envoi en cours..." : "Envoyer le code par email"}
              </span>
            </button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={handleVerifySubmit(verifyResetCode)} className="space-y-4">
            <div>
              <label className="label">Code de verification</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <KeyIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  {...registerVerify("code")}
                  className="input-field w-full pl-12 tracking-[0.35em]"
                  placeholder="123456"
                />
              </div>
              {verifyErrors.code && (
                <p className="mt-1 text-sm text-red-500">
                  {verifyErrors.code.message}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              <span className="inline-flex items-center gap-2">
                <KeyIcon className="h-5 w-5" />
                {loading ? "Verification..." : "Verifier le code"}
              </span>
            </button>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <button
                type="button"
                onClick={resendCode}
                disabled={loading}
                className="inline-flex items-center gap-2 font-medium text-primary-600 hover:underline"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Renvoyer le code
              </button>
              <button
                type="button"
                onClick={changeEmail}
                className="font-medium text-primary-600 hover:underline"
              >
                Changer d'adresse email
              </button>
            </div>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handlePasswordSubmit(submitNewPassword)} className="space-y-4">
            <div>
              <label className="label">Nouveau mot de passe</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <LockClosedIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  {...registerPassword("password")}
                  className="input-field w-full pl-12"
                  placeholder="Nouveau mot de passe"
                  autoComplete="new-password"
                />
              </div>
              {passwordErrors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {passwordErrors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">Confirmer le mot de passe</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <LockClosedIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  {...registerPassword("confirmPassword")}
                  className="input-field w-full pl-12"
                  placeholder="Confirmer le mot de passe"
                  autoComplete="new-password"
                />
              </div>
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              <span className="inline-flex items-center gap-2">
                <LockClosedIcon className="h-5 w-5" />
                {loading ? "Mise a jour..." : "Changer mon mot de passe"}
              </span>
            </button>

            <button
              type="button"
              onClick={goBackToCode}
              className="text-sm font-medium text-primary-600 hover:underline"
            >
              Revenir a la saisie du code
            </button>
          </form>
        )}

        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
          <Link to="/login" className="text-primary-600 hover:underline">
            Retour a la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
