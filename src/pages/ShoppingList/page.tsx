import type React from "react";
import { useEffect, useState } from "react";
import "./ShoppingList.css";

interface Ingredient {
	name: string;
	quantity: string | number;
	unit: string;
}

interface RecipeGroup {
	recipeId: string | number;
	recipeName: string;
	originalServings: number;
	currentServings: number;
	ingredients: Ingredient[];
}

interface ManualItem {
	name: string;
	quantity: string | number;
	unit: string;
}

const ShoppingList = () => {
	const [recipeGroups, setRecipeGroups] = useState<RecipeGroup[]>([]);
	const [manualItems, setManualItems] = useState<ManualItem[]>([]);
	const [newItem, setNewItem] = useState("");

	useEffect(() => {
		const savedPanier = localStorage.getItem("panier");

		if (savedPanier) {
			try {
				const parsedPanier = JSON.parse(savedPanier);
				const groups: RecipeGroup[] = [];
				const manual: ManualItem[] = [];

				for (const item of parsedPanier) {
					if (item.recipeId !== undefined) {
						groups.push(item);
					} else {
						manual.push(item);
					}
				}

				setRecipeGroups(groups);
				setManualItems(manual);
			} catch (error) {
				console.error("Erreur lors du parsing du panier", error);
			}
		}
	}, []);

	const savePanier = (groups: RecipeGroup[], manual: ManualItem[]) => {
		const panier = [...groups, ...manual];
		localStorage.setItem("panier", JSON.stringify(panier));
	};

	const handleServingsChange = (index: number, delta: number) => {
		const newGroups = [...recipeGroups];
		const newServings = Math.max(1, newGroups[index].currentServings + delta);
		newGroups[index].currentServings = newServings;
		setRecipeGroups(newGroups);
		savePanier(newGroups, manualItems);
	};

	const handleDeleteRecipeGroup = (index: number) => {
		const newGroups = recipeGroups.filter((_, i) => i !== index);
		setRecipeGroups(newGroups);
		savePanier(newGroups, manualItems);
	};

	const handleDeleteManualItem = (index: number) => {
		const newManual = manualItems.filter((_, i) => i !== index);
		setManualItems(newManual);
		savePanier(recipeGroups, newManual);
	};

	const handleAddItem = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newItem.trim()) return;

		const item: ManualItem = { name: newItem, quantity: "", unit: "" };
		const newManual = [...manualItems, item];
		setManualItems(newManual);
		savePanier(recipeGroups, newManual);
		setNewItem("");
	};

	const calculateQuantity = (
		originalQty: string | number,
		originalServings: number,
		currentServings: number,
	): string => {
		const qty =
			typeof originalQty === "string" ? parseFloat(originalQty) : originalQty;
		if (Number.isNaN(qty)) return String(originalQty);
		const ratio = currentServings / originalServings;
		const result = qty * ratio;
		return result % 1 === 0 ? String(result) : result.toFixed(1);
	};

	return (
		<div className="shopping-list-container">
			<h1 className="shopping-list-title">Ma Liste de Courses</h1>

			<form className="add-item-form" onSubmit={handleAddItem}>
				<input
					type="text"
					className="item-input"
					placeholder="Ajouter un article..."
					value={newItem}
					onChange={(e) => setNewItem(e.target.value)}
				/>
				<button type="submit" className="add-button">
					Ajouter
				</button>
			</form>

			{recipeGroups.length === 0 && manualItems.length === 0 ? (
				<p className="empty-message">Votre panier est vide.</p>
			) : (
				<>
					{recipeGroups.map((group, groupIndex) => (
						<div
							key={`${group.recipeId}-${groupIndex}`}
							className="recipe-group"
						>
							<div className="recipe-group-header">
								<h2 className="recipe-group-title">{group.recipeName}</h2>
								<div className="servings-control">
									<button
										type="button"
										className="servings-btn"
										onClick={() => handleServingsChange(groupIndex, -1)}
									>
										-
									</button>
									<span className="servings-display">
										{group.currentServings} pers.
									</span>
									<button
										type="button"
										className="servings-btn"
										onClick={() => handleServingsChange(groupIndex, 1)}
									>
										+
									</button>
								</div>
								<button
									type="button"
									className="delete-group-btn"
									onClick={() => handleDeleteRecipeGroup(groupIndex)}
								>
									Supprimer
								</button>
							</div>
							<ul className="shopping-list">
								{group.ingredients.map((item, itemIndex) => (
									<li
										key={`${item.name}-${itemIndex}`}
										className="shopping-item"
									>
										<div style={{ display: "flex", alignItems: "center" }}>
											<input type="checkbox" className="checkbox" />
											<span>
												{item.name}
												{item.quantity
													? ` : ${calculateQuantity(
															item.quantity,
															group.originalServings,
															group.currentServings,
														)}`
													: ""}
												{item.unit ? ` ${item.unit}` : ""}
											</span>
										</div>
									</li>
								))}
							</ul>
						</div>
					))}

					{manualItems.length > 0 && (
						<div className="recipe-group manual-items">
							<div className="recipe-group-header">
								<h2 className="recipe-group-title">
									Articles ajoutés manuellement
								</h2>
							</div>
							<ul className="shopping-list">
								{manualItems.map((item, index) => (
									<li
										key={`manual-${item.name}-${index}`}
										className="shopping-item"
									>
										<div style={{ display: "flex", alignItems: "center" }}>
											<input type="checkbox" className="checkbox" />
											<span>
												{item.name}
												{item.quantity ? ` : ${item.quantity}` : ""}
												{item.unit ? ` ${item.unit}` : ""}
											</span>
										</div>
										<div className="item-actions">
											<button
												type="button"
												className="delete-button"
												onClick={() => handleDeleteManualItem(index)}
											>
												Supprimer
											</button>
										</div>
									</li>
								))}
							</ul>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default ShoppingList;
