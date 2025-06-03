import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const period = parseInt(searchParams.get('period') || '30') // days

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - period)

    switch (action) {
      case 'user_dashboard':
        // Get user's overall analytics
        const [
          { data: totalPurchases },
          { data: totalCommissions },
          { data: activeWarranties },
          { data: activeContracts },
          { data: recentPurchases }
        ] = await Promise.all([
          // Total purchases
          supabase
            .from('orders')
            .select('total_amount')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .gte('created_at', startDate.toISOString()),
          
          // Total commissions earned
          supabase
            .from('commissions')
            .select('amount')
            .eq('referrer_id', user.id)
            .gte('created_at', startDate.toISOString()),
          
          // Active warranties
          supabase
            .from('warranties')
            .select('id')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .gt('warranty_expiration', new Date().toISOString()),
          
          // Active contracts (as client or supervisor)
          supabase
            .from('construction_contracts')
            .select('id')
            .or(`client_id.eq.${user.id},supervisor_id.eq.${user.id}`)
            .eq('status', 'active'),
          
          // Recent purchases for trend
          supabase
            .from('orders')
            .select('created_at, total_amount')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .gte('created_at', startDate.toISOString())
            .order('created_at', { ascending: true })
        ])

        const totalSpent = totalPurchases?.reduce((sum, purchase) => sum + purchase.total_amount, 0) || 0
        const totalEarned = totalCommissions?.reduce((sum, commission) => sum + commission.amount, 0) || 0

        return NextResponse.json({
          period,
          summary: {
            totalSpent,
            totalEarned,
            activeWarranties: activeWarranties?.length || 0,
            activeContracts: activeContracts?.length || 0,
            purchaseCount: totalPurchases?.length || 0
          },
          trends: {
            purchases: recentPurchases || []
          }
        })

      case 'store_dashboard':
        // Check if user has a store
        const { data: store, error: storeError } = await supabase
          .from('stores')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (storeError || !store) {
          return NextResponse.json(
            { error: 'Store not found' },
            { status: 404 }
          )
        }

        const [
          { data: storeSales },
          { data: storeOrders },
          { data: topProducts },
          { data: inventoryItems }
        ] = await Promise.all([
          // Store sales
          supabase
            .from('orders')
            .select('total_amount, created_at')
            .eq('store_id', store.id)
            .eq('status', 'completed')
            .gte('created_at', startDate.toISOString()),
          
          // Store orders count
          supabase
            .from('orders')
            .select('id, status')
            .eq('store_id', store.id)
            .gte('created_at', startDate.toISOString()),
          
          // Top selling products
          supabase
            .from('order_items')
            .select(`
              global_item_id,
              quantity,
              global_items (name, image_url)
            `)
            .eq('store_id', store.id)
            .gte('created_at', startDate.toISOString()),
          
          // Inventory status
          supabase
            .from('store_inventory')
            .select('quantity_available, price')
            .eq('store_id', store.id)
        ])

        const totalRevenue = storeSales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0
        const pendingOrders = storeOrders?.filter(order => order.status === 'pending').length || 0
        const completedOrders = storeOrders?.filter(order => order.status === 'completed').length || 0

        // Group products by sales
        const productSales = topProducts?.reduce((acc: any, item) => {
          const productId = item.global_item_id
          if (!acc[productId]) {
            acc[productId] = {
              ...item.global_items,
              totalSold: 0
            }
          }
          acc[productId].totalSold += item.quantity
          return acc
        }, {})

        const topSellingProducts = Object.values(productSales || {})
          .sort((a: any, b: any) => b.totalSold - a.totalSold)
          .slice(0, 5)

        return NextResponse.json({
          period,
          summary: {
            totalRevenue,
            pendingOrders,
            completedOrders,
            totalOrders: storeOrders?.length || 0,
            inventoryItems: inventoryItems?.length || 0,
            totalInventoryValue: inventoryItems?.reduce((sum, item) => sum + (item.quantity_available * item.price), 0) || 0
          },
          topProducts: topSellingProducts,
          salesTrend: storeSales || []
        })

      case 'commission_analytics':
        const [
          { data: myCommissions },
          { data: myInviteCodes },
          { data: referredUsers },
          { data: referredStores }
        ] = await Promise.all([
          // My commissions
          supabase
            .from('commissions')
            .select('amount, commission_type, created_at')
            .eq('referrer_id', user.id)
            .gte('created_at', startDate.toISOString()),
          
          // My invite codes
          supabase
            .from('invite_codes')
            .select('code, type, usage_count, created_at')
            .eq('created_by', user.id),
          
          // Users I referred
          supabase
            .from('commissions')
            .select('id')
            .eq('referrer_id', user.id)
            .eq('commission_type', 'user_signup'),
            // Stores I referred
          supabase
            .from('commissions')
            .select('id')
            .eq('referrer_id', user.id)
            .eq('commission_type', 'store_signup')
        ])

        const commissionsByType = myCommissions?.reduce((acc: any, commission) => {
          if (!acc[commission.commission_type]) {
            acc[commission.commission_type] = 0
          }
          acc[commission.commission_type] += commission.amount
          return acc
        }, {}) || {}

        return NextResponse.json({
          period,
          summary: {
            totalCommissions: myCommissions?.reduce((sum, c) => sum + c.amount, 0) || 0,
            activeInviteCodes: myInviteCodes?.length || 0,
            referredUsers: referredUsers?.length || 0,
            referredStores: referredStores?.length || 0
          },
          commissionsByType,
          commissionTrend: myCommissions || [],
          inviteCodes: myInviteCodes || []
        })

      case 'supervisor_analytics':
        // First get contracts
        const { data: myContracts } = await supabase
          .from('construction_contracts')
          .select('id, total_amount, status, created_at')
          .eq('supervisor_id', user.id)
          .gte('created_at', startDate.toISOString())

        const contractIds = myContracts?.map(c => c.id) || []

        // Then get related data
        const [
          { data: contractExpenses },
          { data: completedMilestones },
          { data: managedWorkers }
        ] = await Promise.all([
          // Expenses on my contracts
          supabase
            .from('project_expenses')
            .select('amount, status, expense_date')
            .in('contract_id', contractIds)
            .gte('expense_date', startDate.toISOString()),
          
          // Completed milestones
          supabase
            .from('payment_milestones')
            .select('amount, completion_date')
            .in('contract_id', contractIds)
            .eq('status', 'completed')
            .gte('completion_date', startDate.toISOString()),
          
          // Workers managed
          supabase
            .from('project_workers')
            .select('id, daily_rate')
            .in('contract_id', contractIds)
        ])

        const totalContractValue = myContracts?.reduce((sum, contract) => sum + contract.total_amount, 0) || 0
        const totalExpenses = contractExpenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0
        const earnedFromMilestones = completedMilestones?.reduce((sum, milestone) => sum + milestone.amount, 0) || 0

        return NextResponse.json({
          period,
          summary: {
            activeContracts: myContracts?.filter(c => c.status === 'active').length || 0,
            totalContractValue,
            totalExpenses,
            earnedFromMilestones,
            managedWorkers: managedWorkers?.length || 0
          },
          contracts: myContracts || [],
          expenses: contractExpenses || [],
          milestones: completedMilestones || []
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
