import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  Todo,
  Category,
  TodoFilters,
  TodoStats,
  TodoHistory,
  TodoContextType,
  FilterType,
  Priority,
  SortBy,
  SortOrder,
  DEFAULT_CATEGORIES,
} from '../types/todo';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodos = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: React.ReactNode;
}

const LOCAL_STORAGE_KEYS = {
  TODOS: 'petalstack_todos',
  CATEGORIES: 'petalstack_categories',
  FILTERS: 'petalstack_filters',
  HISTORY: 'petalstack_history',
};

const DEFAULT_FILTERS: TodoFilters = {
  search: '',
  filter: 'all',
  category: undefined,
  priority: undefined,
  sortBy: 'order',
  sortOrder: 'asc',
  tags: [],
};

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  // State
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [filters, setFiltersState] = useState<TodoFilters>(DEFAULT_FILTERS);
  const [history, setHistory] = useState<TodoHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        // Load todos
        const savedTodos = localStorage.getItem(LOCAL_STORAGE_KEYS.TODOS);
        if (savedTodos) {
          const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            updatedAt: new Date(todo.updatedAt),
            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          }));
          setTodos(parsedTodos);
        }

        // Load categories
        const savedCategories = localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES);
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        }

        // Load filters
        const savedFilters = localStorage.getItem(LOCAL_STORAGE_KEYS.FILTERS);
        if (savedFilters) {
          setFiltersState({ ...DEFAULT_FILTERS, ...JSON.parse(savedFilters) });
        }

        // Load history
        const savedHistory = localStorage.getItem(LOCAL_STORAGE_KEYS.HISTORY);
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }));
          setHistory(parsedHistory);
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TODOS, JSON.stringify(todos));
    }
  }, [todos, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
  }, [categories, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.FILTERS, JSON.stringify(filters));
    }
  }, [filters, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.HISTORY, JSON.stringify(history));
    }
  }, [history, isLoading]);

  // Helper function to add to history
  const addToHistory = useCallback((action: TodoHistory['action'], todoId: string, previousState?: Partial<Todo>, newState?: Partial<Todo>) => {
    const historyItem: TodoHistory = {
      id: crypto.randomUUID(),
      action,
      todoId,
      timestamp: new Date(),
      previousState,
      newState,
    };

    setHistory(prev => {
      // Remove any history after current index (for redo functionality)
      const newHistory = prev.slice(0, historyIndex + 1);
      // Add new item
      newHistory.push(historyItem);
      // Limit history to 50 items
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // Todo Actions
  const addTodo = useCallback((todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      order: todos.length,
    };

    setTodos(prev => [...prev, newTodo]);
    addToHistory('create', newTodo.id, undefined, newTodo);
  }, [todos.length, addToHistory]);

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        const updatedTodo = {
          ...todo,
          ...updates,
          updatedAt: new Date(),
        };
        addToHistory('update', id, todo, updatedTodo);
        return updatedTodo;
      }
      return todo;
    }));
  }, [addToHistory]);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => {
      const todoToDelete = prev.find(todo => todo.id === id);
      if (todoToDelete) {
        addToHistory('delete', id, todoToDelete);
      }
      return prev.filter(todo => todo.id !== id);
    });
  }, [addToHistory]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        const updatedTodo = {
          ...todo,
          completed: !todo.completed,
          updatedAt: new Date(),
        };
        addToHistory(updatedTodo.completed ? 'complete' : 'uncomplete', id, todo, updatedTodo);
        return updatedTodo;
      }
      return todo;
    }));
  }, [addToHistory]);

  const duplicateTodo = useCallback((id: string) => {
    const todoToDuplicate = todos.find(todo => todo.id === id);
    if (todoToDuplicate) {
      const duplicatedTodo: Todo = {
        ...todoToDuplicate,
        id: crypto.randomUUID(),
        title: `${todoToDuplicate.title} (Copy)`,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        order: todos.length,
      };
      setTodos(prev => [...prev, duplicatedTodo]);
      addToHistory('create', duplicatedTodo.id, undefined, duplicatedTodo);
    }
  }, [todos, addToHistory]);

  const reorderTodos = useCallback((startIndex: number, endIndex: number) => {
    setTodos(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      // Update order property
      return result.map((todo, index) => ({
        ...todo,
        order: index,
        updatedAt: new Date(),
      }));
    });
  }, []);

  const bulkDeleteTodos = useCallback((ids: string[]) => {
    setTodos(prev => {
      const deletedTodos = prev.filter(todo => ids.includes(todo.id));
      deletedTodos.forEach(todo => {
        addToHistory('delete', todo.id, todo);
      });
      return prev.filter(todo => !ids.includes(todo.id));
    });
  }, [addToHistory]);

  const bulkCompleteTodos = useCallback((ids: string[]) => {
    setTodos(prev => prev.map(todo => {
      if (ids.includes(todo.id) && !todo.completed) {
        const updatedTodo = {
          ...todo,
          completed: true,
          updatedAt: new Date(),
        };
        addToHistory('complete', todo.id, todo, updatedTodo);
        return updatedTodo;
      }
      return todo;
    }));
  }, [addToHistory]);

  const bulkUpdateCategory = useCallback((ids: string[], categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    setTodos(prev => prev.map(todo => {
      if (ids.includes(todo.id)) {
        const updatedTodo = {
          ...todo,
          category,
          updatedAt: new Date(),
        };
        addToHistory('update', todo.id, todo, updatedTodo);
        return updatedTodo;
      }
      return todo;
    }));
  }, [categories, addToHistory]);

  // Category Actions
  const addCategory = useCallback((categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: crypto.randomUUID(),
    };
    setCategories(prev => [...prev, newCategory]);
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(category =>
      category.id === id ? { ...category, ...updates } : category
    ));
    
    // Update todos with this category
    setTodos(prev => prev.map(todo => {
      if (todo.category.id === id) {
        return {
          ...todo,
          category: { ...todo.category, ...updates },
          updatedAt: new Date(),
        };
      }
      return todo;
    }));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    const defaultCategory = categories.find(c => c.id === 'personal') || categories[0];
    
    // Move todos to default category
    setTodos(prev => prev.map(todo => {
      if (todo.category.id === id) {
        return {
          ...todo,
          category: defaultCategory,
          updatedAt: new Date(),
        };
      }
      return todo;
    }));
    
    setCategories(prev => prev.filter(category => category.id !== id));
  }, [categories]);

  // Filter Actions
  const setFilters = useCallback((newFilters: Partial<TodoFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  // History Actions
  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      const historyItem = history[historyIndex];
      
      switch (historyItem.action) {
        case 'create':
          setTodos(prev => prev.filter(todo => todo.id !== historyItem.todoId));
          break;
        case 'delete':
          if (historyItem.previousState) {
            setTodos(prev => [...prev, historyItem.previousState as Todo]);
          }
          break;
        case 'update':
        case 'complete':
        case 'uncomplete':
          if (historyItem.previousState) {
            setTodos(prev => prev.map(todo =>
              todo.id === historyItem.todoId
                ? { ...todo, ...historyItem.previousState }
                : todo
            ));
          }
          break;
      }
      
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const historyItem = history[historyIndex + 1];
      
      switch (historyItem.action) {
        case 'create':
          if (historyItem.newState) {
            setTodos(prev => [...prev, historyItem.newState as Todo]);
          }
          break;
        case 'delete':
          setTodos(prev => prev.filter(todo => todo.id !== historyItem.todoId));
          break;
        case 'update':
        case 'complete':
        case 'uncomplete':
          if (historyItem.newState) {
            setTodos(prev => prev.map(todo =>
              todo.id === historyItem.todoId
                ? { ...todo, ...historyItem.newState }
                : todo
            ));
          }
          break;
      }
      
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;

  // Utility functions
  const clearCompleted = useCallback(() => {
    const completedIds = todos.filter(todo => todo.completed).map(todo => todo.id);
    bulkDeleteTodos(completedIds);
  }, [todos, bulkDeleteTodos]);

  const exportTodos = useCallback(() => {
    const exportData = {
      todos,
      categories,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(exportData, null, 2);
  }, [todos, categories]);

  const importTodos = useCallback((data: string) => {
    try {
      const importData = JSON.parse(data);
      
      if (importData.todos && Array.isArray(importData.todos)) {
        const importedTodos = importData.todos.map((todo: any) => ({
          ...todo,
          id: crypto.randomUUID(), // Generate new IDs to avoid conflicts
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        }));
        setTodos(prev => [...prev, ...importedTodos]);
      }
      
      if (importData.categories && Array.isArray(importData.categories)) {
        const importedCategories = importData.categories.filter(
          (importedCat: Category) => !categories.some(cat => cat.name === importedCat.name)
        );
        setCategories(prev => [...prev, ...importedCategories]);
      }
    } catch (error) {
      console.error('Error importing todos:', error);
      throw new Error('Invalid import data format');
    }
  }, [categories]);

  // Computed values
  const getFilteredTodos = useCallback(() => {
    let filtered = [...todos];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchLower) ||
        todo.description?.toLowerCase().includes(searchLower) ||
        todo.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    switch (filters.filter) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      case 'overdue':
        filtered = filtered.filter(todo => 
          !todo.completed && 
          todo.dueDate && 
          todo.dueDate < new Date()
        );
        break;
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(todo => todo.category.id === filters.category);
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(todo => todo.priority === filters.priority);
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(todo =>
        filters.tags.every(tag => todo.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        case 'dueDate':
          aValue = a.dueDate || new Date('9999-12-31');
          bValue = b.dueDate || new Date('9999-12-31');
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'order':
        default:
          aValue = a.order;
          bValue = b.order;
          break;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [todos, filters]);

  const stats: TodoStats = useMemo(() => {
    const now = new Date();
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const overdue = todos.filter(todo => 
      !todo.completed && 
      todo.dueDate && 
      todo.dueDate < now
    ).length;
    const highPriority = todos.filter(todo => 
      !todo.completed && 
      todo.priority === 'high'
    ).length;
    
    const byCategory = categories.reduce((acc, category) => {
      acc[category.id] = todos.filter(todo => todo.category.id === category.id).length;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      completed,
      pending,
      overdue,
      highPriority,
      byCategory,
    };
  }, [todos, categories]);

  const contextValue: TodoContextType = {
    // State
    todos,
    categories,
    filters,
    stats,
    history,
    isLoading,
    
    // Todo Actions
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    duplicateTodo,
    reorderTodos,
    bulkDeleteTodos,
    bulkCompleteTodos,
    bulkUpdateCategory,
    
    // Category Actions
    addCategory,
    updateCategory,
    deleteCategory,
    
    // Filter Actions
    setFilters,
    resetFilters,
    
    // History Actions
    undo,
    redo,
    canUndo,
    canRedo,
    
    // Utility
    clearCompleted,
    exportTodos,
    importTodos,
    getFilteredTodos,
  };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};
