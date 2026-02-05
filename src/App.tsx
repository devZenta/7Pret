import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Catalogue from "./pages/Catalogue/page";
import RecipeDetail from "./pages/Catalogue/recipedetail";
import CertifRecipe from "./pages/CertifRecipe/page";
import CreateRecipe from "./pages/CreateRecipe/page";
import Home from "./pages/Home/page";
import Login from "./pages/Login/page";
import Settings from "./pages/Settings/page";
import ShoppingList from "./pages/ShoppingList/page";
import Signup from "./pages/Signup/page";

function App() {
	return (
		<Router>
			<Header logoUrl="/logo.png" />

			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					}
				/>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/settings" element={<Settings />} />
				<Route path="/ShoppingList" element={<ShoppingList />} />
				<Route path="/Catalogue" element={<Catalogue />} />
				<Route path="/CertifRecipe" element={<CertifRecipe />} />
				<Route path="CreateRecipe" element={<CreateRecipe />} />
				<Route path="/recipe/:id" element={<RecipeDetail />} />
				<Route path="/shopingList/:id" element={<ShoppingList />} />

				<Route path="*" element={<Navigate replace to="/" />} />
			</Routes>
		</Router>
	);
}

export default App;
