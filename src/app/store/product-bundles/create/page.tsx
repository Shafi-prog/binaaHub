// @ts-nocheck
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';

export const dynamic = 'force-dynamic'

export default function CreateProductBundle() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Product Bundle</CardTitle>
          <CardDescription>Create a new product bundle</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Product bundle creation interface coming soon...</p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}


