import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ExclamationTriangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import api from "../services/api";
import { getApiErrorMessage } from "../utils/apiError";

const schema = z
  .object({
    password: z.string().min(6, "Mot de passe minimum 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirmez votre mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    if (!token) {
      setError(
        "Ce lien n'est plus utilise. Demandez plutot un code a 6 chiffres depuis la page Mot de passe oublie.",
      );
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await api.post("/auth/reset-password", {
        token,
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
      setError(getApiErrorMessage(err, "Erreur lors de la reinitialisation."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)] dark:border-slate-700/80 dark:bg-slate-900/95">
        <h1 className="mb-4 text-3xl font-bold">Reinitialiser le mot de passe</h1>

        {!token ? (
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
              <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                La reinitialisation se fait maintenant avec un code aleatoire a 6
                chiffres envoye par email.
              </p>
            </div>

            <p className="text-slate-500 dark:text-slate-400">
              Ouvrez la page dediee, saisissez votre adresse email, puis entrez
              le code recu pour definir votre nouveau mot de passe.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/forgot-password" className="btn-primary px-5 py-3">
                Aller a Mot de passe oublie
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Retour a la connexion
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              Saisissez un nouveau mot de passe pour finaliser la reinitialisation.
            </p>

            {message && (
              <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-200">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Nouveau mot de passe</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <LockClosedIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    {...register("password")}
                    className="input-field w-full pl-12"
                    placeholder="Nouveau mot de passe"
                    autoComplete="new-password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
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
                    {...register("confirmPassword")}
                    className="input-field w-full pl-12"
                    placeholder="Confirmer le mot de passe"
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3"
              >
                {loading ? "Reinitialisation..." : "Changer mon mot de passe"}
              </button>
            </form>

            <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              <Link to="/login" className="text-primary-600 hover:underline">
                Retour a la connexion
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
