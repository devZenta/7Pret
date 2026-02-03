import type React from "react";
import { useEffect, useState } from "react";
import "./ShoppingList.css";

interface ShoppingItem {
	name: string;
	quantity: string | number;
	unit: string;
}

const ShoppingList = () => {
	const [panier, setPanier] = useState<ShoppingItem[]>([]);
	const [newItem, setNewItem] = useState("");

	useEffect(() => {
		const savedPanier = localStorage.getItem("panier");

		if (savedPanier) {
			try {
				const parsedPanier = JSON.parse(savedPanier);
				setPanier(parsedPanier);
			} catch (error) {
				console.error("Erreur lors du parsing du panier", error);
			}
		}
	}, []);

	const handleDelete = (indexToDelete: number) => {
		const newPanier = panier.filter((_, index) => index !== indexToDelete);
		setPanier(newPanier);
		localStorage.setItem("panier", JSON.stringify(newPanier));
	};

	const handleAddItem = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newItem.trim()) return;

		const item: ShoppingItem = { name: newItem, quantity: "", unit: "" };
		const newPanier = [...panier, item];
		setPanier(newPanier);
		localStorage.setItem("panier", JSON.stringify(newPanier));
		setNewItem("");
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

			{panier.length === 0 ? (
				<p className="empty-message">Votre panier est vide.</p>
			) : (
				<ul className="shopping-list">
					{panier.map((item, index) => (
						<li key={`${item.name}-${index}`} className="shopping-item">
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
									onClick={() => handleDelete(index)}
								>
									Supprimer
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default ShoppingList;
