import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import recipesData from "../../data/recipes.json";
import "./recipedetail.css";

interface Ingredient {
	name: string;
	quantity: string | number;
	unit: string;
}

interface RecipeDetailProps {
	id: number;
	name: string;
	type?: string;
	cuisine?: string;
	difficulty?: string;
	prepTime?: number;
	cookTime?: number;
	servings?: number;
	image?: string;
	ingredients?: Ingredient[];
	steps?: string[] | string;
	rating?: number;
}

const RecipeDetail = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [recipe, setRecipe] = useState<RecipeDetailProps | null>(null);
	const [error, setError] = useState<string>("");

	const handleAddToShoppingList = () => {
		if (!recipe) return;
		const currentPanier = JSON.parse(localStorage.getItem("panier") || "[]");

		if (recipe.ingredients) {
			currentPanier.push(...recipe.ingredients);
		}

		localStorage.setItem("panier", JSON.stringify(currentPanier));
		navigate("/ShoppingList");
	};

	useEffect(() => {
		try {
			const recipes = (
				Array.isArray(recipesData)
					? recipesData
					: (recipesData as { recipes: RecipeDetailProps[] }).recipes
			) as RecipeDetailProps[];

			if (!recipes) {
				setError("Impossible de charger les données des recettes.");
				return;
			}

			const found = recipes.find((r) => r.id === Number(id));
			setRecipe(found || null);
		} catch (err) {
			console.error(err);
			setError("Une erreur est survenue lors du chargement.");
		}
	}, [id]);

	if (error) return <div className="error-message">{error}</div>;
	if (!recipe)
		return (
			<div className="loading-message">
				Recette introuvable ou chargement...
			</div>
		);

	const ingredients = recipe.ingredients || [];
	const steps = recipe.steps || [];

	return (
		<div className="recipe-container">
			<a href="/Catalogue" className="back-link">
				← Retour au catalogue
			</a>

			<button
				type="button"
				onClick={handleAddToShoppingList}
				style={{ fontSize: "0.6rem" }}
			>
				<h3>Ajouter les ingrédients au panier</h3>
			</button>

			<h1 className="recipe-header-title">Détails de la recette</h1>

			<div className="recipe-content">
				<div>
					<img
						src={recipe.image || "https://placehold.co/600x400?text=No+Image"}
						alt={recipe.name}
						className="recipe-image"
					/>
				</div>
				<div>
					<h2 className="recipe-subtitle">{recipe.name}</h2>
					<div className="tags-wrapper">
						<span className="tag tag-cuisine">
							{recipe.cuisine || "Non classé"}
						</span>
						<span className="tag tag-difficulty">
							{recipe.difficulty || "-"}
						</span>
						{recipe.rating && (
							<span className="tag tag-rating">★ {recipe.rating}</span>
						)}
					</div>

					<div className="stats-grid">
						<div className="stat-box">
							<p className="stat-label">Préparation</p>
							<p className="stat-value">{recipe.prepTime || 0} min</p>
						</div>
						<div className="stat-box">
							<p className="stat-label">Cuisson</p>
							<p className="stat-value">{recipe.cookTime || 0} min</p>
						</div>
						<div className="stat-box">
							<p className="stat-label">Portions</p>
							<p className="stat-value">{recipe.servings || 0}</p>
						</div>
					</div>

					<h3 className="section-title">Ingrédients</h3>
					<ul className="ingredient-list">
						{ingredients.length > 0 ? (
							ingredients.map((ingredient, index) => (
								<li key={`${ingredient.name}-${index}`} className="list-item">
									{ingredient.name} : {ingredient.quantity} {ingredient.unit}
								</li>
							))
						) : (
							<li className="empty-text">Aucun ingrédient listé.</li>
						)}
					</ul>

					<h3 className="section-title">Instructions</h3>
					<ul className="instruction-list">
						{Array.isArray(steps) && steps.length > 0 ? (
							steps.map((step, index) => (
								<li key={step} className="list-item">
									{step}
								</li>
							))
						) : typeof steps === "string" ? (
							<li className="list-item">{steps}</li>
						) : (
							<li className="empty-text">Aucune instruction disponible.</li>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default RecipeDetail;
