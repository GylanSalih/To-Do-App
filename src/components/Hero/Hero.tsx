import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Plus, Search, CheckCircle2, Circle, Flag } from 'lucide-react';
import styles from './Hero.module.scss';

const Hero: React.FC = () => {
  const [demoTodos, setDemoTodos] = useState([
    { id: 1, title: 'Build React Todo App', completed: true, priority: 'high' },
    { id: 2, title: 'Add TypeScript support', completed: true, priority: 'high' },
    { id: 3, title: 'Implement dark mode', completed: false, priority: 'medium' },
    { id: 4, title: 'Add drag & drop functionality', completed: false, priority: 'low' },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');

  const toggleTodo = (id: number) => {
    setDemoTodos(todos => 
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      setDemoTodos(todos => [
        ...todos, 
        { 
          id: Date.now(), 
          title: newTodo, 
          completed: false, 
          priority: 'medium' 
        }
      ]);
      setNewTodo('');
    }
  };

  const filteredTodos = demoTodos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>
          <Sparkles size={16} />
          <span>Modern React TypeScript Boilerplate</span>
        </div>
        
        <h1 className={styles.heroTitle}>
          Build Beautiful Apps
          <span className={styles.gradientText}> Faster</span>
        </h1>
        
        <p className={styles.heroDescription}>
          A modern, production-ready React TypeScript boilerplate with beautiful UI/UX, 
          smooth animations, and a comprehensive design system. Built for developers who 
          care about code quality and user experience.
        </p>
        
        <div className={styles.ctaButtons}>
          <Link to="/todos" className={styles.primaryButton}>
            Try Todo App
            <ArrowRight size={20} />
          </Link>
          <Link to="/" className={styles.secondaryButton}>
            Learn More
          </Link>
        </div>
      </div>
      
      <div className={styles.heroVisual}>
        <div className={styles.promoCard}>
          <div className={styles.promoHeader}>
            <div className={styles.promoTitle}>
              <span className={styles.titleIcon}>📝</span>
              <h3>Try our Todo App</h3>
            </div>
            <div className={styles.promoBadge}>Interactive Demo</div>
          </div>
          <div className={styles.todoDemo}>
              {/* Todo Input */}
              <div className={styles.todoInput}>
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                  placeholder="What needs to be done?"
                  className={styles.demoInput}
                />
                <button onClick={addTodo} className={styles.addButton}>
                  <Plus size={16} />
                </button>
              </div>

              {/* Todo Filters */}
              <div className={styles.todoFilters}>
                <div className={styles.searchDemo}>
                  <Search size={14} />
                  <input type="text" placeholder="Search todos..." className={styles.searchInput} />
                </div>
                <div className={styles.filterButtons}>
                  {['all', 'active', 'completed'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                    >
                      {f === 'active' && <Circle size={12} />}
                      {f === 'completed' && <CheckCircle2 size={12} />}
                      {f === 'all' && <Flag size={12} />}
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Todo List */}
              <div className={styles.todoList}>
                {filteredTodos.map(todo => (
                  <div 
                    key={todo.id} 
                    className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
                  >
                    <button 
                      onClick={() => toggleTodo(todo.id)}
                      className={styles.todoCheckbox}
                    >
                      {todo.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </button>
                    <span className={styles.todoTitle}>{todo.title}</span>
                    <span className={`${styles.todoPriority} ${styles[todo.priority]}`}>
                      {todo.priority}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.todoStats}>
                {demoTodos.filter(t => !t.completed).length} active, {demoTodos.filter(t => t.completed).length} completed
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
