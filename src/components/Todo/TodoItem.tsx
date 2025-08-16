import React, { useState, useRef, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useTodos } from '../../contexts/TodoContext';
import { Todo, Priority, PRIORITY_COLORS } from '../../types/todo';
import {
  CheckCircle2,
  Circle,
  GripVertical,
  Calendar,
  Flag,
  Tag,
  MoreHorizontal,
  Edit2,
  Copy,
  Trash2,
  Clock,
  AlignLeft,
  X,
  Check,
  FolderOpen,
} from 'lucide-react';
import styles from './TodoItem.module.scss';

interface TodoItemProps {
  todo: Todo;
  index: number;
  isSelected: boolean;
  onSelect: (todoId: string, selected: boolean) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, index, isSelected, onSelect }) => {
  const { toggleTodo, updateTodo, deleteTodo, duplicateTodo, categories } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    categoryId: todo.category.id,
    dueDate: todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '',
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && titleRef.current) {
      titleRef.current.focus();
      titleRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveEdit = () => {
    if (!editData.title.trim()) return;

    const selectedCategory = categories.find(c => c.id === editData.categoryId) || todo.category;

    updateTodo(todo.id, {
      title: editData.title.trim(),
      description: editData.description.trim() || undefined,
      priority: editData.priority,
      category: selectedCategory,
      dueDate: editData.dueDate ? new Date(editData.dueDate) : undefined,
    });

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      categoryId: todo.category.id,
      dueDate: todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '',
    });
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const isOverdue = todo.dueDate && !todo.completed && todo.dueDate < new Date();
  const isDueSoon = todo.dueDate && !todo.completed && todo.dueDate <= new Date(Date.now() + 24 * 60 * 60 * 1000);

  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${styles.todoItem} ${
            todo.completed ? styles.completed : ''
          } ${isSelected ? styles.selected : ''} ${
            snapshot.isDragging ? styles.dragging : ''
          } ${isOverdue ? styles.overdue : ''}`}
        >
          <div className={styles.dragHandle} {...provided.dragHandleProps}>
            <GripVertical size={16} />
          </div>

          <button
            className={styles.checkbox}
            onClick={() => onSelect(todo.id, !isSelected)}
          >
            {isSelected ? <CheckCircle2 size={16} /> : <Circle size={16} />}
          </button>

          <button
            className={styles.completeButton}
            onClick={() => toggleTodo(todo.id)}
          >
            {todo.completed ? (
              <CheckCircle2 size={20} className={styles.completedIcon} />
            ) : (
              <Circle size={20} />
            )}
          </button>

          <div className={styles.content}>
            {isEditing ? (
              <div className={styles.editForm}>
                <div className={styles.editRow}>
                  <input
                    ref={titleRef}
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    onKeyPress={handleKeyPress}
                    className={styles.editInput}
                    placeholder="Todo title"
                  />
                </div>

                <div className={styles.editRow}>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    onKeyPress={handleKeyPress}
                    className={styles.editTextarea}
                    placeholder="Description (optional)"
                    rows={2}
                  />
                </div>

                <div className={styles.editControls}>
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value as Priority }))}
                    className={styles.editSelect}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>

                  <select
                    value={editData.categoryId}
                    onChange={(e) => setEditData(prev => ({ ...prev, categoryId: e.target.value }))}
                    className={styles.editSelect}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={editData.dueDate}
                    onChange={(e) => setEditData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className={styles.editSelect}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className={styles.editActions}>
                  <button
                    onClick={handleCancelEdit}
                    className={styles.editButton}
                  >
                    <X size={14} />
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className={`${styles.editButton} ${styles.save}`}
                    disabled={!editData.title.trim()}
                  >
                    <Check size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.main}>
                  <h3 className={styles.title}>{todo.title}</h3>
                  {todo.description && (
                    <p className={styles.description}>{todo.description}</p>
                  )}
                </div>

                <div className={styles.metadata}>
                  <div className={styles.badges}>
                    <span
                      className={styles.priorityBadge}
                      style={{ backgroundColor: PRIORITY_COLORS[todo.priority] }}
                    >
                      <Flag size={12} />
                      {todo.priority}
                    </span>

                    <span
                      className={styles.categoryBadge}
                      style={{ color: todo.category.color }}
                    >
                      <FolderOpen size={12} />
                      {todo.category.name}
                    </span>

                    {todo.dueDate && (
                      <span
                        className={`${styles.dueBadge} ${
                          isOverdue ? styles.overdueBadge : isDueSoon ? styles.dueSoonBadge : ''
                        }`}
                      >
                        <Clock size={12} />
                        {formatDueDate(todo.dueDate)}
                      </span>
                    )}

                    {todo.tags.length > 0 && (
                      <div className={styles.tags}>
                        <Tag size={12} />
                        <span className={styles.tagCount}>
                          {todo.tags.length} {todo.tags.length === 1 ? 'tag' : 'tags'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={styles.timestamps}>
                    <span className={styles.created}>
                      Created {todo.createdAt.toLocaleDateString()}
                    </span>
                    {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
                      <span className={styles.updated}>
                        Updated {todo.updatedAt.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div className={styles.actions}>
              <button
                className={styles.actionButton}
                onClick={() => setIsEditing(true)}
                title="Edit"
              >
                <Edit2 size={16} />
              </button>

              <div className={styles.menuWrapper} ref={menuRef}>
                <button
                  className={styles.actionButton}
                  onClick={() => setShowMenu(!showMenu)}
                  title="More options"
                >
                  <MoreHorizontal size={16} />
                </button>

                {showMenu && (
                  <div className={styles.menu}>
                    <button
                      onClick={() => {
                        duplicateTodo(todo.id);
                        setShowMenu(false);
                      }}
                      className={styles.menuItem}
                    >
                      <Copy size={14} />
                      Duplicate
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this todo?')) {
                          deleteTodo(todo.id);
                        }
                        setShowMenu(false);
                      }}
                      className={`${styles.menuItem} ${styles.danger}`}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TodoItem;
