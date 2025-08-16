import React from 'react';
import { useTodos } from '../../contexts/TodoContext';
import { FilterType, Priority, SortBy, SortOrder } from '../../types/todo';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  X, 
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle
} from 'lucide-react';
import styles from './TodoFilters.module.scss';

const TodoFilters: React.FC = () => {
  const { filters, setFilters, resetFilters, categories, getFilteredTodos } = useTodos();
  const filteredTodos = getFilteredTodos();

  const filterOptions: { value: FilterType; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All', icon: <Circle size={16} /> },
    { value: 'active', label: 'Active', icon: <Circle size={16} /> },
    { value: 'completed', label: 'Completed', icon: <CheckCircle2 size={16} /> },
    { value: 'overdue', label: 'Overdue', icon: <Clock size={16} /> },
  ];

  const priorityOptions: { value: Priority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: 'order', label: 'Manual Order' },
    { value: 'createdAt', label: 'Date Created' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' },
  ];

  const hasActiveFilters = 
    filters.search || 
    filters.filter !== 'all' || 
    filters.category || 
    filters.priority || 
    filters.tags.length > 0;

  return (
    <div className={styles.filters}>
      <div className={styles.searchSection}>
        <div className={styles.searchGroup}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            placeholder="Search todos..."
            className={styles.searchInput}
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className={styles.clearButton}
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className={styles.resultsCount}>
          {filteredTodos.length} {filteredTodos.length === 1 ? 'todo' : 'todos'}
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <Filter className={styles.filterIcon} size={16} />
          <span className={styles.filterLabel}>Status:</span>
          <div className={styles.filterButtons}>
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setFilters({ filter: option.value })}
                className={`${styles.filterButton} ${
                  filters.filter === option.value ? styles.active : ''
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Category:</span>
          <select
            value={filters.category || ''}
            onChange={(e) => setFilters({ category: e.target.value || undefined })}
            className={styles.select}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <AlertTriangle className={styles.filterIcon} size={16} />
          <span className={styles.filterLabel}>Priority:</span>
          <select
            value={filters.priority || ''}
            onChange={(e) => setFilters({ priority: e.target.value as Priority || undefined })}
            className={styles.select}
          >
            <option value="">All Priorities</option>
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.sortSection}>
        <div className={styles.sortGroup}>
          <ArrowUpDown className={styles.sortIcon} size={16} />
          <span className={styles.sortLabel}>Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ sortBy: e.target.value as SortBy })}
            className={styles.select}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setFilters({ 
              sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
            })}
            className={styles.sortOrderButton}
            title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <ArrowUpDown 
              size={16} 
              className={filters.sortOrder === 'desc' ? styles.flipped : ''} 
            />
          </button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className={styles.resetButton}
          >
            <X size={16} />
            Clear Filters
          </button>
        )}
      </div>

      {filters.tags.length > 0 && (
        <div className={styles.tagsSection}>
          <span className={styles.tagsLabel}>Tags:</span>
          <div className={styles.tagsList}>
            {filters.tags.map(tag => (
              <span key={tag} className={styles.tag}>
                #{tag}
                <button
                  onClick={() => setFilters({ 
                    tags: filters.tags.filter(t => t !== tag) 
                  })}
                  className={styles.tagRemove}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoFilters;
