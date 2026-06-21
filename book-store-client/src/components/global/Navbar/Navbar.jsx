import { useContext, useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { navLinks } from '../../../data/links';
import { ThemeContext } from '../../../context/ThemeContext';
import logoImg from "../../../assets/images/logo.png";

// React Icons
import { 
    FaSearch, 
    FaShoppingCart, 
    FaHeart, 
    FaUser,
    FaMoon,
    FaSun,
    FaBars,
    FaTimes
} from 'react-icons/fa';

import "./navbarStyle.css";

function Navbar() {
    const [query, setQuery] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    
    // Cart & Wishlist counts
    useEffect(() => {
        const updateCounts = () => {
            try {
                const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                const totalCart = cart.reduce(
                    (sum, item) => sum + (item.quantity || 0),
                    0
                );
                setCartCount(totalCart);
                
                const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
                setWishlistCount(wishlist.length);
            } catch {
                setCartCount(0);
                setWishlistCount(0);
            }
        };
        
        updateCounts();
        window.addEventListener("storage", updateCounts);
        window.addEventListener("cartUpdated", updateCounts);
        window.addEventListener("wishlistUpdated", updateCounts);
        
        return () => {
            window.removeEventListener("storage", updateCounts);
            window.removeEventListener("cartUpdated", updateCounts);
            window.removeEventListener("wishlistUpdated", updateCounts);
        };
    }, []);
    
    // Search with Debounce
    useEffect(() => {
        const timeOut = setTimeout(() => {
            const clearQuery = query.trim();
            if (clearQuery) {
                navigate(`/search?q=${clearQuery}`);
                setIsMobileMenuOpen(false);
            }
        }, 800);
        
        return () => clearTimeout(timeOut);
    }, [query, navigate]);
    
    // Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    
    return (
        <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
            {/* ============================
                🔝 TOP ROW: Logo + Search + Actions
                ============================ */}
            <div className="navbar-top">
                <div className="navbar-container">
                    
                    {/* Logo */}
                    <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
                        <img src={logoImg} alt="شروق المعرفة" className="navbar-logo" />
                        <span className="brand-text">شروق المعرفة</span>
                    </Link>
                    
                    {/* Search Bar (Desktop) */}
                    <form 
                        className="search-form-desktop" 
                        role="search" 
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="search-wrapper">
                            <FaSearch className="search-icon" />
                            <input 
                                type="search" 
                                className="search-input"
                                placeholder="ابحث عن كتاب، مؤلف، تصنيف..." 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                aria-label="بحث"
                            />
                            {query && (
                                <button 
                                    type="button"
                                    className="search-clear"
                                    onClick={() => setQuery("")}
                                    aria-label="مسح البحث"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    </form>
                    
                    {/* Action Icons */}
                    <div className="navbar-actions">
                        <button 
                            className="action-btn theme-toggle"
                            onClick={toggleTheme}
                            aria-label="تبديل الوضع"
                            title={theme === "light" ? "الوضع الليلي" : "الوضع النهاري"}
                        >
                            {theme === "light" ? <FaMoon /> : <FaSun />}
                        </button>
                        
                        <Link to="/account" className="action-btn" aria-label="المفضلة" title="المفضلة">
                            <FaHeart />
                            {wishlistCount > 0 && (
                                <span className="badge-count">{wishlistCount}</span>
                            )}
                        </Link>
                        
                        <Link to="/cart" className="action-btn" aria-label="السلة" title="السلة">
                            <FaShoppingCart />
                            {cartCount > 0 && (
                                <span className="badge-count">{cartCount}</span>
                            )}
                        </Link>
                        
                        <Link to="/account" className="action-btn" aria-label="حسابي" title="حسابي">
                            <FaUser />
                        </Link>
                        
                        <button 
                            className="mobile-menu-toggle"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="فتح القائمة"
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* ============================
                🔻 BOTTOM ROW: Nav Links
                ============================ */}
            <div className="navbar-bottom">
                <div className="navbar-container">
                    <ul className="nav-links-desktop">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <li key={link.id}>
                                    <NavLink 
                                        to={link.link}
                                        className={({ isActive }) => 
                                            `nav-link ${isActive ? 'active' : ''}`
                                        }
                                        end={link.link === '/'}
                                    >
                                        {Icon && <Icon className="nav-link-icon" />}
                                        <span>{link.title}</span>
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            
            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <form 
                    className="search-form-mobile" 
                    role="search"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="search-wrapper">
                        <FaSearch className="search-icon" />
                        <input 
                            type="search" 
                            className="search-input"
                            placeholder="ابحث..." 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </form>
                
                <ul className="nav-links-mobile">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <li key={link.id}>
                                <NavLink 
                                    to={link.link}
                                    className={({ isActive }) => 
                                        `nav-link-mobile ${isActive ? 'active' : ''}`
                                    }
                                    end={link.link === '/'}
                                    onClick={closeMobileMenu}
                                >
                                    {Icon && <Icon className="nav-link-icon" />}
                                    <span>{link.title}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </div>
            
            {isMobileMenuOpen && (
                <div 
                    className="mobile-menu-overlay"
                    onClick={closeMobileMenu}
                    aria-hidden="true"
                />
            )}
        </header>
    );
}

export default Navbar;