import React from 'react';



interface HeaderProps {
    logoUrl: string;
}

const Header: React.FC<HeaderProps> = ({ logoUrl }) => {

    return (
        <header style={styles.header}>
            <div className="logo-container">
                <img src={logoUrl = './public/logo.png'} alt="Logo" style={styles.logo} />
            </div>
            <nav>
                <ul style={styles.navList}>
                    <li><a href="/">Accueil</a></li>
                    <li><a href="/ShoppingList">Panier</a></li>
                    <li><a href="/Recette Certifié">Recette Certifié</a></li>
                    <li><a href="/Catalogue">Catalogue</a></li>
                    <li><a href="/CreateRecipe">Creer une Recette+</a></li>



                </ul>
            </nav>
        </header>
    );
};

const styles = {
    header: { display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#eee2dfff', color: '#562b2bff' },
    logo: { width: '200px', marginRight: '10px' },
    navList: { display: 'flex', listStyle: 'none', gap: '20px' }
};







export default Header




