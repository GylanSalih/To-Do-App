import React from 'react';
import { useTodos } from '../../contexts/TodoContext';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Target,
  Calendar,
  BarChart3
} from 'lucide-react';
import styles from './TodoStats.module.scss';

const TodoStats: React.FC = () => {
  const { stats, categories, todos } = useTodos();

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  
  // Calculate productivity metrics
  const todayCompleted = todos.filter(todo => 
    todo.completed && 
    todo.updatedAt.toDateString() === new Date().toDateString()
  ).length;

  const thisWeekCompleted = todos.filter(todo => {
    if (!todo.completed) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return todo.updatedAt >= weekAgo;
  }).length;

  const urgentTodos = todos.filter(todo => 
    !todo.completed && 
    todo.priority === 'high' && 
    todo.dueDate && 
    todo.dueDate <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Due within 3 days
  ).length;

  return (
    <div className={styles.statsContainer}>
      <h2 className={styles.title}>
        <BarChart3 size={24} />
        Productivity Dashboard
      </h2>

      <div className={styles.metricsGrid}>
        {/* Overview Cards */}
        <div className={styles.metricCard}>
          <div className={styles.cardHeader}>
            <Target className={styles.cardIcon} />
            <h3>Overview</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.mainMetric}>
              <span className={styles.number}>{stats.total}</span>
              <span className={styles.label}>Total Todos</span>
            </div>
            <div className={styles.subMetrics}>
              <div className={styles.subMetric}>
                <CheckCircle2 size={16} className={styles.completed} />
                <span>{stats.completed} completed</span>
              </div>
              <div className={styles.subMetric}>
                <Circle size={16} className={styles.pending} />
                <span>{stats.pending} active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className={styles.metricCard}>
          <div className={styles.cardHeader}>
            <TrendingUp className={styles.cardIcon} />
            <h3>Completion Rate</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.progressCircle}>
              <svg viewBox="0 0 100 100" className={styles.progressSvg}>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className={styles.progressBackground}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className={styles.progressBar}
                  style={{
                    strokeDashoffset: `${283 - (283 * completionRate) / 100}`,
                  }}
                />
              </svg>
              <div className={styles.progressText}>
                <span className={styles.percentage}>{completionRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Productivity */}
        <div className={styles.metricCard}>
          <div className={styles.cardHeader}>
            <Calendar className={styles.cardIcon} />
            <h3>Productivity</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.productivityStats}>
              <div className={styles.productivityItem}>
                <span className={styles.productivityNumber}>{todayCompleted}</span>
                <span className={styles.productivityLabel}>Today</span>
              </div>
              <div className={styles.productivityItem}>
                <span className={styles.productivityNumber}>{thisWeekCompleted}</span>
                <span className={styles.productivityLabel}>This Week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {(stats.overdue > 0 || urgentTodos > 0) && (
          <div className={`${styles.metricCard} ${styles.alertCard}`}>
            <div className={styles.cardHeader}>
              <AlertTriangle className={styles.cardIcon} />
              <h3>Attention Needed</h3>
            </div>
            <div className={styles.cardContent}>
              {stats.overdue > 0 && (
                <div className={styles.alertItem}>
                  <Clock size={16} className={styles.overdue} />
                  <span>{stats.overdue} overdue tasks</span>
                </div>
              )}
              {urgentTodos > 0 && (
                <div className={styles.alertItem}>
                  <AlertTriangle size={16} className={styles.urgent} />
                  <span>{urgentTodos} urgent tasks due soon</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {categories.length > 0 && (
        <div className={styles.categorySection}>
          <h3 className={styles.sectionTitle}>Category Breakdown</h3>
          <div className={styles.categoryGrid}>
            {categories.map(category => {
              const count = stats.byCategory[category.id] || 0;
              const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              
              return (
                <div key={category.id} className={styles.categoryCard}>
                  <div className={styles.categoryHeader}>
                    <div 
                      className={styles.categoryColor}
                      style={{ backgroundColor: category.color }}
                    />
                    <span className={styles.categoryName}>{category.name}</span>
                  </div>
                  <div className={styles.categoryStats}>
                    <span className={styles.categoryCount}>{count}</span>
                    <span className={styles.categoryPercentage}>{percentage}%</span>
                  </div>
                  <div className={styles.categoryBar}>
                    <div 
                      className={styles.categoryProgress}
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: category.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3 className={styles.sectionTitle}>Quick Actions</h3>
        <div className={styles.actionButtons}>
          {stats.completed > 0 && (
            <button className={styles.actionButton}>
              Clear {stats.completed} completed todos
            </button>
          )}
          {stats.overdue > 0 && (
            <button className={`${styles.actionButton} ${styles.urgent}`}>
              Review {stats.overdue} overdue todos
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoStats;
