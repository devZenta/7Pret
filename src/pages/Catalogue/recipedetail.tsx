import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import recipesData from "../../data/recipes.json";
import "./recipedetail.css";

const API_BASE_URL = import.meta.env.PROD
	? "https://7pret-production.up.railway.app"
	: "http://localhost:5173";

interface Ingredient {
	name: string;
	quantity: string | number;
	unit: string;
}

interface Recipe {
	id: number | string;
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

interface RecipeDetailComponentProps {
	isCustom?: boolean;
}

const RecipeDetail = ({ isCustom = false }: RecipeDetailComponentProps) => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [editedRecipe, setEditedRecipe] = useState<Recipe | null>(null);
	const [saving, setSaving] = useState(false);

	const handleAddToShoppingList = () => {
		if (!recipe) return;
		const currentPanier = JSON.parse(localStorage.getItem("panier") || "[]");

		if (recipe.ingredients) {
			const recipeGroup = {
				recipeId: recipe.id,
				recipeName: recipe.name,
				originalServings: recipe.servings || 1,
				currentServings: recipe.servings || 1,
				ingredients: recipe.ingredients,
			};
			currentPanier.push(recipeGroup);
		}

		localStorage.setItem("panier", JSON.stringify(currentPanier));
		navigate("/ShoppingList");
	};

	const handleEdit = () => {
		setEditedRecipe(recipe);
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		setEditedRecipe(null);
		setIsEditing(false);
	};

	const handleSave = async () => {
		if (!editedRecipe) return;
		setSaving(true);
		try {
			const response = await fetch(`${API_BASE_URL}/api/custom-recipes/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					name: editedRecipe.name,
					cuisine: editedRecipe.cuisine,
					difficulty: editedRecipe.difficulty,
					prepTime: editedRecipe.prepTime,
					cookTime: editedRecipe.cookTime,
					servings: editedRecipe.servings,
					image: editedRecipe.image,
					ingredients: editedRecipe.ingredients,
					steps: editedRecipe.steps,
				}),
			});
			if (response.ok) {
				const updated = await response.json();
				setRecipe(updated);
				setIsEditing(false);
				setEditedRecipe(null);
			} else {
				setError("Erreur lors de la sauvegarde.");
			}
		} catch (err) {
			console.error(err);
			setError("Erreur de connexion.");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!confirm("Supprimer cette recette ?")) return;
		try {
			const response = await fetch(`${API_BASE_URL}/api/custom-recipes/${id}`, {
				method: "DELETE",
				credentials: "include",
			});
			if (response.ok) {
				navigate("/Catalogue");
			} else {
				setError("Erreur lors de la suppression.");
			}
		} catch (err) {
			console.error(err);
			setError("Erreur de connexion.");
		}
	};

	useEffect(() => {
		const fetchRecipe = async () => {
			setLoading(true);
			try {
				if (isCustom) {
					const response = await fetch(
						`${API_BASE_URL}/api/custom-recipes/${id}`,
						{ credentials: "include" },
					);
					if (response.ok) {
						const data = await response.json();
						setRecipe(data);
					} else {
						setError("Recette personnalisée introuvable.");
					}
				} else {
					const recipes = (
						Array.isArray(recipesData)
							? recipesData
							: (recipesData as { recipes: Recipe[] }).recipes
					) as Recipe[];

					if (!recipes) {
						setError("Impossible de charger les données des recettes.");
						return;
					}

					const found = recipes.find((r) => r.id === Number(id));
					setRecipe(found || null);
				}
			} catch (err) {
				console.error(err);
				setError("Une erreur est survenue lors du chargement.");
			} finally {
				setLoading(false);
			}
		};

		fetchRecipe();
	}, [id, isCustom]);

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

			<div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
				<button
					type="button"
					onClick={handleAddToShoppingList}
					style={{ fontSize: "0.6rem" }}
				>
					<h3>Ajouter les ingrédients au panier</h3>
				</button>

				{isCustom && !isEditing && (
					<>
						<button
							type="button"
							onClick={handleEdit}
							style={{
								background: "#4caf50",
								color: "white",
								padding: "8px 16px",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
							}}
						>
							Modifier
						</button>
						<button
							type="button"
							onClick={handleDelete}
							style={{
								background: "#f44336",
								color: "white",
								padding: "8px 16px",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
							}}
						>
							Supprimer
						</button>
					</>
				)}
			</div>

			<h1 className="recipe-header-title">
				{isEditing ? "Modifier la recette" : "Détails de la recette"}
			</h1>

			{isEditing && editedRecipe ? (
				<div
					className="edit-form"
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "15px",
						maxWidth: "600px",
					}}
				>
					<label>
						Nom:
						<input
							type="text"
							value={editedRecipe.name}
							onChange={(e) =>
								setEditedRecipe({ ...editedRecipe, name: e.target.value })
							}
							style={{ width: "100%", padding: "8px", marginTop: "4px" }}
						/>
					</label>
					<label>
						Cuisine:
						<input
							type="text"
							value={editedRecipe.cuisine || ""}
							onChange={(e) =>
								setEditedRecipe({ ...editedRecipe, cuisine: e.target.value })
							}
							style={{ width: "100%", padding: "8px", marginTop: "4px" }}
						/>
					</label>
					<label>
						Difficulté:
						<input
							type="text"
							value={editedRecipe.difficulty || ""}
							onChange={(e) =>
								setEditedRecipe({ ...editedRecipe, difficulty: e.target.value })
							}
							style={{ width: "100%", padding: "8px", marginTop: "4px" }}
						/>
					</label>
					<div style={{ display: "flex", gap: "10px" }}>
						<label style={{ flex: 1 }}>
							Préparation (min):
							<input
								type="number"
								min="0"
								value={editedRecipe.prepTime || 0}
								onChange={(e) =>
									setEditedRecipe({
										...editedRecipe,
										prepTime: Number(e.target.value),
									})
								}
								style={{ width: "100%", padding: "8px", marginTop: "4px" }}
							/>
						</label>
						<label style={{ flex: 1 }}>
							Cuisson (min):
							<input
								type="number"
								min="0"
								value={editedRecipe.cookTime || 0}
								onChange={(e) =>
									setEditedRecipe({
										...editedRecipe,
										cookTime: Number(e.target.value),
									})
								}
								style={{ width: "100%", padding: "8px", marginTop: "4px" }}
							/>
						</label>
						<label style={{ flex: 1 }}>
							Portions:
							<input
								type="number"
								min="0"
								value={editedRecipe.servings || 0}
								onChange={(e) =>
									setEditedRecipe({
										...editedRecipe,
										servings: Number(e.target.value),
									})
								}
								style={{ width: "100%", padding: "8px", marginTop: "4px" }}
							/>
						</label>
					</div>
					<label>
						URL Image:
						<input
							type="text"
							value={editedRecipe.image || ""}
							onChange={(e) =>
								setEditedRecipe({ ...editedRecipe, image: e.target.value })
							}
							style={{ width: "100%", padding: "8px", marginTop: "4px" }}
						/>
					</label>
					<div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
						<button
							type="button"
							onClick={handleSave}
							disabled={saving}
							style={{
								background: "#4caf50",
								color: "white",
								padding: "10px 20px",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
							}}
						>
							{saving ? "Enregistrement..." : "Enregistrer"}
						</button>
						<button
							type="button"
							onClick={handleCancelEdit}
							style={{
								background: "#9e9e9e",
								color: "white",
								padding: "10px 20px",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
							}}
						>
							Annuler
						</button>
					</div>
				</div>
			) : (
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
								steps.map((step) => (
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
			)}
		</div>
	);
};

export default RecipeDetail;
