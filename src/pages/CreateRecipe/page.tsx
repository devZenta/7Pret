import { useState } from "react";
import "./CreateRecipe.css";

const API_BASE_URL = import.meta.env.PROD
	? "https://7pret-production.up.railway.app"
	: "http://localhost:5173";

const CreateRecipe = () => {
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [cuisine, setCuisine] = useState("");
	const [difficulty, setDifficulty] = useState("");
	const [prepTime, setPreptime] = useState(0);
	const [cookTime, setCookTime] = useState(0);
	const [servings, setServings] = useState(0);
	const [image, setImage] = useState("");

	const [ingredients, setIngredients] = useState([
		{ id: crypto.randomUUID(), name: "", quantity: 0, unit: "" },
	]);
	const [steps, setSteps] = useState([{ id: crypto.randomUUID(), text: "" }]);

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const updateIngredient = (
		index: number,
		field: string,
		value: string | number,
	) => {
		const newIngredients = [...ingredients];
		// @ts-expect-error - On sait que le champ existe
		newIngredients[index][field] = value;
		setIngredients(newIngredients);
	};

	const addIngredient = () => {
		setIngredients([
			...ingredients,
			{ id: crypto.randomUUID(), name: "", quantity: 0, unit: "" },
		]);
	};

	const removeIngredient = (index: number) => {
		setIngredients(ingredients.filter((_, i) => i !== index));
	};

	const updateStep = (id: string, value: string) => {
		const newSteps = steps.map((step) =>
			step.id === id ? { ...step, text: value } : step,
		);
		setSteps(newSteps);
	};

	const addStep = () => {
		setSteps([...steps, { id: crypto.randomUUID(), text: "" }]);
	};

	const removeStep = (id: string) => {
		setSteps(steps.filter((step) => step.id !== id));
	};

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");

		try {
			const response = await fetch(`${API_BASE_URL}/api/custom-recipes`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					name: name,
					type: type,
					cuisine: cuisine,
					difficulty: difficulty,
					prepTime: Number(prepTime),
					cookTime: Number(cookTime),
					servings: Number(servings),
					image: image,
					ingredients: ingredients.filter((i) => i.name.trim() !== ""),
					steps: steps.filter((s) => s.text.trim() !== "").map((s) => s.text),
				}),
			});

			if (response.ok) {
				setMessage("✅ Recette créée avec succès !");
				setName("");
				setType("");
				setCuisine("");
				setDifficulty("");
				setPreptime(0);
				setCookTime(0);
				setServings(0);
				setImage("");
				setIngredients([
					{ id: crypto.randomUUID(), name: "", quantity: 0, unit: "" },
				]);
				setSteps([{ id: crypto.randomUUID(), text: "" }]);
			} else {
				const errorData = await response.json();
				console.error("Erreur API:", errorData);
				setMessage(
					"❌ Erreur : " +
						(errorData.message || "Non autorisé ou données invalides"),
				);
			}
		} catch (error) {
			console.error(error);
			setMessage("❌ Erreur de connexion au serveur.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="create-recipe-form">
			<h2 className="create-recipe-title">Créer une recette personnalisée</h2>

			<div className="create-recipe-section">
				<h3 className="create-recipe-section-title">Informations générales</h3>
				<input
					className="create-recipe-input"
					type="text"
					placeholder="Nom de la recette *"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
				<input
					className="create-recipe-input"
					type="text"
					placeholder="Type (ex: Plat, Entrée)"
					value={type}
					onChange={(e) => setType(e.target.value)}
				/>
				<input
					className="create-recipe-input"
					type="text"
					placeholder="Cuisine (ex: Italienne)"
					value={cuisine}
					onChange={(e) => setCuisine(e.target.value)}
				/>
				<input
					className="create-recipe-input"
					type="text"
					placeholder="Difficulté"
					value={difficulty}
					onChange={(e) => setDifficulty(e.target.value)}
				/>
				<input
					className="create-recipe-input"
					type="text"
					placeholder="URL de l'image"
					value={image}
					onChange={(e) => setImage(e.target.value)}
				/>
			</div>

			<div className="create-recipe-section">
				<h3 className="create-recipe-section-title">Détails</h3>
				<label className="create-recipe-label">
					Temps prépa (min):
					<input
						className="create-recipe-input"
						type="number"
						min="0"
						value={prepTime}
						onChange={(e) => setPreptime(Number(e.target.value))}
					/>
				</label>
				<label className="create-recipe-label">
					Temps cuisson (min):
					<input
						className="create-recipe-input"
						type="number"
						min="0"
						value={cookTime}
						onChange={(e) => setCookTime(Number(e.target.value))}
					/>
				</label>
				<label className="create-recipe-label">
					Portions:
					<input
						className="create-recipe-input"
						type="number"
						min="0"
						value={servings}
						onChange={(e) => setServings(Number(e.target.value))}
					/>
				</label>
			</div>

			<div className="create-recipe-section">
				<h3 className="create-recipe-section-title">Ingrédients</h3>
				{ingredients.map((ing, index) => (
					<div key={ing.id} className="create-recipe-row">
						<input
							className="create-recipe-input create-recipe-input-name"
							placeholder="Nom"
							value={ing.name}
							onChange={(e) => updateIngredient(index, "name", e.target.value)}
						/>
						<input
							className="create-recipe-input create-recipe-input-qty"
							type="number"
							min="0"
							placeholder="Qté"
							value={ing.quantity}
							onChange={(e) =>
								updateIngredient(index, "quantity", Number(e.target.value))
							}
						/>
						<input
							className="create-recipe-input create-recipe-input-unit"
							placeholder="Unité"
							value={ing.unit}
							onChange={(e) => updateIngredient(index, "unit", e.target.value)}
						/>
						{ingredients.length > 1 && (
							<button
								type="button"
								onClick={() => removeIngredient(index)}
								className="create-recipe-button create-recipe-button-danger"
							>
								X
							</button>
						)}
					</div>
				))}
				<button
					type="button"
					onClick={addIngredient}
					className="create-recipe-button create-recipe-button-secondary"
				>
					+ Ajouter un ingrédient
				</button>
			</div>

			<div className="create-recipe-section">
				<h3 className="create-recipe-section-title">Étapes</h3>
				{steps.map((step, index) => (
					<div key={step.id} className="create-recipe-row">
						<span className="create-recipe-step-index">{index + 1}.</span>
						<textarea
							className="create-recipe-textarea"
							value={step.text}
							onChange={(e) => updateStep(step.id, e.target.value)}
						/>
						{steps.length > 1 && (
							<button
								type="button"
								onClick={() => removeStep(step.id)}
								className="create-recipe-button create-recipe-button-danger create-recipe-button-fit"
							>
								X
							</button>
						)}
					</div>
				))}
				<button
					type="button"
					onClick={addStep}
					className="create-recipe-button create-recipe-button-secondary"
				>
					+ Ajouter une étape
				</button>
			</div>

			<button
				type="submit"
				disabled={loading}
				className="create-recipe-button create-recipe-button-primary"
			>
				{loading ? "Envoi en cours..." : "Sauvegarder la recette"}
			</button>

			{message && (
				<p
					className={`create-recipe-message ${
						message.includes("Succès")
							? "create-recipe-message-success"
							: "create-recipe-message-error"
					}`}
				>
					{message}
				</p>
			)}
		</form>
	);
};

export default CreateRecipe;
