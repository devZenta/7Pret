import { Link } from "react-router-dom";
import recipesData from "../../data/recipes.json";
import "./CertifRecipe.css";

const PLACEHOLDER_IMAGE =
	"https://placehold.co/400x300/F5EBE6/CA7C5C?text=🍽️+Recette";

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

const getImageUrl = (image: string | null | undefined): string => {
	if (!image || image === "url..." || image === "") {
		return PLACEHOLDER_IMAGE;
	}
	return image;
};

const CertifRecipe = () => {
	const recipes: RecipeProps[] = recipesData as unknown as RecipeProps[];
	const certifiedRecipes = recipes.filter((recipe) => recipe.rating >= 4.8);

	return (
		<div className="certif-container">
			<div className="certif-header">
				<span className="certif-badge">⭐ Recettes Certifiées</span>
				<h2>Nos meilleures recettes</h2>
				<p>
					Découvrez notre sélection de recettes les mieux notées (4.8+ étoiles)
				</p>
			</div>

			{certifiedRecipes.length === 0 ? (
				<p className="certif-empty">Aucune recette certifiée pour le moment.</p>
			) : (
				<div className="certif-grid">
					{certifiedRecipes.map((recipe) => (
						<Link
							to={`/recipe/${recipe.id}`}
							key={recipe.id}
							className="certif-card"
						>
							<div className="certif-card-image">
								<img
									src={getImageUrl(recipe.image)}
									alt={recipe.name}
									onError={(e) => {
										e.currentTarget.src = PLACEHOLDER_IMAGE;
									}}
								/>
								<span className="certif-card-difficulty">
									{recipe.difficulty}
								</span>
								<span className="certif-card-rating">⭐ {recipe.rating}</span>
							</div>
							<div className="certif-card-content">
								<h3 className="certif-card-title">{recipe.name}</h3>
								<p className="certif-card-meta">{recipe.cuisine}</p>
								<div className="certif-card-footer">
									<span className="certif-card-time">⏱️ {recipe.Time} min</span>
									<span className="certif-card-servings">
										👥 {recipe.servings} pers
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default CertifRecipe;
