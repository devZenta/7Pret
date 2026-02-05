import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import recipesData from "../../data/recipes.json";
import "./Catalogue.css";

const API_BASE_URL = import.meta.env.PROD
	? "https://7pret-production.up.railway.app"
	: "http://localhost:5173";

const PLACEHOLDER_IMAGE =
	"https://placehold.co/400x300/F5EBE6/CA7C5C?text=🍽️+Recette";

interface RecipeProps {
	id: number;
	name: string;
	type: string;
	cuisine: string;
	Time: number;
	image: string;
	difficulty: string;
	servings: number;
}

interface CustomRecipe {
	id: string;
	name: string;
	type: string | null;
	cuisine: string | null;
	prepTime: number | null;
	cookTime: number | null;
	image: string | null;
	difficulty: string | null;
	servings: number | null;
}

const getImageUrl = (image: string | null | undefined): string => {
	if (!image || image === "url..." || image === "") {
		return PLACEHOLDER_IMAGE;
	}
	return image;
};

const Catalogue = () => {
	const recipes: RecipeProps[] = recipesData as unknown as RecipeProps[];
	const [customRecipes, setCustomRecipes] = useState<CustomRecipe[]>([]);
	const [filterCuisine, setFilterCuisine] = useState<string>("");
	const [filterType, setFilterType] = useState<string>("");

	useEffect(() => {
		const fetchCustomRecipes = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/api/custom-recipes`, {
					credentials: "include",
				});
				if (response.ok) {
					const data = await response.json();
					setCustomRecipes(data);
				}
			} catch (error) {
				console.error(
					"Erreur lors du chargement des recettes personnalisées:",
					error,
				);
			}
		};
		fetchCustomRecipes();
	}, []);

	const uniqueCuisines = useMemo(() => {
		const cuisines = new Set<string>();
		for (const recipe of recipes) {
			if (recipe.cuisine) cuisines.add(recipe.cuisine);
		}
		for (const recipe of customRecipes) {
			if (recipe.cuisine) cuisines.add(recipe.cuisine);
		}
		return Array.from(cuisines).sort();
	}, [customRecipes]);

	const uniqueTypes = useMemo(() => {
		const types = new Set<string>();
		for (const recipe of recipes) {
			if (recipe.type) types.add(recipe.type);
		}
		for (const recipe of customRecipes) {
			if (recipe.type) types.add(recipe.type);
		}
		return Array.from(types).sort();
	}, [customRecipes]);

	const filteredRecipes = useMemo(() => {
		return recipes.filter((recipe) => {
			const matchCuisine = !filterCuisine || recipe.cuisine === filterCuisine;
			const matchType = !filterType || recipe.type === filterType;
			return matchCuisine && matchType;
		});
	}, [filterCuisine, filterType]);

	const filteredCustomRecipes = useMemo(() => {
		return customRecipes.filter((recipe) => {
			const matchCuisine = !filterCuisine || recipe.cuisine === filterCuisine;
			const matchType = !filterType || recipe.type === filterType;
			return matchCuisine && matchType;
		});
	}, [customRecipes, filterCuisine, filterType]);

	return (
		<div className="catalogue-container">
			<div className="catalogue-header">
				<h2>Catalogue de recettes</h2>
				<p>Découvrez notre sélection de délicieuses recettes</p>
			</div>

			<div className="catalogue-filters">
				<div className="catalogue-filter-group">
					<label htmlFor="filter-cuisine">Cuisine :</label>
					<select
						id="filter-cuisine"
						value={filterCuisine}
						onChange={(e) => setFilterCuisine(e.target.value)}
					>
						<option value="">Toutes les cuisines</option>
						{uniqueCuisines.map((cuisine) => (
							<option key={cuisine} value={cuisine}>
								{cuisine}
							</option>
						))}
					</select>
				</div>

				<div className="catalogue-filter-group">
					<label htmlFor="filter-type">Type :</label>
					<select
						id="filter-type"
						value={filterType}
						onChange={(e) => setFilterType(e.target.value)}
					>
						<option value="">Tous les types</option>
						{uniqueTypes.map((type) => (
							<option key={type} value={type}>
								{type.charAt(0).toUpperCase() + type.slice(1)}
							</option>
						))}
					</select>
				</div>

				{(filterCuisine || filterType) && (
					<button
						type="button"
						className="catalogue-reset-btn"
						onClick={() => {
							setFilterCuisine("");
							setFilterType("");
						}}
					>
						Réinitialiser les filtres
					</button>
				)}
			</div>

			{filteredCustomRecipes.length > 0 && (
				<section className="catalogue-section">
					<h3 className="catalogue-section-title">
						<span className="catalogue-badge">Mes créations</span>
						Mes recettes personnalisées
					</h3>
					<div className="catalogue-grid">
						{filteredCustomRecipes.map((recipe) => (
							<Link
								to={`/custom-recipe/${recipe.id}`}
								key={recipe.id}
								className="catalogue-card catalogue-card-custom"
							>
								<div className="catalogue-card-image">
									<img
										src={getImageUrl(recipe.image)}
										alt={recipe.name}
										onError={(e) => {
											e.currentTarget.src = PLACEHOLDER_IMAGE;
										}}
									/>
								</div>
								<div className="catalogue-card-content">
									<h3 className="catalogue-card-title">{recipe.name}</h3>
									<p className="catalogue-card-meta">
										{recipe.cuisine || "Non spécifié"}
										{recipe.type && ` • ${recipe.type}`}
									</p>
									<div className="catalogue-card-footer">
										<span className="catalogue-card-time">
											⏱️ {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
										</span>
										<span className="catalogue-card-servings">
											👥 {recipe.servings || "?"} pers
										</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				</section>
			)}

			<section className="catalogue-section">
				<h3 className="catalogue-section-title">Recettes proposées</h3>
				{filteredRecipes.length === 0 ? (
					<p className="catalogue-empty">
						Aucune recette ne correspond aux filtres sélectionnés.
					</p>
				) : (
					<div className="catalogue-grid">
						{filteredRecipes.map((recipe) => (
							<Link
								to={`/recipe/${recipe.id}`}
								key={recipe.id}
								className="catalogue-card"
							>
								<div className="catalogue-card-image">
									<img
										src={getImageUrl(recipe.image)}
										alt={recipe.name}
										onError={(e) => {
											e.currentTarget.src = PLACEHOLDER_IMAGE;
										}}
									/>
									<span className="catalogue-card-difficulty">
										{recipe.difficulty}
									</span>
								</div>
								<div className="catalogue-card-content">
									<h3 className="catalogue-card-title">{recipe.name}</h3>
									<p className="catalogue-card-meta">
										{recipe.cuisine}
										{recipe.type && ` • ${recipe.type}`}
									</p>
									<div className="catalogue-card-footer">
										<span className="catalogue-card-time">
											⏱️ {recipe.Time} min
										</span>
										<span className="catalogue-card-servings">
											👥 {recipe.servings} pers
										</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</section>
		</div>
	);
};

export default Catalogue;
