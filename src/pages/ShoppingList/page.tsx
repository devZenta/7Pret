import { useEffect, useState } from "react";

const ShoppingList = () => {
	const [panier, setPanier] = useState<any[]>([]);

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

	return (
		<div>
			<h1>Ma Liste de Courses</h1>
			{panier.length === 0 ? (
				<p>Votre panier est vide.</p>
			) : (
				<ul>
					{panier.map((item) => (
						<li key={item.id ?? item.ingredient ?? item.name}>
							{item.ingredient || item.name}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default ShoppingList;
