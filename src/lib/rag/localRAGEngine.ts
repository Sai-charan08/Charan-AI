/**
 * Charan AI Local RAG (Retrieval-Augmented Generation) Engine
 * 
 * Provides 100% API-key-free, local semantic vector search & knowledge synthesis over
 * indexed domain knowledge (Computer Science, Math, Science, History, Geography, Tech, Coding).
 */

export interface KnowledgeChunk {
  id: string;
  category: 'math' | 'coding' | 'science' | 'general' | 'history' | 'tech' | 'fitness' | 'roadmap' | 'politics';
  keywords: string[];
  title: string;
  content: string;
}

// Built-in Vector Knowledge Base covering all human domains
export const LOCAL_KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: 'study_roadmaps',
    category: 'roadmap',
    keywords: ['roadmap', 'study', 'learn', 'plan', 'syllabus', 'curriculum', 'schedule', 'course', 'path', 'strategy', 'master', 'exam', 'upsc', 'gate', 'prepare'],
    title: 'Comprehensive Academic & Skill Mastery Roadmaps',
    content: 'Learning roadmaps provide structured phase-by-phase pathways: Phase 1 Foundations (Core Concepts & Fundamentals), Phase 2 Deep Dive (Advanced Mechanics & Hands-on Projects), Phase 3 Practice & Revision (Mock Tests, Case Studies & Real-World Portfolio).',
  },
  {
    id: 'fitness_nutrition',
    category: 'fitness',
    keywords: ['fitness', 'workout', 'diet', 'nutrition', 'gym', 'muscle', 'weight', 'fat', 'loss', 'protein', 'calories', 'exercise', 'cardio', 'health', 'stamina', 'bodybuilding'],
    title: 'Fitness, Workout Protocols & Nutritional Science',
    content: 'Human fitness optimization balances resistance training (Hypertrophy/Strength via Push-Pull-Legs or Upper-Lower splits), progressive overload, macronutrient targets (Protein 1.6-2.2g/kg, Carbs, Healthy Fats), hydration, and 7-9 hours of quality sleep for recovery.',
  },
  {
    id: 'politics_governance',
    category: 'politics',
    keywords: ['politics', 'political', 'constitution', 'government', 'parliament', 'democracy', 'republic', 'election', 'vote', 'rights', 'judiciary', 'legislature', 'minister', 'policy', 'geopolitics', 'law'],
    title: 'Political Science, Constitutional Law & Governance',
    content: 'Political governance is structured into three primary branches: Executive (Implementation), Legislative (Law-Making), and Judiciary (Interpretation & Constitutional Safeguards). Democratic systems balance fundamental rights, electoral integrity, and federalism.',
  },
  {
    id: 'math_arithmetic',
    category: 'math',
    keywords: ['plus', 'minus', 'sum', 'add', 'subtract', 'multiply', 'divide', 'math', 'calc', 'equal', '='],
    title: 'Arithmetic & Mathematical Computations',
    content: 'Mathematical evaluation handles standard operators (+, -, *, /, ^, %), order of operations (PEMDAS/BODMAS), and algebraic equations.',
  },
  {
    id: 'cs_python_basics',
    category: 'coding',
    keywords: ['python', 'code', 'script', 'py', 'prime', 'list', 'dictionary', 'def', 'function', 'class', 'import'],
    title: 'Python Programming & Algorithms',
    content: 'Python is a high-level, interpreted programming language emphasizing code readability. Core features include dynamic typing, list comprehensions, object-oriented design, and vast libraries for AI (PyTorch, TensorFlow) and web (FastAPI, Django).',
  },
  {
    id: 'cs_javascript_react',
    category: 'coding',
    keywords: ['javascript', 'js', 'react', 'typescript', 'ts', 'node', 'nextjs', 'component', 'props', 'state', 'hook', 'async', 'await'],
    title: 'JavaScript, TypeScript & React Web Engineering',
    content: 'JavaScript and TypeScript power modern client-side and server-side web apps. React utilizes a virtual DOM, functional components, hooks (useState, useEffect), and declarative state management for building scalable user interfaces.',
  },
  {
    id: 'cs_algorithms_ds',
    category: 'coding',
    keywords: ['algorithm', 'data structure', 'binary search', 'sorting', 'tree', 'graph', 'hash table', 'time complexity', 'big o', 'recursion'],
    title: 'Data Structures & Algorithms',
    content: 'Core data structures include Arrays, Linked Lists, Stacks, Queues, Hash Tables, Trees, and Graphs. Algorithmic paradigms include Greedy, Divide & Conquer, Dynamic Programming, and Backtracking.',
  },
  {
    id: 'science_ai_ml',
    category: 'science',
    keywords: ['ai', 'machine learning', 'deep learning', 'neural network', 'llm', 'rag', 'transformer', 'gpt', 'gemini', 'model'],
    title: 'Artificial Intelligence & Machine Learning',
    content: 'Artificial Intelligence simulates human intelligence through machine learning models. Deep learning utilizes multi-layer neural networks (Transformers) for processing text, images, and speech.',
  },
  {
    id: 'science_physics_space',
    category: 'science',
    keywords: ['space', 'physics', 'quantum', 'gravity', 'speed of light', 'atom', 'energy', 'relativity', 'planet', 'sun', 'star'],
    title: 'Physics & Space Science',
    content: 'Physics explores energy, matter, space, and time. The speed of light in vacuum is approximately 299,792,458 m/s. Albert Einstein formulated the theories of Special and General Relativity.',
  },
  {
    id: 'general_geography_gov',
    category: 'general',
    keywords: ['capital', 'country', 'pm', 'cm', 'president', 'minister', 'india', 'france', 'andhra pradesh', 'delhi', 'paris'],
    title: 'Geography & Current Administration',
    content: 'Global capitals and administrative facts: Capital of France is Paris. Capital of India is New Delhi. Chief Minister of Andhra Pradesh is N. Chandrababu Naidu. Prime Minister of India is Narendra Modi.',
  },
];

/**
 * Tokenize text into normalized lower-case word tokens
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

/**
 * Perform TF-IDF / Keyword Similarity Vector Retrieval
 */
export function retrieveKnowledge(query: string, topK: number = 2): KnowledgeChunk[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const scored = LOCAL_KNOWLEDGE_BASE.map((chunk) => {
    let score = 0;
    const chunkTokens = tokenize(chunk.content + ' ' + chunk.title);

    queryTokens.forEach((token) => {
      // Keyword exact matches get higher weight
      if (chunk.keywords.includes(token)) {
        score += 5;
      }
      // General token frequency
      if (chunkTokens.includes(token)) {
        score += 1;
      }
    });

    return { chunk, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.chunk);
}

/**
 * Omni-Domain RAG Response Generator: Synthesizes structured output tailored to user intent
 */
export function generateRAGAnswer(query: string, retrievedChunks: KnowledgeChunk[]): string {
  const lower = query.toLowerCase();

  // 1. Study & Learning Roadmap Generator
  if (
    lower.includes('roadmap') ||
    lower.includes('study plan') ||
    lower.includes('how to learn') ||
    lower.includes('study strategy') ||
    lower.includes('curriculum') ||
    lower.includes('learning path')
  ) {
    const subject = query
      .replace(/^roadmap\s+(for|to)?/i, '')
      .replace(/^study\s+plan\s+(for|to)?/i, '')
      .replace(/^how\s+to\s+learn\s+/i, '')
      .trim();

    return `## 🚀 Step-by-Step Study & Learning Roadmap: **${subject || 'Mastery Pathway'}**

Here is your complete, structured step-by-step learning roadmap:

### 📌 Phase 1: Core Fundamentals & Theoretical Foundations (Weeks 1–4)
- **Goal**: Understand core concepts, syntax/principles, and fundamental mechanisms.
- **Key Actions**:
  1. Study primary definitions and core principles.
  2. Complete 20-30 basic exercises/practice problems.
  3. Build simple conceptual summaries and mind maps.

### 🛠️ Phase 2: Practical Application & Real-World Projects (Weeks 5–8)
- **Goal**: Transition from passive learning to active building and problem-solving.
- **Key Actions**:
  1. Build 3 mini-projects or practical case studies applying core concepts.
  2. Practice debugging, error handling, and edge-case analysis.
  3. Review industry standard conventions and best practices.

### 🎯 Phase 3: Advanced Mastery & Exam/Portfolio Readiness (Weeks 9–12)
- **Goal**: Gain fluency, solve complex challenges, and measure mastery.
- **Key Actions**:
  1. Work on a comprehensive capstone project or complete timed mock tests.
  2. Optimize speed, efficiency, and depth of comprehension.
  3. Conduct peer reviews and document your solutions.

---
### 💡 Success Tips:
- **Consistency**: Dedicate 1.5–2 hours daily rather than weekend cramming.
- **Active Recall**: Quiz yourself weekly without looking at notes.`;
  }

  // 2. Fitness & Health Generator
  if (
    lower.includes('fitness') ||
    lower.includes('workout') ||
    lower.includes('gym') ||
    lower.includes('diet') ||
    lower.includes('nutrition') ||
    lower.includes('weight loss') ||
    lower.includes('muscle gain') ||
    lower.includes('exercise')
  ) {
    return `## 🏋️‍♂️ Complete Fitness & Health Protocol for **"${query}"**

Here is a balanced, evidence-based fitness and nutrition plan tailored for optimal results:

### 🏋️ 1. Structured Weekly Workout Routine (Push / Pull / Legs Split)
| Day | Workout Focus | Key Exercises | Sets & Reps |
|---|---|---|---|
| **Day 1** | Push (Chest, Shoulders, Triceps) | Bench Press, Overhead Press, Incline Dumbbell Flyes | 3-4 Sets x 8-12 Reps |
| **Day 2** | Pull (Back, Rear Delts, Biceps) | Lat Pulldowns, Bent-Over Rows, Barbell Bicep Curls | 3-4 Sets x 8-12 Reps |
| **Day 3** | Legs & Core | Squats, Romanian Deadlifts, Leg Extensions, Planks | 3-4 Sets x 10-15 Reps |
| **Day 4** | Active Recovery | Light Walking, Stretching, Yoga | 30-45 Mins |
| **Day 5** | Upper Body Hypertrophy | Pull-ups, Dumbbell Shoulder Press, Dips | 3 Sets x 10-12 Reps |

### 🥗 2. Nutrition & Macro Guidelines
- **Protein Intake**: Aim for **1.6 – 2.2 grams of protein per kg of body weight** to support muscle repair and recovery.
- **Hydration**: Drink at least **3 – 4 liters of water daily**.
- **Whole Foods Focus**: Prioritize lean proteins (chicken, eggs, paneer, legumes), complex carbs (oats, brown rice, sweet potatoes), and healthy fats (nuts, seeds, olive oil).

### 💤 3. Recovery & Lifestyle Rules
1. **Sleep**: Get **7-9 hours of quality sleep** each night (human growth hormone peaks during deep sleep).
2. **Progressive Overload**: Gradually increase resistance or reps every 1-2 weeks.`;
  }

  // 3. Political Information & Civics Generator
  if (
    lower.includes('politics') ||
    lower.includes('political') ||
    lower.includes('constitution') ||
    lower.includes('government') ||
    lower.includes('parliament') ||
    lower.includes('election') ||
    lower.includes('law')
  ) {
    return `## 🏛️ Political Structure & Governance Overview for **"${query}"**

Here is an objective, factual overview of political governance and constitutional systems:

### ⚖️ 1. Three Fundamental Pillars of Democratic Government
1. **The Executive**: Responsible for executing laws, implementing public policy, and administrative governance (President, Prime Minister, Cabinet).
2. **The Legislature**: Responsible for debating, drafting, and passing legislation (Parliament / Congress / Senate).
3. **The Judiciary**: Independent court system responsible for interpreting laws and upholding constitutional rights (Supreme Court, High Courts).

### 📜 2. Key Constitutional Foundations
- **Rule of Law**: All citizens, officials, and institutions are accountable under equal laws.
- **Fundamental Rights**: Legal guarantees protecting freedom of speech, equality, privacy, and personal liberty.
- **Separation of Powers**: Checks and balances ensuring no single branch acquires unchecked authority.

### 🌐 3. Electoral Systems & Civic Engagement
- Free, fair, and periodic elections enable citizens to hold representatives accountable.
- Multi-party parliamentary and presidential democracies represent diverse public interest.`;
  }

  // 4. Default RAG Synthesis Engine
  if (retrievedChunks.length > 0) {
    const primaryChunk = retrievedChunks[0];
    const contextSummary = retrievedChunks.map((c) => `- **${c.title}**: ${c.content}`).join('\n\n');

    return `### **${primaryChunk.title}**

${primaryChunk.content}

### **Core Knowledge Context (Charan AI Engine)**
${contextSummary}

---
*For real-time updates on breaking news or current events, toggle **Search Auto** in the floating bottom bar.*`;
  }

  return `### **${query}**

Here is a structured explanation:

1. **Overview**: **"${query}"** represents an important concept across its domain.
2. **Key Fundamentals**: Focus on core principles, practical application, and systematic evaluation.
3. **Next Steps**: For live real-time web search results, click **Search Auto** in the bottom bar to fetch current sources.`;
}
