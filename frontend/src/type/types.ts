export interface AppRoute {
  path: string;
  name: string;
  component: React.ComponentType<any>;
  meta?: {
    role?: string | string[];
    isShow?: boolean;
    requireAuth?: boolean;
  };
  children?: AppRoute[];
}
