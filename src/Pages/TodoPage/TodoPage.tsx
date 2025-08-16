import React from 'react';
import TodoApp from '../../components/Todo/TodoApp';
import styles from './TodoPage.module.scss';

const TodoPage: React.FC = () => {
  return (
    <div className={styles.todoPage}>
      <TodoApp />
    </div>
  );
};

export default TodoPage;
