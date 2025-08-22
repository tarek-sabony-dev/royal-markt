import fs from 'fs';
import path from 'path';
import { initializeData } from './init-data.js';

const dataDir = path.join(process.cwd(), 'data');
const ordersFile = path.join(dataDir, 'orders.json');

// Initialize data directory and sample data
initializeData();

// Initialize orders file with empty array if it doesn't exist or is invalid
export function initializeOrdersFile() {
  try {
    if (!fs.existsSync(ordersFile)) {
      fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
      return [];
    }
    
    // Read and validate the file content
    const fileContent = fs.readFileSync(ordersFile, 'utf8').trim();
    
    // If file is empty, initialize with empty array
    if (!fileContent) {
      fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
      return [];
    }
    
    // Try to parse the JSON
    const parsedData = JSON.parse(fileContent);
    
    // Ensure it's an array
    if (!Array.isArray(parsedData)) {
      fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
      return [];
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error initializing orders file:', error);
    // If JSON is invalid, recreate the file
    fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
    return [];
  }
}

export function readOrders() {
  try {
    const fileContent = fs.readFileSync(ordersFile, 'utf8').trim();
    
    // Handle empty file
    if (!fileContent) {
      return [];
    }
    
    const data = JSON.parse(fileContent);
    
    // Ensure we always return an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error reading orders:', error);
    // If there's an error, reinitialize the file
    return initializeOrdersFile();
  }
}

export function writeOrders(orders) {
  try {
    // Ensure we're writing an array
    const dataToWrite = Array.isArray(orders) ? orders : [];
    fs.writeFileSync(ordersFile, JSON.stringify(dataToWrite, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing orders:', error);
    return false;
  }
}

export function addOrder(newOrder) {
  try {
    const orders = readOrders();
    
    // Check if order already exists
    const existingOrderIndex = orders.findIndex(order => order.id === newOrder.id);
    
    if (existingOrderIndex !== -1) {
      // Update existing order
      orders[existingOrderIndex] = { 
        ...orders[existingOrderIndex], 
        ...newOrder,
        updated_at: new Date().toISOString()
      };
    } else {
      // Add new order with proper data types
      const orderToAdd = {
        id: Number(newOrder.id) || 0,
        order_id: Number(newOrder.order_id) || 0,
        customer_email: String(newOrder.customer_email || ''),
        total_price: String(newOrder.total_price || '0.00'),
        currency: String(newOrder.currency || 'USD'),
        financial_status: String(newOrder.financial_status || ''),
        fulfillment_status: String(newOrder.fulfillment_status || ''),
        line_items: Array.isArray(newOrder.line_items) ? newOrder.line_items.map(item => ({
          product_id: Number(item.product_id) || 0,
          variant_id: Number(item.variant_id) || 0,
          title: String(item.title || ''),
          quantity: Number(item.quantity) || 0,
          price: String(item.price || '0.00'),
          sku: String(item.sku || '')
        })) : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      orders.push(orderToAdd);
    }
    
    return writeOrders(orders);
  } catch (error) {
    console.error('Error adding order:', error);
    return false;
  }
}

export function getStats() {
  try {
    const orders = readOrders();
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      const price = parseFloat(order.total_price || '0');
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
    
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const pendingFulfillment = orders.filter(order => 
      order.fulfillment_status !== 'fulfilled' && order.financial_status === 'paid'
    ).length;
    
    // Get the most common currency
    const currencyCounts = {};
    orders.forEach(order => {
      if (order.currency) {
        currencyCounts[order.currency] = (currencyCounts[order.currency] || 0) + 1;
      }
    });
    
    let currency = 'USD';
    if (Object.keys(currencyCounts).length > 0) {
      currency = Object.keys(currencyCounts).reduce((a, b) => 
        currencyCounts[a] > currencyCounts[b] ? a : b
      );
    }
    
    return {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      pendingFulfillment,
      currency
    };
  } catch (error) {
    console.error('Error calculating stats:', error);
    return {
      totalOrders: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      pendingFulfillment: 0,
      currency: 'USD'
    };
  }
}

// Initialize the file when this module is imported
initializeOrdersFile();