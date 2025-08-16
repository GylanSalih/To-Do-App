import React, { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { TodoProvider, useTodos } from '../../contexts/TodoContext';
import TodoHeader from './TodoHeader';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoFilters from './TodoFilters';
import TodoStats from './TodoStats';
import { Loader2 } from 'lucide-react';
import styles from './TodoApp.module.scss';

const TodoAppContent: React.FC = () => {
  const { reorderTodos, isLoading } = useTodos();
  const [showStats, setShowStats] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (source.index !== destination.index) {
      reorderTodos(source.index, destination.index);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader2 className={styles.spinner} size={32} />
        <p>Loading your todos...</p>
      </div>
    );
  }

  return (
    <div className={styles.todoApp}>
      <div className={styles.container}>
        <TodoHeader showStats={showStats} onToggleStats={() => setShowStats(!showStats)} />
        
        {showStats && (
          <div className={styles.statsSection}>
            <TodoStats />
          </div>
        )}

        <div className={styles.mainContent}>
          <div className={styles.formSection}>
            <TodoForm />
          </div>

          <div className={styles.filtersSection}>
            <TodoFilters />
          </div>

          <div className={styles.listSection}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <TodoList />
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
};

const TodoApp: React.FC = () => {
  return (
    <TodoProvider>
      <TodoAppContent />
    </TodoProvider>
  );
};

export default TodoApp;
