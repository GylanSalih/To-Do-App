import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { useTodos } from '../../contexts/TodoContext';
import TodoItem from './TodoItem';
import { CheckCircle2, Circle, Inbox } from 'lucide-react';
import styles from './TodoList.module.scss';

const TodoList: React.FC = () => {
  const { getFilteredTodos, bulkDeleteTodos, bulkCompleteTodos } = useTodos();
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const filteredTodos = getFilteredTodos();

  const handleSelectTodo = (todoId: string, selected: boolean) => {
    setSelectedTodos(prev => {
      if (selected) {
        return [...prev, todoId];
      } else {
        return prev.filter(id => id !== todoId);
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTodos.length === filteredTodos.length) {
      setSelectedTodos([]);
    } else {
      setSelectedTodos(filteredTodos.map(todo => todo.id));
    }
  };

  const handleBulkComplete = () => {
    bulkCompleteTodos(selectedTodos);
    setSelectedTodos([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTodos.length} todos?`)) {
      bulkDeleteTodos(selectedTodos);
      setSelectedTodos([]);
    }
  };

  if (filteredTodos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Inbox className={styles.emptyIcon} size={48} />
        <h3 className={styles.emptyTitle}>No todos found</h3>
        <p className={styles.emptyDescription}>
          Create your first todo or adjust your filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.todoList}>
      {selectedTodos.length > 0 && (
        <div className={styles.bulkActions}>
          <div className={styles.bulkInfo}>
            <span>{selectedTodos.length} selected</span>
          </div>
          <div className={styles.bulkButtons}>
            <button
              onClick={handleBulkComplete}
              className={styles.bulkButton}
            >
              <CheckCircle2 size={16} />
              Complete All
            </button>
            <button
              onClick={handleBulkDelete}
              className={`${styles.bulkButton} ${styles.danger}`}
            >
              Delete All
            </button>
            <button
              onClick={() => setSelectedTodos([])}
              className={styles.bulkButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={styles.listHeader}>
        <button
          onClick={handleSelectAll}
          className={styles.selectAllButton}
          title={selectedTodos.length === filteredTodos.length ? 'Deselect All' : 'Select All'}
        >
          {selectedTodos.length === filteredTodos.length ? (
            <CheckCircle2 size={16} />
          ) : (
            <Circle size={16} />
          )}
        </button>
        <span className={styles.listTitle}>
          {filteredTodos.length} {filteredTodos.length === 1 ? 'todo' : 'todos'}
        </span>
      </div>

      <Droppable droppableId="todos">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`${styles.listContainer} ${
              snapshot.isDraggingOver ? styles.draggingOver : ''
            }`}
          >
            {filteredTodos.map((todo, index) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                index={index}
                isSelected={selectedTodos.includes(todo.id)}
                onSelect={handleSelectTodo}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TodoList;
