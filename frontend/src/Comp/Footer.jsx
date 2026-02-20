import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import "./Footer.css"
const Footer = () => {
  return (
    <div className="footer">
      <div className="title">
        <h2>Netaji High School</h2>
        <p>
          Netaji High School blends innovative learning with strong values to prepare students for a dynamic future.We empower every learner with knowledge, creativity, and confidence to thrive in a changing world.
        </p>
      </div>

      <div className="contact">
        <p><strong>Contact Us</strong></p>
        <p>Email: netajihighschool@gmail.com</p>
        <p>Phone: +91 8712919575</p>
      </div>

      <div className="follow">
        <p><strong>Follow Us</strong></p>
        <div className="icons">
          <span className="icon facebook"><FaFacebookF /></span>
          <span className="icon twitter"><FaTwitter /></span>
          <span className="icon instagram"><FaInstagram /></span>
        </div>
      </div>
      <div className="bottom">
        <p>© 2003 Netajihighschool. All rights reserved.</p>
      </div>
    </div>
  );
};
export default Footer;
