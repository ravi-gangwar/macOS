"use client"
import { useState } from 'react'
import WindowWrapper from '../hoc/WindowWrapper'
import { Mail, Phone, MapPin, Linkedin, Github, Copy, Check } from 'lucide-react'
import { useTextSize } from '../hooks/useTextSize'

function Contact() {
  const { getTextSize } = useTextSize();
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setEmailCopied(true);
      setTimeout(() => {
        setEmailCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };
  const contactInfo = {
    name: "Ravi Gangwar",
    location: "Kanpur, India",
    email: "ravigangwar7465@gmail.com",
    phone: "+91 9389968605",
    socialLinks: [
      { name: "LinkedIn", url: "https://www.linkedin.com/in/ravigangwar", icon: Linkedin },
      { name: "GitHub", url: "https://github.com/ravigangwar", icon: Github },
      { name: "Twitter", url: "https://twitter.com/ravigangwar", icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.2033 1.875H17.9599L11.9374 8.75833L19.0224 18.125H13.4749L9.12992 12.4442L4.15826 18.125H1.39992L7.84159 10.7625L1.04492 1.875H6.73326L10.6608 7.0675L15.2033 1.875ZM14.2358 16.475H15.7633L5.90326 3.43833H4.26409L14.2358 16.475Z" fill="currentColor"/>
        </svg>
      )},
      { name: "LeetCode", url: "https://leetcode.com/ravigangwar", icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13.8514 3L4.62921 12C3.79026 12.8187 3.79026 14.1462 4.62921 14.9649L10.1841 20.386C11.0231 21.2047 12.3833 21.2047 13.2222 20.386L15.9997 17.6754" />
          <path d="M6.33203 10.3377L10.1836 6.57889C11.0226 5.76016 12.3828 5.76016 13.2217 6.57889L15.9992 9.28943" />
          <path d="M11 13H20" />
        </svg>
      )},
      { name: "HackerRank", url: "https://www.hackerrank.com/ravigangwar", icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19.1598 5.98403C18.0713 5.12444 15.9777 3.70911 12.9877 2.72647C12.5283 2.57549 12.2986 2.5 12 2.5C11.7014 2.5 11.4717 2.57549 11.0123 2.72647C8.02225 3.70911 5.92875 5.12444 4.84015 5.98403C4.45813 6.28569 4.26712 6.43652 4.08284 6.76015C3.89856 7.08378 3.86229 7.34868 3.78974 7.87849C3.65684 8.84907 3.5 10.3451 3.5 12C3.5 13.6549 3.65684 15.1509 3.78974 16.1215C3.86229 16.6513 3.89856 16.9162 4.08284 17.2398C4.26712 17.5635 4.45813 17.7143 4.84015 18.016C5.92875 18.8756 8.02225 20.2909 11.0123 21.2735C11.4717 21.4245 11.7014 21.5 12 21.5C12.2986 21.5 12.5283 21.4245 12.9877 21.2735C15.9777 20.2909 18.0713 18.8756 19.1598 18.016C19.5419 17.7143 19.7329 17.5635 19.9172 17.2398C20.1014 16.9162 20.1377 16.6513 20.2103 16.1215C20.3432 15.1509 20.5 13.6549 20.5 12C20.5 10.3451 20.3432 8.84907 20.2103 7.87849C20.1377 7.34868 20.1014 7.08378 19.9172 6.76015C19.7329 6.43652 19.5419 6.28569 19.1598 5.98403Z" />
          <path d="M9.5 8V15" />
          <path d="M9.5 12H14.5" />
          <path d="M15.5 16H13.5L14.5 17L15.5 16Z" />
          <path d="M8.5 8L10.5 8L9.5 7L8.5 8Z" />
          <path d="M14.5 9V16" />
        </svg>
      )},

    ]
  }

  return (
    <div className="contact-window">
      <div className="contact-header">
        <div className="contact-avatar">
          <div className="avatar-circle">
            <span className="avatar-text">RG</span>
          </div>
        </div>
        <div className="contact-name-section">
          <h1 className={`contact-name ${getTextSize('lg')} font-normal text-gray-900 dark:text-gray-100 mb-0.5`}>{contactInfo.name}</h1>
          <p className={`contact-title ${getTextSize('sm')} text-gray-600 dark:text-gray-400`}>Software Engineer</p>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-items">
          <div className="contact-item">
            <MapPin className="contact-icon" />
            <div className="contact-item-content">
              <span className={`contact-label ${getTextSize('sm')} text-gray-500 dark:text-gray-400 uppercase tracking-wide`}>Location</span>
              <span className={`contact-value ${getTextSize('sm')} text-gray-900 dark:text-gray-100 font-normal`}>{contactInfo.location}</span>
            </div>
          </div>
          
          <div className="contact-item">
            <Mail className="contact-icon" />
            <div className="contact-item-content">
              <span className={`contact-label ${getTextSize('sm')} text-gray-500 dark:text-gray-400 uppercase tracking-wide`}>Email</span>
              <div className="flex items-center gap-2">
                <a href={`mailto:${contactInfo.email}`} className={`contact-value contact-link ${getTextSize('sm')} text-gray-900 dark:text-gray-100 font-normal hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}>
                  {contactInfo.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="contact-copy-btn"
                  title={emailCopied ? "Copied!" : "Copy email"}
                >
                  {emailCopied ? (
                    <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="contact-item">
            <Phone className="contact-icon" />
            <div className="contact-item-content">
              <span className={`contact-label ${getTextSize('sm')} text-gray-500 dark:text-gray-400 uppercase tracking-wide`}>Phone</span>
              <a href={`tel:${contactInfo.phone}`} className={`contact-value contact-link ${getTextSize('sm')} text-gray-900 dark:text-gray-100 font-normal hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}>
                {contactInfo.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="contact-social">
          <div className="contact-social-icons">
            {contactInfo.socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-icon"
                  title={link.name}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const ContactWindow = WindowWrapper(Contact, "contact");
export default ContactWindow

