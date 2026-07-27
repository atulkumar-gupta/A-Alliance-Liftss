import './topbar.css'

function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* <span className="company-location">
          {' '}
          GAUTAM BUDH NAGAR, GHAZIABAD, UTTAR PRADESH, (INDIA)
        </span> */}
      </div>
      <div className="topbar-right">
        <span className="topbar-label">Service Support :</span>
        <a href="tel:+91987654321" className="topbar-phone">
          +91 9876543210
        </a>
        <span className="topbar-divider">|</span>
        <a href="tel:+91987654321" className="topbar-phone">
          +91 9876543210
        </a>
      </div>
    </header>
  )
}

export default Topbar