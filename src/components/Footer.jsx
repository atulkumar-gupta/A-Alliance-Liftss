import './Footer.css';
import logoImg from '../images/logo.png';
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logoImg} alt="Alliance Lifts" />
            </div>
            <p className="footer-description">
              A Alliance Lifts - Premium quality elevator components and solutions for residential, commercial & industrial needs across India.
            </p>
          </div>
          <div className="footer-section footer-contact">
            <h4>Contact</h4>
            <p><strong>Address</strong>
            {/* <br />
              Khasra No.-875, Kheda Dharampura, G.T Road, Chapraula, GB Nagar,<br />
               Ghaziabad, UP - 201001 */}
            </p>
            <p><strong>Service Support</strong><br />
              +91 9876543210<br />
              +91 9876543210
            </p>
            <p><strong>Email</strong><br />
              abcde@gmail.com
              abcde@gmail.com
            </p>
          </div>
          <div className="footer-section footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/spareparts">Spare Parts</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contactus">Contact Us</a></li>
              <li><a href="/certificates">Certificates</a></li>
            </ul>

          </div>
          <div className="footer-section footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://www.facebook.com/people/Alliance-Lifts/61589174272152/" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/allianceliftspvt.ltd/" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.55 3.608 1.525.975.975 1.462 2.242 1.525 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.55 2.633-1.525 3.608-.975.975-2.242 1.462-3.608 1.525-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.55-3.608-1.525-.975-.975-1.462-2.242-1.525-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.55-2.633 1.525-3.608.975-.975 2.242-1.462 3.608-1.525C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.772.13 4.65.375 3.708.777c-.963.414-1.807.984-2.588 1.765C.376 3.501.131 4.345.073 5.308.014 6.588 0 6.997 0 10.256c0 3.259.014 3.668.073 4.948.058.963.303 2.085.717 3.03.414.963.984 1.807 1.765 2.588.781.781 1.625 1.351 2.588 1.765.945.414 2.067.659 3.03.717 1.28.059 1.689.073 4.948.073s3.668-.014 4.948-.073c.963-.058 2.085-.303 3.03-.717.963-.414 1.807-.984 2.588-1.765.781-.781 1.351-1.625 1.765-2.588.414-.945.659-2.067.717-3.03.059-1.28.073-1.689.073-4.948s-.014-3.668-.073-4.948c-.058-.963-.303-2.085-.717-3.03-.414-.963-.984-1.807-1.765-2.588-.781-.781-1.625-1.351-2.588-1.765-.945-.414-2.067-.659-3.03-.717C15.668.014 15.259 0 12 0z"/>
                  <path d="M12 5.838a6.162 6.162 0 1 00 12.324 6.162 6.162 0 0 00-12.324zM12 16a4 4 0 1 10-8 4 4 0 0 00 12z"/>
                  <circle cx="18.406" cy="5.594" r="1.44"/>
                </svg>
              </a>
              <a href="https://x.com/aalliancelift" aria-label="X">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.01 4.126H5.11z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/aalliance-lifts-private-limited/posts/?feedView=all" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.505c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.566H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.848 3.368-1.848 3.601 0 4.267 2.37 4.267 5.455v6.28zM5.337 7.433c-1.144 0-2.063-.925-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.14-.925 2.065-2.064 2.065zm1.777 13.019H3.555V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.207 24 24 23.227 24 22.271V1.729C24 .774 23.207 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            <br />
            <Link to="/admin/announcements" className="admin-footer-link">
              Manage Announcements
            </Link>
            <Link to="/admin/projects" className="admin-footer-link" style={{ marginTop: '8px' }}>
              Manage Projects
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 A Alliance Lifts Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;