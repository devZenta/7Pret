import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import recipesData from "../../data/recipes.json";

const API_BASE_URL = import.meta.env.PROD
	? "https://7pret-production.up.railway.app"
	: "http://localhost:5173";

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
		<div>
			<h2>Bienvenue sur le Catalogue</h2>
			<p>Voici la liste de nos recettes :</p>

			<div
				style={{
					display: "flex",
					gap: "20px",
					marginBottom: "20px",
					flexWrap: "wrap",
					alignItems: "center",
				}}
			>
				<div>
					<label htmlFor="filter-cuisine" style={{ marginRight: "8px" }}>
						Cuisine :
					</label>
					<select
						id="filter-cuisine"
						value={filterCuisine}
						onChange={(e) => setFilterCuisine(e.target.value)}
						style={{
							padding: "8px 12px",
							borderRadius: "4px",
							border: "1px solid #ccc",
							minWidth: "150px",
						}}
					>
						<option value="">Toutes les cuisines</option>
						{uniqueCuisines.map((cuisine) => (
							<option key={cuisine} value={cuisine}>
								{cuisine}
							</option>
						))}
					</select>
				</div>

				<div>
					<label htmlFor="filter-type" style={{ marginRight: "8px" }}>
						Type :
					</label>
					<select
						id="filter-type"
						value={filterType}
						onChange={(e) => setFilterType(e.target.value)}
						style={{
							padding: "8px 12px",
							borderRadius: "4px",
							border: "1px solid #ccc",
							minWidth: "150px",
						}}
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
						onClick={() => {
							setFilterCuisine("");
							setFilterType("");
						}}
						style={{
							padding: "8px 16px",
							borderRadius: "4px",
							border: "none",
							background: "#c67a53",
							color: "white",
							cursor: "pointer",
						}}
					>
						Réinitialiser les filtres
					</button>
				)}
			</div>

			{filteredCustomRecipes.length > 0 && (
				<>
					<h3>Mes recettes personnalisées</h3>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
							gap: "20px",
							marginBottom: "30px",
						}}
					>
						{filteredCustomRecipes.map((recipe) => (
							<Link
								to={`/custom-recipe/${recipe.id}`}
								key={recipe.id}
								style={{
									border: "2px solid #4caf50",
									padding: "10px",
									borderRadius: "8px",
									textDecoration: "none",
									background: "#f9fff9",
								}}
							>
								<h3>{recipe.name}</h3>
								<p>
									{recipe.cuisine || "Non spécifié"}
									{recipe.type && ` - ${recipe.type}`}
								</p>
								<p>
									{(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Pers: {recipe.servings || "?"}
								</p>
								{recipe.image && (
									<img
										src={recipe.image}
										alt={recipe.name}
										style={{ maxWidth: "100%" }}
									/>
								)}
							</Link>
						))}
					</div>
				</>
			)}

			<h3>Recettes proposées</h3>
			{filteredRecipes.length === 0 ? (
				<p style={{ fontStyle: "italic", color: "#888" }}>
					Aucune recette ne correspond aux filtres sélectionnés.
				</p>
			) : (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
						gap: "20px",
					}}
				>
					{filteredRecipes.map((recipe) => (
						<Link
							to={`/recipe/${recipe.id}`}
							key={recipe.id}
							style={{
								border: "1px solid #ccc",
								padding: "10px",
								borderRadius: "8px",
								textDecoration: "none",
							}}
						>
							<h3>{recipe.name}</h3>
							<p>
								{recipe.cuisine}
								{recipe.type && ` - ${recipe.type}`}
							</p>
							<p>
								{recipe.Time} min
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Pers: {recipe.servings}
							</p>
							<img
								src={recipe.image}
								alt={`Difficulté: ${recipe.difficulty}`}
								style={{ maxWidth: "100%" }}
							/>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default Catalogue;
