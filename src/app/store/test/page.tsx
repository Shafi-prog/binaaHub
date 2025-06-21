'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Component Test Page</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
          <CardDescription>This is a test card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Badge>Test Badge</Badge>
        <Button>Test Button</Button>
        <Input placeholder="Test input" />
      </div>
    </div>
  );
}
