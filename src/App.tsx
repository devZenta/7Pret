import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
	useLocation,
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

const AppContent = () => {
	const location = useLocation();
	const hideHeader =
		location.pathname === "/login" || location.pathname === "/signup";

	return (
		<>
			{!hideHeader && <Header logoUrl="/logo.png" />}

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
				<Route
					path="/settings"
					element={
						<ProtectedRoute>
							<Settings />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/ShoppingList"
					element={
						<ProtectedRoute>
							<ShoppingList />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/Catalogue"
					element={
						<ProtectedRoute>
							<Catalogue />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/CertifRecipe"
					element={
						<ProtectedRoute>
							<CertifRecipe />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/CreateRecipe"
					element={
						<ProtectedRoute>
							<CreateRecipe />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/recipe/:id"
					element={
						<ProtectedRoute>
							<RecipeDetail />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/custom-recipe/:id"
					element={
						<ProtectedRoute>
							<RecipeDetail isCustom />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/shopingList/:id"
					element={
						<ProtectedRoute>
							<ShoppingList />
						</ProtectedRoute>
					}
				/>

				<Route path="*" element={<Navigate replace to="/" />} />
			</Routes>
		</>
	);
};

function App() {
	return (
		<Router>
			<AppContent />
		</Router>
	);
}

export default App;
