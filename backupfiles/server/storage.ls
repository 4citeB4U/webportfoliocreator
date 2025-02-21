import { users, type User, type InsertUser, type ContentSection, type ChartData } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const MemoryStore = createMemoryStore(session);

async function hashInitialPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  template?: string;
  components?: any[];
  preview?: {
    imageUrl?: string;
    demoUrl?: string;
  };
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getContent(section: string): Promise<ContentSection>;
  updateContent(section: string, content: ContentSection): Promise<void>;
  getChartData(chartId: string): Promise<ChartData>;
  updateChartData(chartId: string, data: ChartData): Promise<void>;
  getProject(projectId: string): Promise<Project | undefined>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private content: Map<string, ContentSection>;
  private chartData: Map<string, ChartData>;
  private projects: Map<string, Project>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.content = new Map();
    this.chartData = new Map();
    this.projects = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    this.projects.set('pro-driver-academy', {
      id: 'pro-driver-academy',
      name: 'Pro Driver Academy',
      description: 'Professional CDL training academy website with comprehensive course information and student portal.',
      url: '/projects/pro-driver-academy',
      template: 'educational',
      preview: {
        imageUrl: '/previews/pda-preview.png',
        demoUrl: '/projects/pro-driver-academy'
      },
      components: []
    });

    this.projects.set('leolas-library', {
      id: 'leolas-library',
      name: 'Leola\'s Digital Library',
      description: 'Digital library and storytelling platform with interactive reading features.',
      url: '/projects/leolas-library',
      template: 'library',
      preview: {
        imageUrl: '/previews/library-preview.png',
        demoUrl: '/projects/leolas-library'
      },
      components: [
        {
          id: 'header',
          type: 'navigation',
          name: 'Library Navigation',
          data: {
            title: 'Leola\'s Digital Library',
            links: [
              { text: 'Return to Showcase', href: '/showcase' }
            ]
          }
        },
        {
          id: 'featured-book',
          type: 'card',
          name: 'Featured Book Card',
          data: {
            title: 'Needle & Yarn - A Love Stitched in Time',
            description: 'A heartwarming tale about love, crafting, and the threads that bind us together.',
            coverImage: 'book-cover.svg'
          }
        },
        {
          id: 'book-grid',
          type: 'grid',
          name: 'Book Collection Grid',
          data: {
            books: [
              {
                title: 'Needle & Yarn: A Love Stitched in Time',
                description: 'A tale of love, crafting, and finding meaning in the threads that connect us all.',
                coverImage: 'needle-yarn-cover.svg'
              },
              {
                title: 'Crochet Mastery Guide',
                description: 'A comprehensive guide to mastering the art of crochet, with step-by-step instructions.',
                coverImage: 'crochet-guide-cover.svg'
              },
              {
                title: 'Yarns of Wisdom',
                description: 'A collection of heartwarming stories and life lessons learned through the art of crafting.',
                coverImage: 'wisdom-cover.svg'
              }
            ]
          }
        }
      ]
    });

    const initializeStorage = async () => {
      const adminUser: User = {
        id: this.currentId++,
        username: "admin",
        password: await hashInitialPassword("admin"),
        email: "admin@rapidwebdev.com",
        role: "admin",
        isActive: true,
        canManageUsers: true,
        canEditContent: true,
        canPublish: true
      };
      this.users.set(adminUser.id, adminUser);
      console.log("Admin user initialized with username:", adminUser.username);
    };

    initializeStorage().catch(console.error);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      id, 
      ...insertUser,
      role: insertUser.role || 'viewer',
      isActive: true,
      canManageUsers: false,
      canEditContent: false,
      canPublish: false
    };
    this.users.set(id, user);
    return user;
  }

  async getContent(section: string): Promise<ContentSection> {
    return this.content.get(section) || {
      title: "",
      content: "",
      audioScript: ""
    };
  }

  async updateContent(section: string, content: ContentSection): Promise<void> {
    this.content.set(section, content);
  }

  async getChartData(chartId: string): Promise<ChartData> {
    return this.chartData.get(chartId) || {
      title: "",
      data: [],
      explanation: ""
    };
  }

  async updateChartData(chartId: string, data: ChartData): Promise<void> {
    this.chartData.set(chartId, data);
  }

  async getProject(projectId: string): Promise<Project | undefined> {
    try {
      const normalizedId = projectId.replace(/^\/?(projects\/)?/, '').toLowerCase();
      console.log('Looking for project with normalized ID:', normalizedId);
      console.log('Available projects:', Array.from(this.projects.keys()));

      const project = this.projects.get(normalizedId);
      if (!project) {
        console.log('Project not found:', normalizedId);
        return undefined;
      }

      // Add detailed logging of the project data
      console.log('Found project:', JSON.stringify(project, null, 2));

      return {
        ...project,
        url: `/projects/${normalizedId}`,
        preview: {
          ...project.preview,
          demoUrl: `/projects/${normalizedId}`,
          imageUrl: project.preview?.imageUrl || `/previews/${normalizedId}-preview.png`
        },
        components: project.components || []
      };
    } catch (error) {
      console.error('Error in getProject:', error);
      return undefined;
    }
  }
}

export const storage = new MemStorage();