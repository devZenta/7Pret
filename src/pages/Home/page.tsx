import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import recipesData from "../../data/recipes.json";
import "./Home.css";

// Types
interface Recipe {
	id: number | string;
	name: string;
	type: string;
	cuisine: string;
	difficulty: string;
	prepTime: number;
	cookTime: number;
	Time?: number;
	servings: number;
	image: string;
	rating: number;
}

interface MealPlanning {
	id: string;
	userId: string;
	date: string;
	slot: string | null;
	recipeId: string;
	source: string;
	createdAt: string;
	updatedAt: string;
}

type MealSlot = "petit-dejeuner" | "dejeuner" | "diner" | "collation";

// Helper functions
const formatDate = (date: Date): string => {
	return date.toISOString().split("T")[0];
};

const getDayName = (date: Date): string => {
	const days = [
		"Dimanche",
		"Lundi",
		"Mardi",
		"Mercredi",
		"Jeudi",
		"Vendredi",
		"Samedi",
	];
	return days[date.getDay()];
};

const getMealIcon = (slot: MealSlot): string => {
	const icons: Record<MealSlot, string> = {
		"petit-dejeuner": "🌅",
		dejeuner: "☀️",
		diner: "🌙",
		collation: "🍎",
	};
	return icons[slot];
};

const Home = () => {
	const [planning, setPlanning] = useState<MealPlanning[]>([]);
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch data
	const fetchPlanning = useCallback(async () => {
		try {
			const response = await fetch("/api/planning", {
				credentials: "include",
			});
			if (response.ok) {
				const data = await response.json();
				setPlanning(data);
			}
		} catch (err) {
			console.error("Error fetching planning:", err);
		}
	}, []);

	const fetchRecipes = useCallback(async () => {
		try {
			const response = await fetch("/api/recipes");
			if (response.ok) {
				const data = await response.json();
				if (data && data.length > 0) {
					setRecipes(data);
					return;
				}
			}
			// Fallback to local JSON
			setRecipes(recipesData as Recipe[]);
		} catch (err) {
			console.error("Error fetching recipes:", err);
			// Fallback to local JSON on error
			setRecipes(recipesData as Recipe[]);
		}
	}, []);

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			await Promise.all([fetchPlanning(), fetchRecipes()]);
			setLoading(false);
		};
		loadData();
	}, [fetchPlanning, fetchRecipes]);

	// Get recipe by ID
	const getRecipeById = (recipeId: string): Recipe | null => {
		return recipes.find((r) => r.id.toString() === recipeId) || null;
	};

	// Get today's and upcoming meals
	const today = new Date();
	const todayStr = formatDate(today);

	const todayMeals = planning.filter((p) => p.date === todayStr);

	// Get full week (Monday to Sunday)
	const getWeekDays = (): Date[] => {
		const dates: Date[] = [];
		const start = new Date(today);
		// Get Monday of current week
		const day = start.getDay();
		const diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days, else go to Monday
		start.setDate(start.getDate() + diff);

		for (let i = 0; i < 7; i++) {
			const date = new Date(start);
			date.setDate(start.getDate() + i);
			dates.push(date);
		}
		return dates;
	};

	const weekDays = getWeekDays();

	const weekMeals = weekDays.map((date) => {
		const dateStr = formatDate(date);
		const meals = planning.filter((p) => p.date === dateStr);
		return { date, meals };
	});

	// Stats
	const totalPlanned = planning.filter((p) => {
		const pDate = new Date(p.date);
		const weekAhead = new Date(today);
		weekAhead.setDate(today.getDate() + 7);
		return pDate >= today && pDate <= weekAhead;
	}).length;

	return (
		<div className="home-container">
			{/* Hero Section */}
			<section className="home-hero">
				<div className="home-hero-content">
					<h1>🍽️ Bienvenue sur 7Prêt</h1>
					<p>Le planning de la semaine, pour oublier vos problèmes.</p>
				</div>
			</section>

			{/* Quick Stats */}
			<section className="home-stats">
				<div className="home-stat-card">
					<span className="home-stat-icon">📅</span>
					<div className="home-stat-info">
						<h3>{totalPlanned}</h3>
						<p>Repas cette semaine</p>
					</div>
				</div>
				<div className="home-stat-card">
					<span className="home-stat-icon">📖</span>
					<div className="home-stat-info">
						<h3>{recipes.length}</h3>
						<p>Recettes disponibles</p>
					</div>
				</div>
				<div className="home-stat-card">
					<span className="home-stat-icon">🍳</span>
					<div className="home-stat-info">
						<h3>{todayMeals.length}</h3>
						<p>Repas aujourd'hui</p>
					</div>
				</div>
			</section>

			{/* Today's Meals */}
			<section className="home-section">
				<div className="home-section-header">
					<h2>🌟 Aujourd'hui</h2>
					<span className="home-date-badge">
						{today.toLocaleDateString("fr-FR", {
							weekday: "long",
							day: "numeric",
							month: "long",
						})}
					</span>
				</div>

				{loading ? (
					<div className="home-loading">
						<div className="home-spinner" />
					</div>
				) : todayMeals.length === 0 ? (
					<div className="home-empty-today">
						<span>🍽️</span>
						<p>Aucun repas planifié pour aujourd'hui</p>
						<Link to="/Planning" className="home-cta-btn">
							Planifier mes repas
						</Link>
					</div>
				) : (
					<div className="home-today-meals">
						{todayMeals.map((meal) => {
							const recipe = getRecipeById(meal.recipeId);
							const slot = (meal.slot || "diner") as MealSlot;
							const totalTime =
								recipe?.Time ||
								(recipe ? recipe.prepTime + recipe.cookTime : 0);
							return (
								<div key={meal.id} className="home-meal-card">
									<span className="home-meal-icon">{getMealIcon(slot)}</span>
									<div className="home-meal-info">
										<span className="home-meal-slot">{slot}</span>
										<h4>{recipe?.name || "Recette inconnue"}</h4>
										{recipe && (
											<span className="home-meal-meta">
												{recipe.cuisine} • {totalTime} min
											</span>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</section>

			{/* Weekly Overview */}
			<section className="home-section">
				<div className="home-section-header">
					<h2>📆 Aperçu de la semaine</h2>
					<Link to="/Planning" className="home-view-all">
						Voir tout →
					</Link>
				</div>

				<div className="home-week-preview">
					{weekMeals.map(({ date, meals }) => {
						const isToday = formatDate(date) === todayStr;
						return (
							<div
								key={formatDate(date)}
								className={`home-day-preview ${isToday ? "today" : ""}`}
							>
								<div className="home-day-header">
									<span className="home-day-name">{getDayName(date)}</span>
									<span className="home-day-num">{date.getDate()}</span>
								</div>
								<div className="home-day-meals">
									{meals.length === 0 ? (
										<span className="home-no-meal">—</span>
									) : (
										meals.map((meal) => {
											const recipe = getRecipeById(meal.recipeId);
											return (
												<span key={meal.id} className="home-meal-name-tag">
													{recipe?.name || "Repas"}
												</span>
											);
										})
									)}
								</div>
							</div>
						);
					})}
				</div>

				<Link to="/Planning" className="home-planning-cta">
					<span>📅</span>
					<div>
						<h4>Gérer mon planning complet</h4>
						<p>Ajoutez, modifiez ou supprimez vos repas</p>
					</div>
					<span className="home-cta-arrow">→</span>
				</Link>
			</section>

			{/* Quick Actions */}
			<section className="home-actions">
				<Link to="/Catalogue" className="home-action-card">
					<span className="home-action-icon">📚</span>
					<h3>Catalogue</h3>
					<p>Explorer les recettes</p>
				</Link>
				<Link to="/CreateRecipe" className="home-action-card">
					<span className="home-action-icon">✨</span>
					<h3>Créer</h3>
					<p>Nouvelle recette</p>
				</Link>
				<Link to="/ShoppingList" className="home-action-card">
					<span className="home-action-icon">🛒</span>
					<h3>Liste de courses</h3>
					<p>Voir mon panier</p>
				</Link>
			</section>
		</div>
	);
};

export default Home;
