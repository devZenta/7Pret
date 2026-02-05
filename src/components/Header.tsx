import type React from "react";
import UserIcon from "../assets/user-icon.svg";
import "./Header.css";

interface HeaderProps {
	logoUrl: string;
}

const Header: React.FC<HeaderProps> = ({ logoUrl = "./public/logo.png" }) => {
	return (
		<header className="header">
			<div className="logo">
				<img src={logoUrl} alt="Logo" />
			</div>
			<nav className="navigation">
				<ul>
					<li>
						<a href="/">Accueil</a>
					</li>
					<li>
						<a href="/Planning">Planning</a>
					</li>
					<li>
						<a href="/ShoppingList">Panier</a>
					</li>
					<li>
						<a href="/CertifRecipe">Recette Certifié</a>
					</li>
					<li>
						<a href="/Catalogue">Catalogue</a>
					</li>
					<li>
						<a href="/CreateRecipe">Creer une Recette+</a>
					</li>
					<li>
						<a href="/settings" className="user-link">
							<img
								src={UserIcon}
								alt="Mon compte"
								className="user-icon"
								style={{ width: "22px", height: "22px" }}
							/>
						</a>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
