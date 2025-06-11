import AsyncStorage from '@react-native-async-storage/async-storage';

export type TimeBlock = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  icon: string;
  completed?: boolean;
  completedAt?: string;
};

export type RoutineDay = {
  date: string;
  blocks: TimeBlock[];
};

export type RoutineTemplate = {
  id: string;
  name: string;
  blocks: TimeBlock[];
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEYS = {
  ROUTINES: '@FocusFlow/routines',
  TEMPLATES: '@FocusFlow/templates',
};

class RoutineService {
  // Save routines for a specific date
  async saveRoutine(date: string, blocks: TimeBlock[]): Promise<void> {
    try {
      const routines = await this.getRoutines();
      routines[date] = blocks;
      await AsyncStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
    } catch (error) {
      console.error('Error saving routine:', error);
      throw error;
    }
  }

  // Get routines for a specific date
  async getRoutine(date: string): Promise<TimeBlock[]> {
    try {
      const routines = await this.getRoutines();
      return routines[date] || [];
    } catch (error) {
      console.error('Error getting routine:', error);
      throw error;
    }
  }

  // Get all routines
  async getRoutines(): Promise<Record<string, TimeBlock[]>> {
    try {
      const routinesJson = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINES);
      return routinesJson ? JSON.parse(routinesJson) : {};
    } catch (error) {
      console.error('Error getting routines:', error);
      throw error;
    }
  }

  // Save a template
  async saveTemplate(template: Omit<RoutineTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoutineTemplate> {
    try {
      const templates = await this.getTemplates();
      const newTemplate: RoutineTemplate = {
        ...template,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      templates.push(newTemplate);
      await AsyncStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
      
      return newTemplate;
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  }

  // Get all templates
  async getTemplates(): Promise<RoutineTemplate[]> {
    try {
      const templatesJson = await AsyncStorage.getItem(STORAGE_KEYS.TEMPLATES);
      return templatesJson ? JSON.parse(templatesJson) : [];
    } catch (error) {
      console.error('Error getting templates:', error);
      throw error;
    }
  }

  // Apply a template to a specific date
  async applyTemplate(templateId: string, date: string): Promise<void> {
    try {
      const templates = await this.getTemplates();
      const template = templates.find(t => t.id === templateId);
      
      if (!template) {
        throw new Error('Template not found');
      }

      // Create new blocks with unique IDs
      const newBlocks = template.blocks.map(block => ({
        ...block,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        completed: false,
        completedAt: undefined,
      }));

      await this.saveRoutine(date, newBlocks);
    } catch (error) {
      console.error('Error applying template:', error);
      throw error;
    }
  }

  // Delete a template
  async deleteTemplate(templateId: string): Promise<void> {
    try {
      const templates = await this.getTemplates();
      const updatedTemplates = templates.filter(t => t.id !== templateId);
      await AsyncStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(updatedTemplates));
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  // Update a template
  async updateTemplate(templateId: string, updates: Partial<RoutineTemplate>): Promise<RoutineTemplate> {
    try {
      const templates = await this.getTemplates();
      const index = templates.findIndex(t => t.id === templateId);
      
      if (index === -1) {
        throw new Error('Template not found');
      }

      const updatedTemplate = {
        ...templates[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      templates[index] = updatedTemplate;
      await AsyncStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
      
      return updatedTemplate;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }
}

export const routineService = new RoutineService(); 