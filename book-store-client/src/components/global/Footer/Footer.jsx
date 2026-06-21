import { Link } from "react-router-dom";
import {
    FaBookOpen,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaClock,
    FaWhatsapp,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaTelegram,
    FaLinkedin,
    FaYoutube,
    FaPinterest,
    FaCcVisa,
    FaCcMastercard,
    FaCcPaypal,
    FaApplePay,
    FaShieldAlt,
    FaTruck,
    FaUndo,
    FaHeadset,
    FaArrowUp,
} from "react-icons/fa";

import "./Footer.css";

function Footer() {
    const currentYear = new Date().getFullYear();
    
    const quickLinks = [
        { name: "الرئيسية", path: "/" },
        { name: "التصنيفات", path: "/categories" },
        { name: "كافة الكتب", path: "/books" },
        { name: "المدونة", path: "/blogs" },
        { name: "من نحن", path: "/aboutus" },
        { name: "اتصل بنا", path: "/contact" },
    ];
    
    const customerService = [
        { name: "سياسة الشحن", path: "#" },
        { name: "سياسة الإرجاع", path: "#" },
        { name: "الأسئلة الشائعة", path: "/contact" },
        { name: "طرق الدفع", path: "#" },
        { name: "تتبع الطلب", path: "#" },
        { name: "شروط الاستخدام", path: "#" },
    ];
    
    const socialLinks = [
        { icon: FaWhatsapp, url: "https://wa.me/966123456789", name: "واتساب", color: "#25D366" },
        { icon: FaFacebook, url: "#", name: "فيسبوك", color: "#1877F2" },
        { icon: FaTwitter, url: "#", name: "تويتر", color: "#1DA1F2" },
        { icon: FaInstagram, url: "#", name: "إنستغرام", color: "#E1306C" },
        { icon: FaTelegram, url: "#", name: "تيليجرام", color: "#0088CC" },
        { icon: FaLinkedin, url: "#", name: "لينكدإن", color: "#0077B5" },
        { icon: FaYoutube, url: "#", name: "يوتيوب", color: "#FF0000" },
        { icon: FaPinterest, url: "#", name: "بينترست", color: "#E60023" },
    ];
    
    const features = [
        { icon: FaTruck, title: "شحن سريع", description: "توصيل خلال 2-5 أيام" },
        { icon: FaUndo, title: "إرجاع مجاني", description: "خلال 14 يوماً" },
        { icon: FaShieldAlt, title: "دفع آمن", description: "حماية كاملة لبياناتك" },
        { icon: FaHeadset, title: "دعم 24/7", description: "نحن دائماً معك" },
    ];
    
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    
    return (
        <footer className="footer">
            {/* ===== Features Bar ===== */}
            <div className="footer-features">
                <div className="footer-container">
                    <div className="footer-features-grid">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="footer-feature">
                                    <div className="footer-feature-icon">
                                        <Icon />
                                    </div>
                                    <div className="footer-feature-info">
                                        <h4 className="footer-feature-title">
                                            {feature.title}
                                        </h4>
                                        <p className="footer-feature-desc">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* ===== Main Footer ===== */}
            <div className="footer-main">
                <div className="footer-container">
                    <div className="footer-grid">
                        {/* ===== العمود الأول: عن المتجر ===== */}
                        <div className="footer-col footer-col--brand">
                            <Link to="/" className="footer-brand">
                                <div className="footer-brand-icon">
                                    <FaBookOpen />
                                </div>
                                <span className="footer-brand-text">
                                    شروق المعرفة
                                </span>
                            </Link>
                            
                            <p className="footer-description">
                                مكتبتك الإلكترونية المفضلة في العالم العربي. نقدم
                                أفضل الكتب من مختلف المجالات بأسعار مناسبة وجودة عالية.
                            </p>
                            
                            <div className="footer-social">
                                {socialLinks.map((social, index) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="footer-social-link"
                                            style={{ "--social-color": social.color }}
                                            aria-label={social.name}
                                            title={social.name}
                                        >
                                            <Icon />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {/* ===== العمود الثاني: روابط سريعة ===== */}
                        <div className="footer-col">
                            <h3 className="footer-title">روابط سريعة</h3>
                            <ul className="footer-links">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link to={link.path} className="footer-link">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* ===== العمود الثالث: خدمة العملاء ===== */}
                        <div className="footer-col">
                            <h3 className="footer-title">خدمة العملاء</h3>
                            <ul className="footer-links">
                                {customerService.map((link, index) => (
                                    <li key={index}>
                                        <Link to={link.path} className="footer-link">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* ===== العمود الرابع: تواصل معنا ===== */}
                        <div className="footer-col">
                            <h3 className="footer-title">تواصل معنا</h3>
                            <ul className="footer-contact">
                                <li className="footer-contact-item">
                                    <FaMapMarkerAlt className="footer-contact-icon" />
                                    <span>الرياض، المملكة العربية السعودية</span>
                                </li>
                                <li className="footer-contact-item">
                                    <FaPhone className="footer-contact-icon" />
                                    <a href="tel:+966123456789">+966 12 345 6789</a>
                                </li>
                                <li className="footer-contact-item">
                                    <FaEnvelope className="footer-contact-icon" />
                                    <a href="mailto:info@shorouk.com">info@shorouk.com</a>
                                </li>
                                <li className="footer-contact-item">
                                    <FaClock className="footer-contact-icon" />
                                    <span>السبت - الخميس: 9:00 - 18:00</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* ===== Bottom Bar ===== */}
            <div className="footer-bottom">
                <div className="footer-container">
                    <div className="footer-bottom-content">
                        <div className="footer-copyright">
                            <p>
                                &copy; {currentYear} <strong>شروق المعرفة</strong>. جميع الحقوق محفوظة.
                            </p>
                        </div>
                        
                        <div className="footer-payments">
                            <span className="footer-payments-label">طرق الدفع:</span>
                            <div className="footer-payments-icons">
                                <FaCcVisa title="Visa" />
                                <FaCcMastercard title="Mastercard" />
                                <FaCcPaypal title="PayPal" />
                                <FaApplePay title="Apple Pay" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* ===== Scroll to Top Button ===== */}
            <button
                className="footer-scroll-top"
                onClick={scrollToTop}
                aria-label="العودة للأعلى"
                title="العودة للأعلى"
            >
                <FaArrowUp />
            </button>
        </footer>
    );
}

export default Footer;