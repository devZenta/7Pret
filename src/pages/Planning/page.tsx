import { useCallback, useEffect, useState } from "react";
import recipesData from "../../data/recipes.json";
import "./Planning.css";

const PLACEHOLDER_IMAGE = "https://placehold.co/100x100/F5EBE6/CA7C5C?text=🍽️";

const getImageUrl = (image: string | null | undefined): string | undefined => {
	if (!image || image === "url..." || image === "") {
		return undefined;
	}
	return image;
};

// Types
interface Ingredient {
	name: string;
	quantity: number;
	unit: string;
}

interface Recipe {
	id: number | string;
	name: string;
	type: string;
	cuisine: string;
	difficulty: string;
	prepTime: number;
	cookTime: number;
	Time: number;
	servings: number;
	image: string;
	ingredients: Ingredient[];
	steps: string[];
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

interface DayPlan {
	date: Date;
	meals: {
		[key in MealSlot]?: {
			planning: MealPlanning;
			recipe: Recipe | null;
		};
	};
}

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

const formatShortDate = (date: Date): string => {
	return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

const getWeekDates = (startDate: Date): Date[] => {
	const dates: Date[] = [];
	const start = new Date(startDate);
	start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday

	for (let i = 0; i < 7; i++) {
		const date = new Date(start);
		date.setDate(start.getDate() + i);
		dates.push(date);
	}
	return dates;
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

const getMealLabel = (slot: MealSlot): string => {
	const labels: Record<MealSlot, string> = {
		"petit-dejeuner": "Petit-déjeuner",
		dejeuner: "Déjeuner",
		diner: "Dîner",
		collation: "Collation",
	};
	return labels[slot];
};

const MEAL_SLOTS: MealSlot[] = [
	"petit-dejeuner",
	"dejeuner",
	"diner",
	"collation",
];

const Planning = () => {
	const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
		const today = new Date();
		const monday = new Date(today);
		monday.setDate(today.getDate() - today.getDay() + 1);
		return monday;
	});
	const [planning, setPlanning] = useState<MealPlanning[]>([]);
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Modal state
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<MealSlot>("diner");
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [addingMeal, setAddingMeal] = useState(false);

	// Toast state
	const [toast, setToast] = useState<{
		message: string;
		type: "success" | "error";
	} | null>(null);

	const showToast = (message: string, type: "success" | "error") => {
		setToast({ message, type });
		setTimeout(() => setToast(null), 3000);
	};

	// Fetch planning data
	const fetchPlanning = useCallback(async () => {
		try {
			const response = await fetch("/api/planning", {
				credentials: "include",
			});
			if (response.ok) {
				const data = await response.json();
				setPlanning(data);
			} else if (response.status === 401) {
				setPlanning([]);
			}
		} catch (err) {
			console.error("Error fetching planning:", err);
		}
	}, []);

	// Fetch recipes data
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
			try {
				await Promise.all([fetchPlanning(), fetchRecipes()]);
			} catch (_err) {
				setError("Erreur lors du chargement des données");
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, [fetchPlanning, fetchRecipes]);

	// Get recipe by ID
	const getRecipeById = (recipeId: string, source: string): Recipe | null => {
		if (source === "predefined") {
			return recipes.find((r) => r.id.toString() === recipeId) || null;
		}
		return null;
	};

	// Build week planning
	const weekDates = getWeekDates(currentWeekStart);
	const weekPlanning: DayPlan[] = weekDates.map((date) => {
		const dateStr = formatDate(date);
		const dayMeals = planning.filter((p) => p.date === dateStr);

		const meals: DayPlan["meals"] = {};
		for (const meal of dayMeals) {
			const slot = (meal.slot || "diner") as MealSlot;
			meals[slot] = {
				planning: meal,
				recipe: getRecipeById(meal.recipeId, meal.source),
			};
		}

		return { date, meals };
	});

	// Navigation
	const goToPreviousWeek = () => {
		const newStart = new Date(currentWeekStart);
		newStart.setDate(newStart.getDate() - 7);
		setCurrentWeekStart(newStart);
	};

	const goToNextWeek = () => {
		const newStart = new Date(currentWeekStart);
		newStart.setDate(newStart.getDate() + 7);
		setCurrentWeekStart(newStart);
	};

	const goToCurrentWeek = () => {
		const today = new Date();
		const monday = new Date(today);
		monday.setDate(today.getDate() - today.getDay() + 1);
		setCurrentWeekStart(monday);
	};

	// Modal handlers
	const openAddModal = (date: Date, slot?: MealSlot) => {
		setSelectedDate(date);
		setSelectedSlot(slot || "diner");
		setSelectedRecipe(null);
		setSearchQuery("");
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setSelectedDate(null);
		setSelectedRecipe(null);
		setSearchQuery("");
	};

	// Add meal to planning
	const handleAddMeal = async () => {
		if (!selectedDate || !selectedRecipe) return;

		setAddingMeal(true);
		try {
			const response = await fetch("/api/planning", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					date: formatDate(selectedDate),
					slot: selectedSlot,
					recipeId: selectedRecipe.id.toString(),
					source: "predefined",
				}),
			});

			if (response.ok) {
				await fetchPlanning();
				showToast("Repas ajouté avec succès !", "success");
				closeModal();
			} else if (response.status === 401) {
				showToast("Veuillez vous connecter pour ajouter un repas", "error");
			} else {
				showToast("Erreur lors de l'ajout du repas", "error");
			}
		} catch (_err) {
			showToast("Erreur lors de l'ajout du repas", "error");
		} finally {
			setAddingMeal(false);
		}
	};

	// Delete meal from planning
	const handleDeleteMeal = async (mealId: string) => {
		try {
			const response = await fetch(`/api/planning/${mealId}`, {
				method: "DELETE",
				credentials: "include",
			});

			if (response.ok) {
				await fetchPlanning();
				showToast("Repas supprimé", "success");
			} else {
				showToast("Erreur lors de la suppression", "error");
			}
		} catch (_err) {
			showToast("Erreur lors de la suppression", "error");
		}
	};

	// Filter recipes
	const filteredRecipes = recipes.filter(
		(recipe) =>
			recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
			recipe.type.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Calculate stats
	const totalMealsThisWeek = planning.filter((p) => {
		const planDate = new Date(p.date);
		return planDate >= weekDates[0] && planDate <= weekDates[6];
	}).length;

	const isToday = (date: Date): boolean => {
		const today = new Date();
		return formatDate(date) === formatDate(today);
	};

	// Format week range
	const weekRangeText = `${formatShortDate(weekDates[0])} - ${formatShortDate(weekDates[6])}`;

	if (loading) {
		return (
			<div className="planning-container">
				<div className="planning-loading">
					<div className="planning-spinner" />
					<p>Chargement de votre planning...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="planning-container">
				<div className="planning-error">
					<p>{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="planning-container">
			{/* Header Section */}
			<section className="planning-header">
				<div className="planning-header-content">
					<h1>📅 Planning de la Semaine</h1>
					<p>Organisez vos repas pour chaque jour de la semaine</p>
				</div>

				{/* Stats */}
				<div className="planning-stats">
					<div className="planning-stat">
						<span className="stat-number">{totalMealsThisWeek}</span>
						<span className="stat-label">Repas planifiés</span>
					</div>
					<div className="planning-stat">
						<span className="stat-number">{recipes.length}</span>
						<span className="stat-label">Recettes disponibles</span>
					</div>
					<div className="planning-stat">
						<span className="stat-number">7</span>
						<span className="stat-label">Jours</span>
					</div>
				</div>
			</section>

			{/* Week Navigation */}
			<div className="planning-nav">
				<button
					type="button"
					className="planning-nav-btn"
					onClick={goToPreviousWeek}
				>
					<span>←</span> Semaine précédente
				</button>
				<div className="planning-nav-center">
					<h2>Semaine du {weekRangeText}</h2>
					<button
						type="button"
						className="planning-today-btn"
						onClick={goToCurrentWeek}
					>
						Aujourd'hui
					</button>
				</div>
				<button
					type="button"
					className="planning-nav-btn"
					onClick={goToNextWeek}
				>
					Semaine suivante <span>→</span>
				</button>
			</div>

			{/* Planning Grid */}
			<div className="planning-week-grid">
				{weekPlanning.map((dayPlan) => (
					<div
						key={formatDate(dayPlan.date)}
						className={`planning-day-card ${isToday(dayPlan.date) ? "today" : ""}`}
					>
						<div className="planning-day-header">
							<h3>{getDayName(dayPlan.date)}</h3>
							<span className="planning-day-date">
								{formatShortDate(dayPlan.date)}
							</span>
							{isToday(dayPlan.date) && (
								<span className="today-badge">Aujourd'hui</span>
							)}
						</div>
						<div className="planning-day-content">
							{MEAL_SLOTS.map((slot) => {
								const meal = dayPlan.meals[slot];

								if (meal) {
									return (
										<div key={slot} className="planning-meal-item">
											<div className="planning-meal-header">
												<span className="planning-meal-icon">
													{getMealIcon(slot)}
												</span>
												<span className="planning-meal-slot">
													{getMealLabel(slot)}
												</span>
											</div>
											<div className="planning-meal-content">
												<span className="planning-meal-name">
													{meal.recipe?.name || "Recette inconnue"}
												</span>
												{meal.recipe && (
													<span className="planning-meal-meta">
														{meal.recipe.cuisine} •{" "}
														{meal.recipe.Time ||
															meal.recipe.prepTime + meal.recipe.cookTime}{" "}
														min
													</span>
												)}
												<span
													className={`planning-source-badge ${meal.planning.source === "custom" ? "custom" : ""}`}
												>
													{meal.planning.source === "custom"
														? "Personnalisée"
														: "Catalogue"}
												</span>
											</div>
											<button
												type="button"
												className="planning-meal-delete"
												onClick={() => handleDeleteMeal(meal.planning.id)}
												title="Supprimer ce repas"
											>
												🗑️
											</button>
										</div>
									);
								}

								return (
									<button
										type="button"
										key={slot}
										className="planning-empty-slot"
										onClick={() => openAddModal(dayPlan.date, slot)}
									>
										<span className="planning-meal-icon">
											{getMealIcon(slot)}
										</span>
										<span className="planning-empty-label">
											{getMealLabel(slot)}
										</span>
										<span className="planning-add-icon">+</span>
									</button>
								);
							})}
						</div>
					</div>
				))}
			</div>

			{/* Add Meal Modal */}
			{modalOpen && selectedDate && (
				<>
					<button
						type="button"
						className="planning-modal-overlay"
						onClick={closeModal}
						onKeyDown={(e) => e.key === "Escape" && closeModal()}
						aria-label="Fermer le modal"
					/>
					<div className="planning-modal" role="dialog" aria-modal="true">
						<div className="planning-modal-header">
							<div>
								<h3>Ajouter un repas</h3>
								<p>
									{getDayName(selectedDate)} {formatShortDate(selectedDate)}
								</p>
							</div>
							<button
								type="button"
								className="planning-modal-close"
								onClick={closeModal}
							>
								×
							</button>
						</div>

						<div className="planning-modal-body">
							{/* Selected Slot Display */}
							<div className="planning-selected-slot">
								<span className="planning-selected-slot-icon">
									{getMealIcon(selectedSlot)}
								</span>
								<span className="planning-selected-slot-label">
									{getMealLabel(selectedSlot)}
								</span>
							</div>

							{/* Search */}
							<div className="planning-search">
								<label htmlFor="recipe-search">Choisir une recette</label>
								<input
									id="recipe-search"
									type="text"
									className="planning-search-input"
									placeholder="🔍 Rechercher une recette..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>

							{/* Recipe List */}
							<div className="planning-recipe-list">
								{filteredRecipes.length === 0 ? (
									<div className="planning-no-recipes">
										<span>🍳</span>
										<p>Aucune recette trouvée</p>
									</div>
								) : (
									filteredRecipes.slice(0, 15).map((recipe) => (
										<div
											key={recipe.id}
											className={`planning-recipe-option ${selectedRecipe?.id === recipe.id ? "selected" : ""}`}
											onClick={() => setSelectedRecipe(recipe)}
											onKeyDown={(e) =>
												e.key === "Enter" && setSelectedRecipe(recipe)
											}
											role="option"
											aria-selected={selectedRecipe?.id === recipe.id}
											tabIndex={0}
										>
											<div
												className="planning-recipe-thumb"
												style={{
													backgroundImage: getImageUrl(recipe.image)
														? `url(${recipe.image})`
														: `url(${PLACEHOLDER_IMAGE})`,
												}}
											/>
											<div className="planning-recipe-info">
												<h5>{recipe.name}</h5>
												<span>
													{recipe.cuisine} • {recipe.difficulty} •{" "}
													{recipe.Time || recipe.prepTime + recipe.cookTime} min
												</span>
												<div className="planning-recipe-rating">
													{"⭐".repeat(Math.round(recipe.rating))}
												</div>
											</div>
											{selectedRecipe?.id === recipe.id && (
												<div className="planning-recipe-check">✓</div>
											)}
										</div>
									))
								)}
							</div>
						</div>

						<div className="planning-modal-footer">
							<button
								type="button"
								className="planning-btn-cancel"
								onClick={closeModal}
							>
								Annuler
							</button>
							<button
								type="button"
								className="planning-btn-add"
								onClick={handleAddMeal}
								disabled={!selectedRecipe || addingMeal}
							>
								{addingMeal ? "Ajout en cours..." : "Ajouter au planning"}
							</button>
						</div>
					</div>
				</>
			)}

			{/* Toast Notification */}
			{toast && (
				<div className={`planning-toast ${toast.type}`}>{toast.message}</div>
			)}
		</div>
	);
};

export default Planning;
