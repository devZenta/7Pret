import { useNavigate } from "react-router-dom";
import UserIcon from "../../assets/user-icon.svg";
import { signOut, useSession } from "../../lib/auth-client";
import "./Settings.css";

const Settings = () => {
	const navigate = useNavigate();
	const { data: session, isPending } = useSession();

	const handleSignOut = async () => {
		await signOut();
		navigate("/login");
	};

	if (isPending) {
		return (
			<div className="settings-container">
				<div className="settings-card">
					<p className="loading">Chargement...</p>
				</div>
			</div>
		);
	}

	if (!session) {
		return (
			<div className="settings-container">
				<div className="settings-card">
					<img src={UserIcon} alt="User" className="user-icon" />
					<h1>Non connecte</h1>
					<p className="settings-subtitle">
						Connectez-vous pour acceder a vos parametres
					</p>
					<button
						type="button"
						className="primary-button"
						onClick={() => navigate("/login")}
					>
						Se connecter
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="settings-container">
			<div className="settings-card">
				<img src={UserIcon} alt="User" className="user-icon" />
				<h1>Mon compte</h1>

				<div className="user-info">
					<div className="info-row">
						<span className="info-label">Nom</span>
						<span className="info-value">{session.user.name}</span>
					</div>
					<div className="info-row">
						<span className="info-label">Email</span>
						<span className="info-value">{session.user.email}</span>
					</div>
					<div className="info-row">
						<span className="info-label">Membre depuis</span>
						<span className="info-value">
							{new Date(session.user.createdAt).toLocaleDateString("fr-FR", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</span>
					</div>
				</div>

				<button
					type="button"
					className="signout-button"
					onClick={handleSignOut}
				>
					Se deconnecter
				</button>
			</div>
		</div>
	);
};

export default Settings;
