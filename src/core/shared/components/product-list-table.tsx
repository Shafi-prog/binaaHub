"use client"
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/shared/components/ui/table";
import { Button } from "@/core/shared/components/ui/button";
import { Input } from "@/core/shared/components/ui/input";
import { Badge } from "@/core/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/shared/components/ui/card";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

interface Product {
  id: string;
  title: string;
  handle: string;
  status: "published" | "draft" | "archived";
  variants_count: number;
  created_at: string;
}

export function ProductListTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockProducts: Product[] = [
      {
        id: "prod_1",
        title: "Construction Helmet",
        handle: "construction-helmet",
        status: "published",
        variants_count: 3,
        created_at: "2024-01-15T10:00:00Z",
      },
      {
        id: "prod_2",
        title: "Safety Gloves",
        handle: "safety-gloves",
        status: "published",
        variants_count: 5,
        created_at: "2024-01-10T08:00:00Z",
      },
      {
        id: "prod_3",
        title: "Work Boots",
        handle: "work-boots",
        status: "draft",
        variants_count: 2,
        created_at: "2024-01-05T14:00:00Z",
      },
    ];
    
    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading products...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Products</CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.title}</div>
                    <div className="text-sm text-gray-500">{product.handle}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{product.variants_count} variants</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
