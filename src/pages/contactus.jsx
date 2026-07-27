import { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import contactImg from '../images/contactmain.png'
import { insert } from '../lib/firebaseDB'
import './contactus.css'
import Footer from '../components/Footer.jsx'

const serviceOptions = [
  { value: 'manufacturing', label: 'Elevator Manufacturing' },
  { value: 'modification', label: 'Lift Modification' },
  { value: 'export', label: 'Export Solutions' },
  { value: 'support', label: 'Customer Support' },
  { value: 'maintenance', label: 'Maintenance Services' },
  { value: 'installation', label: 'Installation Services' }
]

export default function ContactUs() {
  const smallRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const heroImageRef = useRef(null)
  const contactSmallRef = useRef(null)
  const contactTitleRef = useRef(null)
  const contactInfoRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )

    const el = document.getElementById('contact-hero')

    if (el) observer.observe(el)

    return () => observer.disconnect()
  }, [])


  useEffect(() => {
    if (visible) {
      if (heroImageRef.current) heroImageRef.current.classList.add('animate-right')
      if (smallRef.current) smallRef.current.classList.add('animate-left')
      if (titleRef.current) titleRef.current.classList.add('animate-left')
      if (subtitleRef.current) subtitleRef.current.classList.add('animate-left')
      if (contactSmallRef.current) contactSmallRef.current.classList.add('animate-left')
      if (contactTitleRef.current) contactTitleRef.current.classList.add('animate-left')
      if (contactInfoRef.current) contactInfoRef.current.classList.add('animate-left')
    }
  }, [visible])



  return (
    <>
      <section id="contact-hero" className="contact-hero">
        <div className="contact-hero-container">
          <div className="contact-hero-left">
            <p className="contact-hero-small" ref={smallRef}>
              GET IN TOUCH
            </p>

            <h1 className="contact-hero-title" ref={titleRef}>
              <span className="engineered-text">Contact Us</span> Today
            </h1>

            <p className="contact-hero-text" ref={subtitleRef}>
              Have questions about our elevator solutions? Our team is ready to
              help you with expert consultation and customized solutions for
              your vertical transportation needs.
            </p>

            <div className="contact-info" ref={contactInfoRef}>
              <div className="contact-item">
                <span className="contact-icon">📍</span>

                {/* <span>
                  Khasra No.-875, Kheda Dharampura, G.T Road, Chapraula,
                  GB Nagar, Ghaziabad, UP - 201001
                </span> */}
                <span>
                  Abcde
                </span>
              </div>

              <div className="contact-item">
                <span className="contact-icon">✉️</span>

                {/* <a href="mailto:salesaalliancelifts@gmail.com" className="contact-email">
                  salesaalliancelifts@gmail.com
                </a> */}
                <a href="mailto:abcde@gmail.com" className="contact-email">
                  abcde@gmail.com
                </a>
              </div>

              <div className="contact-item">
                <span className="contact-icon">📞</span>

                <a href="tel:+919876543210" className="contact-phone">
                  +91 9876543210
                </a>
              </div>
            </div>
          </div>

          <div className="contact-hero-right">
            <img
              src={contactImg}
              alt="Contact Alliance Lifts"
              className="hero-contact-image"
              ref={heroImageRef}
            />
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="contact-form-container">
           <div className="contact-form-header">
              <p className="contact-form-small" ref={contactSmallRef}>SEND MESSAGE</p>

               <h2 className="contact-form-title" ref={contactTitleRef}>
                 Request a Quote
               </h2>
          </div>

 <form className="contact-form" onSubmit={async (e) => {
                e.preventDefault()
                const { name, email, phone, message } = formData
                const service = selectedService?.value || 'N/A'
try {
                       await insert('contactMessages', { name, email, phone, service, message })
                       setSubmitMessage('Message sent successfully!')
                       const whatsappNumber = '919910589059'
                       const text = encodeURIComponent(
                         `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`
                       )
                       window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank')
                       setFormData({ name: '', email: '', phone: '', message: '' })
                     } catch {
                       setSubmitMessage('Error: Unable to send message. Please try again.')
                     }
              }}>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group phone-group">
                  <select
                    className="country-code"
                    aria-label="Country code"
                  >
                    <option value="+91">India (+91)</option>
                    <option value="+1">United States (+1)</option>
                    <option value="+44">United Kingdom (+44)</option>
                    <option value="+971">United Arab Emirates (+971)</option>
                    <option value="+966">Saudi Arabia (+966)</option>
                    <option value="+965">Kuwait (+965)</option>
                    <option value="+974">Qatar (+974)</option>
                    <option value="+968">Oman (+968)</option>
                    <option value="+973">Bahrain (+973)</option>
                    <option value="+49">Germany (+49)</option>
                    <option value="+33">France (+33)</option>
                    <option value="+39">Italy (+39)</option>
                    <option value="+34">Spain (+34)</option>
                    <option value="+31">Netherlands (+31)</option>
                    <option value="+41">Switzerland (+41)</option>
                    <option value="+7">Russia (+7)</option>
                    <option value="+86">China (+86)</option>
                    <option value="+81">Japan (+81)</option>
                    <option value="+65">Singapore (+65)</option>
                    <option value="+27">South Africa (+27)</option>
                    <option value="+90">Turkey (+90)</option>
                    <option value="+380">Ukraine (+380)</option>
                  </select>

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="phone-input"
                    aria-label="Phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <Select
                    options={serviceOptions}
                    value={selectedService}
                    onChange={setSelectedService}
                    placeholder="Select Service"
                    className="custom-service-select"
                    classNamePrefix="service"
                    isSearchable={false}
                  />
                </div>
              </div>

              <div className="form-group">
                <textarea
                  placeholder="Your Message"
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              {submitMessage && <p className="submit-message">{submitMessage}</p>}

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </section>

      <Footer />
    </>
  )
}