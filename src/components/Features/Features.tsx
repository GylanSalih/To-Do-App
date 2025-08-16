import React from 'react';
import { CheckSquare, Move, Calendar, Flag, FolderOpen, Search, Filter, BarChart3 } from 'lucide-react';
import styles from './Features.module.scss';

const Features: React.FC = () => {
  return (
    <section className={styles.features}>
      <div className={styles.sectionHeader}>
        <h2>Why Choose Our Todo App?</h2>
        <p>The most powerful and elegant todo application you'll ever use</p>
      </div>
      
      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <div className={styles.icon}>
            <CheckSquare size={24} />
          </div>
          <h3>Smart Task Management</h3>
          <p>Create, organize, and complete tasks with ease. Mark as done, edit on-the-fly, and never lose track of your goals</p>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.icon}>
            <Flag size={24} />
          </div>
          <h3>Priority System</h3>
          <p>Set High, Medium, or Low priorities to focus on what matters most. Visual indicators keep you on track</p>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.icon}>
            <FolderOpen size={24} />
          </div>
          <h3>Categories & Organization</h3>
          <p>Organize todos by Work, Personal, Shopping, or custom categories. Keep your life perfectly structured</p>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.icon}>
            <Calendar size={24} />
          </div>
          <h3>Due Dates & Reminders</h3>
          <p>Set due dates to never miss deadlines. See overdue tasks instantly and stay ahead of your schedule</p>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.icon}>
            <Search size={24} />
          </div>
          <h3>Powerful Search & Filters</h3>
          <p>Find any todo instantly with advanced search. Filter by status, priority, category, or tags for laser focus</p>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.icon}>
            <Move size={24} />
          </div>
          <h3>Drag & Drop Ordering</h3>
          <p>Reorder your todos with smooth drag & drop. Arrange by importance or just the way you like it</p>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.icon}>
            <BarChart3 size={24} />
          </div>
          <h3>Progress Analytics</h3>
          <p>Track your productivity with detailed stats. See completion rates, category breakdown, and achievement trends</p>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.icon}>
            <Filter size={24} />
          </div>
          <h3>Dark Mode & Themes</h3>
          <p>Switch between beautiful light and dark themes instantly. Easy on the eyes, perfect for any time of day</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
