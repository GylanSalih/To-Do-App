// Todo Types and Interfaces
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  highPriority: number;
  byCategory: Record<string, number>;
}

export interface TodoHistory {
  id: string;
  action: 'create' | 'update' | 'delete' | 'complete' | 'uncomplete';
  todoId: string;
  timestamp: Date;
  previousState?: Partial<Todo>;
  newState?: Partial<Todo>;
}

export type Priority = 'low' | 'medium' | 'high';

export type FilterType = 'all' | 'active' | 'completed' | 'overdue';

export type SortBy = 'createdAt' | 'dueDate' | 'priority' | 'title' | 'order';

export type SortOrder = 'asc' | 'desc';

export interface TodoFilters {
  search: string;
  filter: FilterType;
  category?: string;
  priority?: Priority;
  sortBy: SortBy;
  sortOrder: SortOrder;
  tags: string[];
}

export interface TodoContextType {
  // State
  todos: Todo[];
  categories: Category[];
  filters: TodoFilters;
  stats: TodoStats;
  history: TodoHistory[];
  isLoading: boolean;
  
  // Todo Actions
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  duplicateTodo: (id: string) => void;
  reorderTodos: (startIndex: number, endIndex: number) => void;
  bulkDeleteTodos: (ids: string[]) => void;
  bulkCompleteTodos: (ids: string[]) => void;
  bulkUpdateCategory: (ids: string[], categoryId: string) => void;
  
  // Category Actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Filter Actions
  setFilters: (filters: Partial<TodoFilters>) => void;
  resetFilters: () => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Utility
  clearCompleted: () => void;
  exportTodos: () => string;
  importTodos: (data: string) => void;
  getFilteredTodos: () => Todo[];
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'personal', name: 'Personal', color: '#3b82f6', icon: 'User' },
  { id: 'work', name: 'Work', color: '#ef4444', icon: 'Briefcase' },
  { id: 'shopping', name: 'Shopping', color: '#10b981', icon: 'ShoppingCart' },
  { id: 'health', name: 'Health', color: '#f59e0b', icon: 'Heart' },
  { id: 'learning', name: 'Learning', color: '#8b5cf6', icon: 'BookOpen' },
];

export const PRIORITY_COLORS = {
  low: '#10b981',    // green
  medium: '#f59e0b', // amber
  high: '#ef4444',   // red
};

export const PRIORITY_LABELS = {
  low: 'Low Priority',
  medium: 'Medium Priority',
  high: 'High Priority',
};
