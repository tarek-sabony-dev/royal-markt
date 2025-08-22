import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const ordersFile = path.join(dataDir, 'orders.json');
const sampleDataFile = path.join(process.cwd(), 'src', 'data', 'orders.json');

export function initializeData() {
  try {
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // If orders.json doesn't exist, copy from sample data
    if (!fs.existsSync(ordersFile)) {
      if (fs.existsSync(sampleDataFile)) {
        const sampleData = fs.readFileSync(sampleDataFile, 'utf8');
        fs.writeFileSync(ordersFile, sampleData);
        console.log('Sample data copied to data/orders.json');
      } else {
        // Initialize with empty array if no sample data
        fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
        console.log('Empty orders.json created');
      }
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
} 