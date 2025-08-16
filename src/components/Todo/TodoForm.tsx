import React, { useState } from 'react';
import { useTodos } from '../../contexts/TodoContext';
import { Priority, Category, DEFAULT_CATEGORIES } from '../../types/todo';
import { 
  Plus, 
  Calendar, 
  Flag, 
  FolderOpen, 
  Tag, 
  X,
  AlignLeft 
} from 'lucide-react';
import styles from './TodoForm.module.scss';

const TodoForm: React.FC = () => {
  const { addTodo, categories } = useTodos();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    categoryId: 'personal',
    dueDate: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const selectedCategory = categories.find(c => c.id === formData.categoryId) || DEFAULT_CATEGORIES[0];

    addTodo({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      completed: false,
      priority: formData.priority,
      category: selectedCategory,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      tags: formData.tags,
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      categoryId: 'personal',
      dueDate: '',
      tags: [],
    });
    setTagInput('');
    setIsExpanded(false);
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isExpanded) {
        handleSubmit(e);
      } else {
        setIsExpanded(true);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.mainInput}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsExpanded(true)}
            placeholder="What needs to be done?"
            className={styles.titleInput}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!formData.title.trim()}
            className={styles.addButton}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.expandedForm}>
          <div className={styles.descriptionSection}>
            <div className={styles.inputGroup}>
              <AlignLeft className={styles.inputIcon} size={16} />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add a description (optional)"
                className={styles.descriptionInput}
                rows={2}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <Flag className={styles.inputIcon} size={16} />
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
                className={styles.select}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <FolderOpen className={styles.inputIcon} size={16} />
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className={styles.select}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <Calendar className={styles.inputIcon} size={16} />
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className={styles.dateInput}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className={styles.inputGroup}>
              <Tag className={styles.inputIcon} size={16} />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tags"
                className={styles.tagInput}
              />
              {tagInput.trim() && (
                <button
                  type="button"
                  onClick={handleAddTag}
                  className={styles.tagAddButton}
                >
                  <Plus size={14} />
                </button>
              )}
            </div>
          </div>

          {formData.tags.length > 0 && (
            <div className={styles.tagsDisplay}>
              {formData.tags.map(tag => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className={styles.tagRemove}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim()}
              className={styles.submitButton}
            >
              Add Todo
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default TodoForm;
