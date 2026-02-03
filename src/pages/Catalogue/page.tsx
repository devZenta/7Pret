import React from "react";
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
}

const Catalogue = () => {
	const recipes: RecipeProps[] = recipesData as unknown as RecipeProps[];

	return (
		<div>
			<h2>Bievenue sur le Catalogue</h2>
			<p>Voici la liste de nos recettes :</p>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr",
					gap: "20px",
				}}
			>
				{recipes.map((recipe) => (
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
							Temps: {recipe.Time} min ........ Pers: {recipe.servings}
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

export default Catalogue;
