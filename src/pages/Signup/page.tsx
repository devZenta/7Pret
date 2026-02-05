import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { signUp } from "../../lib/auth-client";
import "./Signup.css";

const signupSchema = z
	.object({
		name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
		email: z.string().email("Email invalide"),
		password: z
			.string()
			.min(8, "Le mot de passe doit contenir au moins 8 caractères"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Les mots de passe ne correspondent pas",
		path: ["confirmPassword"],
	});

type SignupForm = z.infer<typeof signupSchema>;

type FormErrors = Partial<Record<keyof SignupForm, string>>;

const Signup = () => {
	const [form, setForm] = useState<SignupForm>({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
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

		const result = signupSchema.safeParse(form);

		if (!result.success) {
			const fieldErrors: FormErrors = {};
			for (const issue of result.error.issues) {
				const field = issue.path[0] as keyof SignupForm;
				fieldErrors[field] = issue.message;
			}
			setErrors(fieldErrors);
			return;
		}

		setIsLoading(true);

		const { error } = await signUp.email({
			name: form.name,
			email: form.email,
			password: form.password,
		});

		setIsLoading(false);

		if (error) {
			setServerError(error.message || "Erreur lors de la création du compte");
			return;
		}

		window.location.href = "/";
	};

	return (
		<div className="signup-container">
			<div className="signup-card">
				<h1>Créer un compte</h1>
				<p className="signup-subtitle">
					Rejoignez 7Pret pour planifier vos repas
				</p>

				<form onSubmit={handleSubmit} className="signup-form">
					<div className="form-group">
						<label htmlFor="name">Nom</label>
						<input
							type="text"
							id="name"
							name="name"
							value={form.name}
							onChange={handleChange}
							placeholder="Votre nom"
							autoComplete="name"
						/>
						{errors.name && (
							<span className="error-message">{errors.name}</span>
						)}
					</div>

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
							placeholder="Minimum 8 caractères"
							autoComplete="new-password"
						/>
						{errors.password && (
							<span className="error-message">{errors.password}</span>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="confirmPassword">Confirmer le mot de passe</label>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							value={form.confirmPassword}
							onChange={handleChange}
							placeholder="Confirmez votre mot de passe"
							autoComplete="new-password"
						/>
						{errors.confirmPassword && (
							<span className="error-message">{errors.confirmPassword}</span>
						)}
					</div>

					{serverError && <div className="server-error">{serverError}</div>}

					<button type="submit" className="signup-button" disabled={isLoading}>
						{isLoading ? "Création..." : "Créer mon compte"}
					</button>
				</form>

				<p className="login-link">
					Déjà un compte ? <Link to="/login">Se connecter</Link>
				</p>
			</div>
		</div>
	);
};

export default Signup;
