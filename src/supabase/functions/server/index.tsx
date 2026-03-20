import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { seedArticles } from "./seed_articles.tsx";
import { seedCategories } from "./seed_categories.tsx";
import { seedUsers } from "./seed_users.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-64d00b7b/health", (c) => {
  return c.json({ status: "ok" });
});

// Seed database with sample data (for development)
app.post("/make-server-64d00b7b/seed", async (c) => {
  try {
    await seedUsers();
    await seedCategories();
    await seedArticles();
    return c.json({ success: true, message: 'Database seeded successfully with users, categories, and articles' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return c.json({ success: false, error: `Failed to seed database: ${error}` }, 500);
  }
});

// ============================================
// USER MANAGEMENT ROUTES
// ============================================

// Get all users
app.get("/make-server-64d00b7b/users", async (c) => {
  try {
    const users = await kv.getByPrefix("user:");
    return c.json({ 
      success: true, 
      data: users.sort((a, b) => a.id - b.id)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ success: false, error: `Failed to fetch users: ${error}` }, 500);
  }
});

// Get single user by ID
app.get("/make-server-64d00b7b/users/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const user = await kv.get(`user:${id}`);
    
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    return c.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ success: false, error: `Failed to fetch user: ${error}` }, 500);
  }
});

// Create new user
app.post("/make-server-64d00b7b/users", async (c) => {
  try {
    const userData = await c.req.json();
    
    // Generate new ID
    const allUsers = await kv.getByPrefix("user:");
    const maxId = allUsers.length > 0 
      ? Math.max(...allUsers.map((u: any) => u.id || 0))
      : 0;
    const newId = maxId + 1;
    
    // Create user object
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const user = {
      ...userData,
      id: newId,
      joinedDate: userData.joinedDate || now,
      lastActive: now,
      articlesCount: 0,
    };
    
    // Save to KV store
    await kv.set(`user:${newId}`, user);
    
    return c.json({ success: true, data: user });
  } catch (error) {
    console.error('Error creating user:', error);
    return c.json({ success: false, error: `Failed to create user: ${error}` }, 500);
  }
});

// Update existing user
app.put("/make-server-64d00b7b/users/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const userData = await c.req.json();
    
    // Check if user exists
    const existingUser = await kv.get(`user:${id}`);
    if (!existingUser) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    // Update user
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatedUser = {
      ...existingUser,
      ...userData,
      id: parseInt(id),
      lastActive: now,
    };
    
    await kv.set(`user:${id}`, updatedUser);
    
    return c.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return c.json({ success: false, error: `Failed to update user: ${error}` }, 500);
  }
});

// Delete user
app.delete("/make-server-64d00b7b/users/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    // Check if user exists
    const existingUser = await kv.get(`user:${id}`);
    if (!existingUser) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    await kv.del(`user:${id}`);
    
    return c.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return c.json({ success: false, error: `Failed to delete user: ${error}` }, 500);
  }
});

// ============================================
// CATEGORY MANAGEMENT ROUTES
// ============================================

// Get all categories
app.get("/make-server-64d00b7b/categories", async (c) => {
  try {
    const categories = await kv.getByPrefix("category:");
    return c.json({ 
      success: true, 
      data: categories.sort((a, b) => a.order - b.order)
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ success: false, error: `Failed to fetch categories: ${error}` }, 500);
  }
});

// Get single category by ID
app.get("/make-server-64d00b7b/categories/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const category = await kv.get(`category:${id}`);
    
    if (!category) {
      return c.json({ success: false, error: 'Category not found' }, 404);
    }
    
    return c.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return c.json({ success: false, error: `Failed to fetch category: ${error}` }, 500);
  }
});

// Create new category
app.post("/make-server-64d00b7b/categories", async (c) => {
  try {
    const categoryData = await c.req.json();
    
    // Generate new ID
    const allCategories = await kv.getByPrefix("category:");
    const maxId = allCategories.length > 0 
      ? Math.max(...allCategories.map((cat: any) => cat.id || 0))
      : 0;
    const newId = maxId + 1;
    
    // Create category object
    const category = {
      ...categoryData,
      id: newId,
      articleCount: 0,
    };
    
    // Save to KV store
    await kv.set(`category:${newId}`, category);
    
    return c.json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    return c.json({ success: false, error: `Failed to create category: ${error}` }, 500);
  }
});

// Update existing category
app.put("/make-server-64d00b7b/categories/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const categoryData = await c.req.json();
    
    // Check if category exists
    const existingCategory = await kv.get(`category:${id}`);
    if (!existingCategory) {
      return c.json({ success: false, error: 'Category not found' }, 404);
    }
    
    // Update category
    const updatedCategory = {
      ...existingCategory,
      ...categoryData,
      id: parseInt(id),
    };
    
    await kv.set(`category:${id}`, updatedCategory);
    
    return c.json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    return c.json({ success: false, error: `Failed to update category: ${error}` }, 500);
  }
});

// Delete category
app.delete("/make-server-64d00b7b/categories/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    // Check if category exists
    const existingCategory = await kv.get(`category:${id}`);
    if (!existingCategory) {
      return c.json({ success: false, error: 'Category not found' }, 404);
    }
    
    await kv.del(`category:${id}`);
    
    return c.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return c.json({ success: false, error: `Failed to delete category: ${error}` }, 500);
  }
});

// ============================================
// ARTICLE MANAGEMENT ROUTES
// ============================================

// Get all articles
app.get("/make-server-64d00b7b/articles", async (c) => {
  try {
    const articles = await kv.getByPrefix("article:");
    return c.json({ 
      success: true, 
      data: articles.sort((a, b) => {
        const dateA = new Date(a.updatedDate || a.publishDate || 0).getTime();
        const dateB = new Date(b.updatedDate || b.publishDate || 0).getTime();
        return dateB - dateA; // Newest first
      })
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return c.json({ success: false, error: `Failed to fetch articles: ${error}` }, 500);
  }
});

// Get single article by ID
app.get("/make-server-64d00b7b/articles/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const article = await kv.get(`article:${id}`);
    
    if (!article) {
      return c.json({ success: false, error: 'Article not found' }, 404);
    }
    
    return c.json({ success: true, data: article });
  } catch (error) {
    console.error('Error fetching article:', error);
    return c.json({ success: false, error: `Failed to fetch article: ${error}` }, 500);
  }
});

// Create new article
app.post("/make-server-64d00b7b/articles", async (c) => {
  try {
    const articleData = await c.req.json();
    
    // Generate new ID
    const allArticles = await kv.getByPrefix("article:");
    const maxId = allArticles.length > 0 
      ? Math.max(...allArticles.map((a: any) => a.id || 0))
      : 0;
    const newId = maxId + 1;
    
    // Create article object
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const article = {
      ...articleData,
      id: newId,
      publishDate: articleData.publishDate || now,
      updatedDate: now,
      views: 0,
      comments: 0,
    };
    
    // Save to KV store
    await kv.set(`article:${newId}`, article);
    
    return c.json({ success: true, data: article });
  } catch (error) {
    console.error('Error creating article:', error);
    return c.json({ success: false, error: `Failed to create article: ${error}` }, 500);
  }
});

// Update existing article
app.put("/make-server-64d00b7b/articles/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const articleData = await c.req.json();
    
    // Check if article exists
    const existingArticle = await kv.get(`article:${id}`);
    if (!existingArticle) {
      return c.json({ success: false, error: 'Article not found' }, 404);
    }
    
    // Update article
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatedArticle = {
      ...existingArticle,
      ...articleData,
      id: parseInt(id),
      updatedDate: now,
    };
    
    await kv.set(`article:${id}`, updatedArticle);
    
    return c.json({ success: true, data: updatedArticle });
  } catch (error) {
    console.error('Error updating article:', error);
    return c.json({ success: false, error: `Failed to update article: ${error}` }, 500);
  }
});

// Delete article
app.delete("/make-server-64d00b7b/articles/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    // Check if article exists
    const existingArticle = await kv.get(`article:${id}`);
    if (!existingArticle) {
      return c.json({ success: false, error: 'Article not found' }, 404);
    }
    
    await kv.del(`article:${id}`);
    
    return c.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return c.json({ success: false, error: `Failed to delete article: ${error}` }, 500);
  }
});

Deno.serve(app.fetch);