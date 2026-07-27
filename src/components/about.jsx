import img from '../images/aboutnew.png'
import './about.css'

export default function About() {
  return (
    <section id="about-section" className="about-section">
      <div className="about-container">
        <div className="about-content visible">
          <h3 className="about-tagline">Together We <span className="excellence-text">Build Excellence</span></h3>
          <p>
            At AAlliance Lifts Pvt.Ltd. we are committed to transforming vertical transportation through innovation, precision engineering, and uncompromising quality. Based in Ghaziabad, we specialize in the manufacturing, modernization, maintenance, installation, and export of advanced elevator solutions designed to meet the evolving needs of residential, commercial, and industrial sectors.
          </p>
          <p>
            With years of industry expertise and a highly skilled team of professionals, we deliver customized lift solutions that combine safety, durability, performance, and modern technology. Every project we undertake reflects our dedication to excellence, ensuring reliable and efficient mobility solutions for our clients across India and international markets.
          </p>
          <div className="company-details visible">
            <div className="detail-item">
              <span className="detail-label">Headquarter</span>
              <span className="detail-value">Khasra No.-875, Kheda Dharampura,Chapraula, Ghaziabad
                </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Established</span>
              <span className="detail-value">2012</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Company Type</span>
              <span className="detail-value">Private Limited Company</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Core Services</span>
              <span className="detail-value">Manufacturing, Modernization, Maintenance and Export</span>
            </div>
          </div>
        </div>
         <div className="about-image visible">
          <img 
            src={img} 
            alt="About Precision Lift"
            className="about-img"
          />
        </div>
      </div>
    </section>
  )
}