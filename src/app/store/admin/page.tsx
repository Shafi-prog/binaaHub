'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Edit, 
  Trash2,
  Eye,
  DollarSign,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

// This file is ported from Medusa admin dashboard to expose full features at /store/admin
// ...existing code from medusa/admin/page.tsx will be placed here...
