import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src', 'data');
const ordersFilePath = path.join(dataDir, 'orders.json');

function ensureDataFileExists() {
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir, { recursive: true });
	}
	if (!fs.existsSync(ordersFilePath)) {
		fs.writeFileSync(ordersFilePath, '[]', 'utf-8');
	}
}

export function readAllOrders() {
	ensureDataFileExists();
	const file = fs.readFileSync(ordersFilePath, 'utf-8');
	try {
		return JSON.parse(file);
	} catch {
		return [];
	}
}

export function appendOrder(order) {
	ensureDataFileExists();
	// Naive append with read-modify-write. Good enough for local dev.
	const existing = readAllOrders();
	existing.push(order);
	fs.writeFileSync(ordersFilePath, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
}

export function ordersPath() {
	return ordersFilePath;
}

