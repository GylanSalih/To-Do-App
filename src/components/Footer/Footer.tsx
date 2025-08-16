import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import styles from './footer.module.scss';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Social Icons */}
          <div className={styles.socialIcons}>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={styles.socialIcon}
            >
              <Github size={20} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Twitter"
              className={styles.socialIcon}
            >
              <Twitter size={20} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={styles.socialIcon}
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="mailto:contact@example.com"
              aria-label="Email"
              className={styles.socialIcon}
            >
              <Mail size={20} />
            </a>
          </div>

          {/* Simple Copyright */}
          <div className={styles.copyright}>
            <p>© {currentYear} PetalStack Todo App</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
