import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/page';
import Header from './components/Header';
import CreateRecipe from './pages/CreateRecipe/page';
import Catalogue from './pages/Catalogue/page';
import ShoppingList from './pages/ShoppingList/page';

function App() {
  return (
    <Router>
      <Header logoUrl="/logo.png" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ShoppingList" element={<ShoppingList />} />
        <Route path="/Catalogue" element={<Catalogue />} />
        <Route path="CreateRecipe" element={<CreateRecipe />} />


        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;