// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ConstructionCategory } from '@/core/shared/types/construction';

// GET /api/categories/construction
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'ar';
    const includeInactive = searchParams.get('include_inactive') === 'true';
    const parentId = searchParams.get('parent_id');

    let query = supabase
      .from('construction_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    if (parentId) {
      query = query.eq('parent_id', parentId);
    } else if (parentId === null) {
      query = query.is('parent_id', null);
    }

    const { data: categories, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }

    // Build hierarchical structure
    const categoriesMap = new Map();
    const rootCategories: any[] = [];

    // First pass: create all category nodes
    categories?.forEach(category => {
      categoriesMap.set(category.id, {
        ...category,
        children: []
      });
    });

    // Second pass: build hierarchy
    categories?.forEach(category => {
      const categoryNode = categoriesMap.get(category.id);
      if (category.parent_id) {
        const parent = categoriesMap.get(category.parent_id);
        if (parent) {
          parent.children.push(categoryNode);
        }
      } else {
        rootCategories.push(categoryNode);
      }
    });

    return NextResponse.json({
      success: true,
      categories: rootCategories,
      total: categories?.length || 0
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/categories/construction
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name_ar,
      name_en,
      description_ar,
      description_en,
      parent_id,
      icon,
      sort_order = 0
    } = body;

    // Validation
    if (!name_ar || name_ar.trim().length === 0) {
      return NextResponse.json({ error: 'Arabic name is required' }, { status: 400 });
    }

    // Calculate level based on parent
    let level = 1;
    if (parent_id) {
      const { data: parentCategory } = await supabase
        .from('construction_categories')
        .select('level')
        .eq('id', parent_id)
        .single();
      
      if (parentCategory) {
        level = parentCategory.level + 1;
      }
    }

    // Generate ID
    const categoryId = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const categoryData = {
      id: categoryId,
      name_ar: name_ar.trim(),
      name_en: name_en?.trim() || null,
      description_ar: description_ar?.trim() || null,
      description_en: description_en?.trim() || null,
      parent_id: parent_id || null,
      icon: icon || null,
      sort_order,
      level,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: category, error } = await supabase
      .from('construction_categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      category,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/categories/construction
export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name_ar,
      name_en,
      description_ar,
      description_en,
      parent_id,
      icon,
      sort_order,
      is_active
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    if (!name_ar || name_ar.trim().length === 0) {
      return NextResponse.json({ error: 'Arabic name is required' }, { status: 400 });
    }

    // Check if category exists
    const { data: existingCategory } = await supabase
      .from('construction_categories')
      .select('*')
      .eq('id', id)
      .single();

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Calculate level if parent changed
    let level = existingCategory.level;
    if (parent_id !== existingCategory.parent_id) {
      if (parent_id) {
        const { data: parentCategory } = await supabase
          .from('construction_categories')
          .select('level')
          .eq('id', parent_id)
          .single();
        
        if (parentCategory) {
          level = parentCategory.level + 1;
        }
      } else {
        level = 1;
      }
    }

    const updateData = {
      name_ar: name_ar.trim(),
      name_en: name_en?.trim() || null,
      description_ar: description_ar?.trim() || null,
      description_en: description_en?.trim() || null,
      parent_id: parent_id || null,
      icon: icon || null,
      sort_order: sort_order || existingCategory.sort_order,
      level,
      is_active: is_active !== undefined ? is_active : existingCategory.is_active,
      updated_at: new Date().toISOString()
    };

    const { data: category, error } = await supabase
      .from('construction_categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/categories/construction
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Check if category exists
    const { data: existingCategory } = await supabase
      .from('construction_categories')
      .select('*')
      .eq('id', id)
      .single();

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if category has children
    const { data: children } = await supabase
      .from('construction_categories')
      .select('id')
      .eq('parent_id', id);

    if (children && children.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete category with subcategories' 
      }, { status: 409 });
    }

    // Check if category has products
    const { data: products } = await supabase
      .from('construction_products')
      .select('id')
      .eq('category_id', id);

    if (products && products.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete category with products' 
      }, { status: 409 });
    }

    // Delete the category
    const { error } = await supabase
      .from('construction_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


