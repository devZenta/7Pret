import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import Header from "./components/Header";
import Catalogue from "./pages/Catalogue/page";
import RecipeDetail from "./pages/Catalogue/recipedetail";
import CreateRecipe from "./pages/CreateRecipe/page";
import Home from "./pages/Home/page";
import ShoppingList from "./pages/ShoppingList/page";

function App() {
	return (
		<Router>
			<Header logoUrl="/logo.png" />

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/ShoppingList" element={<ShoppingList />} />
				<Route path="/Catalogue" element={<Catalogue />} />
				<Route path="CreateRecipe" element={<CreateRecipe />} />
				<Route path="/recipe/:id" element={<RecipeDetail />} />

				<Route path="*" element={<Navigate replace to="/" />} />
			</Routes>
		</Router>
	);
}

export default App;
