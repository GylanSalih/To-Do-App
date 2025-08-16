import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckSquare } from 'lucide-react';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import styles from './Home.module.scss';

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2>Ready to Get Started?</h2>
        <p>Start organizing your tasks with our powerful todo application today</p>
        <div className={styles.ctaButtons}>
          <Link to="/todos" className={styles.primaryButton}>
            Try Todo App
            <CheckSquare size={20} />
          </Link>
          <Link to="/" className={styles.secondaryButton}>
            Learn More
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
