import { Link } from "react-router-dom";
import recipesData from "../../data/recipes.json";

interface RecipeProps {
	id: number;
	name: string;
	cuisine: string;
	Time: number;
	image: string;
	difficulty: string;
	servings: number;
	rating: number;
}

const CertifRecipe = () => {
	const recipes: RecipeProps[] = recipesData as unknown as RecipeProps[];
	const certifiedRecipes = recipes.filter((recipe) => recipe.rating >= 4.8);

	return (
		<div>
			<h2>Bievenue sur le Catalogue</h2>
			<p>Voici la liste de nos recettes Certifié :</p>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr",
					gap: "20px",
				}}
			>
				{certifiedRecipes.map((recipe) => (
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
						<p>{recipe.cuisine}</p>
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
		</div>
	);
};

export default CertifRecipe;
