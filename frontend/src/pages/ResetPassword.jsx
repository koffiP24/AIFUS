import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../services/api";
import { getApiErrorMessage } from "../utils/apiError";

const schema = z
  .object({
    password: z.string().min(6, "Mot de passe minimum 6 caractères"),
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

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    if (!token) {
      setError("Le token de réinitialisation est manquant.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/reset-password", {
        token,
        password: data.password,
      });
      setMessage(res.data.message || "Votre mot de passe a été réinitialisé.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(getApiErrorMessage(err, "Erreur lors de la réinitialisation."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-4">
          Réinitialiser le mot de passe
        </h1>
        <p className="text-slate-500 mb-6">
          Saisissez un nouveau mot de passe pour votre compte.
        </p>

        {message && (
          <div className="mb-4 rounded-xl bg-green-50 text-green-800 border border-green-200 p-4">
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
            <label className="label">Nouveau mot de passe</label>
            <input
              type="password"
              {...register("password")}
              className="input-field w-full"
              placeholder="Nouveau mot de passe"
            />
          </div>

          <div>
            <label className="label">Confirmer le mot de passe</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="input-field w-full"
              placeholder="Confirmer le mot de passe"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? "Réinitialisation..." : "Changer mon mot de passe"}
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-500">
          <Link to="/login" className="text-primary-600 hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
