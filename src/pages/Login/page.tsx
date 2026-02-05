import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { signIn } from "../../lib/auth-client";
import "./Login.css";

const loginSchema = z.object({
	email: z.string().email("Email invalide"),
	password: z
		.string()
		.min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginForm = z.infer<typeof loginSchema>;

type FormErrors = Partial<Record<keyof LoginForm, string>>;

const Login = () => {
	const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
	const [errors, setErrors] = useState<FormErrors>({});
	const [serverError, setServerError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
		setServerError(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setServerError(null);

		const result = loginSchema.safeParse(form);

		if (!result.success) {
			const fieldErrors: FormErrors = {};
			for (const issue of result.error.issues) {
				const field = issue.path[0] as keyof LoginForm;
				fieldErrors[field] = issue.message;
			}
			setErrors(fieldErrors);
			return;
		}

		setIsLoading(true);

		const { error } = await signIn.email({
			email: form.email,
			password: form.password,
		});

		setIsLoading(false);

		if (error) {
			setServerError(error.message || "Erreur de connexion");
			return;
		}

		window.location.href = "/";
	};

	return (
		<div className="login-container">
			<div className="login-card">
				<h1>Connexion</h1>
				<p className="login-subtitle">
					Connectez-vous pour acceder a votre compte
				</p>

				<form onSubmit={handleSubmit} className="login-form">
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							placeholder="votre@email.com"
							autoComplete="email"
						/>
						{errors.email && (
							<span className="error-message">{errors.email}</span>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="password">Mot de passe</label>
						<input
							type="password"
							id="password"
							name="password"
							value={form.password}
							onChange={handleChange}
							placeholder="Votre mot de passe"
							autoComplete="current-password"
						/>
						{errors.password && (
							<span className="error-message">{errors.password}</span>
						)}
					</div>

					{serverError && <div className="server-error">{serverError}</div>}

					<button type="submit" className="login-button" disabled={isLoading}>
						{isLoading ? "Connexion..." : "Se connecter"}
					</button>
				</form>

				<p className="signup-link">
					Pas encore de compte ? <Link to="/signup">S'inscrire</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
