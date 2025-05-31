import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { Database } from '@/types/database';
import { Card, LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

interface ProjectOption {
  id: string;
  name: string;
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  hasWarranty: boolean;
  warrantyDurationMonths: number;
  warrantyNotes: string;
}

interface OrderFormProps {
  storeId: string;
  storeName: string;
  initialProducts: any[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function OrderForm({
  storeId,
  storeName,
  initialProducts,
  onSuccess,
  onCancel,
}: OrderFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [items, setItems] = useState<ProductItem[]>(() =>
    initialProducts.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: 1,
      hasWarranty: false,
      warrantyDurationMonths: 12,
      warrantyNotes: '',
    }))
  );

  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  // Load user's projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };

    loadProjects();
  }, [supabase]);

  const updateItem = (index: number, changes: Partial<ProductItem>) => {
    setItems((items) => items.map((item, i) => (i === index ? { ...item, ...changes } : item)));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        hasWarranty: item.hasWarranty,
        warrantyDurationMonths: item.hasWarranty ? item.warrantyDurationMonths : null,
        warrantyNotes: item.hasWarranty ? item.warrantyNotes : null,
      }));

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          storeId,
          items: orderItems,
          projectId: selectedProject,
          notes: orderNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      onSuccess?.();
      router.push(`/user/orders/${data.orderId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      setError(error instanceof Error ? error.message : 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Create Order</h2>
          <p className="text-gray-600">Store: {storeName}</p>
        </div>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project (Optional)</label>
          <select
            value={selectedProject || ''}
            onChange={(e) => setSelectedProject(e.target.value || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Order Items</h3>
          {items.map((item, index) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-gray-600">{formatCurrency(item.price)} per unit</p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="text-sm text-gray-600">
                    Quantity:
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, { quantity: parseInt(e.target.value) })}
                      className="ml-2 w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </label>
                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={item.hasWarranty}
                    onChange={(e) => updateItem(index, { hasWarranty: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Include Warranty</span>
                </label>

                {item.hasWarranty && (
                  <div className="ml-6 space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Warranty Duration (months)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.warrantyDurationMonths}
                        onChange={(e) =>
                          updateItem(index, {
                            warrantyDurationMonths: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Warranty Notes</label>
                      <textarea
                        value={item.warrantyNotes}
                        onChange={(e) => updateItem(index, { warrantyNotes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        rows={2}
                        placeholder="Add any warranty terms or conditions..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order Notes (Optional)
          </label>
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Add any special instructions or notes..."
          />
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total Amount:</span>
            <span className="text-xl font-semibold text-gray-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </Card>
  );
}
