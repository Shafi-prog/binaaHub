// Mock Medusa services for standalone POS
export class ProductService {
  async list() {
    // Return mock products
    return [
      { id: '1', title: 'Cement Bag', price: 20, thumbnail: 'https://via.placeholder.com/100', inventory_quantity: 100 },
      { id: '2', title: 'Steel Rod', price: 50, thumbnail: 'https://via.placeholder.com/100', inventory_quantity: 50 },
      { id: '3', title: 'Paint Bucket', price: 35, thumbnail: 'https://via.placeholder.com/100', inventory_quantity: 30 },
      { id: '4', title: 'Bricks (1000)', price: 200, thumbnail: 'https://via.placeholder.com/100', inventory_quantity: 10 },
    ];
  }
}

export class OrderService {
  async create(orderData) {
    // Simulate order creation
    return { id: 'order_123', ...orderData };
  }
}
