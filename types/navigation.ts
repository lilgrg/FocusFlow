import { Routine } from './entities';

/**
 * Root stack navigator parameter list
 */
export type RootStackParamList = {
  Main: undefined;
  RoutineDetails: { routineId: string };
  CreateRoutine: undefined;
  EditRoutine: { routine: Routine };
  Settings: undefined;
  Statistics: undefined;
  Profile: undefined;
};

/**
 * Tab navigator parameter list
 */
export type TabParamList = {
  Home: undefined;
  Routines: undefined;
  Statistics: undefined;
  Profile: undefined;
};

/**
 * Navigation state type
 */
export type NavigationState = {
  index: number;
  routes: {
    key: string;
    name: keyof RootStackParamList;
    params?: any;
  }[];
};

/**
 * Navigation action type
 */
export type NavigationAction = {
  type: string;
  payload?: any;
};

/**
 * Navigation event type
 */
export type NavigationEvent = {
  type: string;
  data?: any;
  target?: string;
}; 