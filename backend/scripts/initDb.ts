import { dbHelpers } from '../database/database';

const { createNews } = dbHelpers;

// Sample news data to populate the database
interface SampleNewsData {
  title: string;
  content: string;
  summary: string;
  category: string;
  is_featured: boolean;
  image_url?: string;
}

const sampleNews: SampleNewsData[] = [
  {
    title: "Breaking News: Market Hits Record Highs",
    content: "The stock market reached unprecedented levels today, with major indices posting significant gains. Investors are optimistic about the economic outlook as corporate earnings continue to exceed expectations. This rally has been driven by strong consumer spending, technological innovations, and positive global economic indicators.",
    summary: "The stock market reached unprecedented levels today, with major indices posting significant gains.",
    category: "BUSINESS",
    is_featured: true,
    image_url: undefined // We'll add a placeholder image later
  },
  {
    title: "Local Community Rallies to Support Cleanup Event",
    content: "Hundreds of volunteers gathered at the city's annual cleanup event this weekend. The initiative, now in its fifth year, has become a cornerstone of community engagement. Volunteers of all ages participated, collecting over 2 tons of litter and recyclables from local parks and waterways. The event demonstrates the power of collective action in environmental stewardship.",
    summary: "Hundreds of volunteers gathered at the city's annual cleanup event this weekend.",
    category: "COMMUNITY",
    is_featured: false,
    image_url: undefined
  },
  {
    title: "New Restaurant Opens Downtown",
    content: "A trendy new restaurant has opened in the heart of downtown, offering diverse cuisines. The establishment features a modern design with locally sourced ingredients and an innovative menu that combines traditional flavors with contemporary techniques. The restaurant aims to become a new culinary destination for both locals and tourists.",
    summary: "A trendy new restaurant has opened in the heart of downtown, offering diverse cuisines.",
    category: "BUSINESS",
    is_featured: false,
    image_url: undefined
  },
  {
    title: "Tech Conference Highlights Latest Innovations",
    content: "Industry leaders showcased cutting-edge technologies at the annual tech conference. The event featured presentations on artificial intelligence, quantum computing, sustainable technology, and digital transformation. Attendees had the opportunity to network with innovators and learn about emerging trends that will shape the future of technology.",
    summary: "Industry leaders showcased cutting-edge technologies at the annual tech conference.",
    category: "SCIENCE",
    is_featured: false,
    image_url: undefined
  },
  {
    title: "Championship Game Ends in Thrilling Overtime",
    content: "The championship game concluded in a nail-biting overtime that kept fans on the edge of their seats. After a scoreless regulation period, both teams displayed exceptional skill and determination. The winning goal came in the final minutes of overtime, securing the championship for the home team in front of a sold-out crowd.",
    summary: "The championship game concluded in a nail-biting overtime that kept fans on the edge of their seats.",
    category: "SPORTS",
    is_featured: false,
    image_url: undefined
  }
];

async function initializeDatabase(): Promise<void> {
  console.log('Initializing database with sample data...');
  
  try {
    for (let i = 0; i < sampleNews.length; i++) {
      const news = sampleNews[i];
      const result = await createNews(news);
      console.log(`Created news article: ${result.title} (ID: ${result.id})`);
    }
    
    console.log('Database initialization completed successfully!');
    console.log(`Created ${sampleNews.length} news articles`);
    
  } catch (error) {
    console.error('Error initializing database:', error);
  }
  
  process.exit(0);
}

// Run the initialization
initializeDatabase(); 