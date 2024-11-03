// About.jsx
import React, { useState } from 'react';
import './About.css';
import { aboutText, faqs } from '../assets/aboutData';

const About = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Toggle the expanded state for each FAQ item
  const toggleAnswer = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="about-container">
      
      {/* About This Platform Section */}
      <section className="about-section">
        <h2 className="about-heading">About This Platform</h2>
        {aboutText.map((paragraph, index) => (
          <p key={index} className="about-text">
            {paragraph}
          </p>
        ))}
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="about-heading">Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button
              onClick={() => toggleAnswer(index)}
              className={`faq-button ${expandedIndex === index ? 'active' : ''}`}
            >
              <span>{faq.question}</span>
              <span className="toggle-icon">
                {expandedIndex === index ? '−' : '+'}
              </span>
            </button>
            {expandedIndex === index && (
              <p className="faq-answer">{faq.answer}</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default About;
