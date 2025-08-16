import React from 'react';
import { useTodos } from '../../contexts/TodoContext';
import { 
  BarChart3, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Undo2, 
  Redo2,
  Download,
  Upload,
  Trash2
} from 'lucide-react';
import styles from './TodoHeader.module.scss';

interface TodoHeaderProps {
  showStats: boolean;
  onToggleStats: () => void;
}

const TodoHeader: React.FC<TodoHeaderProps> = ({ showStats, onToggleStats }) => {
  const { 
    stats, 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    exportTodos, 
    importTodos, 
    clearCompleted 
  } = useTodos();

  const handleExport = () => {
    const data = exportTodos();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result as string;
          try {
            importTodos(data);
          } catch (error) {
            alert('Error importing todos. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <header className={styles.header}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          <CheckCircle2 className={styles.titleIcon} />
          Todo App
        </h1>
        <p className={styles.subtitle}>
          Organize your life, one task at a time
        </p>
      </div>

      <div className={styles.quickStats}>
        <div className={styles.statItem}>
          <Circle size={16} />
          <span>{stats.pending}</span>
          <span className={styles.label}>Active</span>
        </div>
        <div className={styles.statItem}>
          <CheckCircle2 size={16} />
          <span>{stats.completed}</span>
          <span className={styles.label}>Done</span>
        </div>
        {stats.overdue > 0 && (
          <div className={`${styles.statItem} ${styles.overdue}`}>
            <Clock size={16} />
            <span>{stats.overdue}</span>
            <span className={styles.label}>Overdue</span>
          </div>
        )}
        {stats.highPriority > 0 && (
          <div className={`${styles.statItem} ${styles.highPriority}`}>
            <AlertTriangle size={16} />
            <span>{stats.highPriority}</span>
            <span className={styles.label}>High Priority</span>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionButton} ${showStats ? styles.active : ''}`}
          onClick={onToggleStats}
          title="Toggle Statistics"
        >
          <BarChart3 size={20} />
        </button>

        <button
          className={styles.actionButton}
          onClick={undo}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo2 size={20} />
        </button>

        <button
          className={styles.actionButton}
          onClick={redo}
          disabled={!canRedo}
          title="Redo"
        >
          <Redo2 size={20} />
        </button>

        <div className={styles.divider} />

        <button
          className={styles.actionButton}
          onClick={handleExport}
          title="Export Todos"
        >
          <Download size={20} />
        </button>

        <button
          className={styles.actionButton}
          onClick={handleImport}
          title="Import Todos"
        >
          <Upload size={20} />
        </button>

        <div className={styles.divider} />

        <button
          className={`${styles.actionButton} ${styles.danger}`}
          onClick={clearCompleted}
          disabled={stats.completed === 0}
          title="Clear Completed"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </header>
  );
};

export default TodoHeader;
