// ✅ OTIMIZADO: Tipos compartilhados centralizados
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: any;
}

export interface SearchParams {
  query: string;
  fields?: string[];
}

export interface ApiError {
  message: string;
  code?: string;
  details?: string;
  statusCode?: number;
}

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

export interface FormState<T> extends LoadingState {
  data: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isValid: boolean;
}

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationParams;
  sorting?: SortParams;
  filtering?: FilterParams;
  onSort?: (sort: SortParams) => void;
  onFilter?: (filters: FilterParams) => void;
  onPageChange?: (page: number) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  duration?: number;
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    dataSharing: boolean;
  };
}

