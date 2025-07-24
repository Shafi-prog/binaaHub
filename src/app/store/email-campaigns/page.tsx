'use client'


// Force dynamic rendering to avoid SSG auth context issues
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/shared/components/ui/card"
import { Button } from "@/core/shared/components/ui/button"
import { Badge } from "@/core/shared/components/ui/badge"
import { Input } from "@/core/shared/components/ui/input"
import { Plus, Search, Edit, Trash2, Mail, Send, Users, TrendingUp, Calendar, Play, Pause } from "lucide-react"
import Link from "next/link"



export const dynamic = 'force-dynamic'
// Table component replacement
const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">{children}</table>
  </div>
)
const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50">{children}</thead>
)
const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
)
const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b hover:bg-gray-50">{children}</tr>
)
const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left p-4 font-medium text-gray-900">{children}</th>
)
const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="p-4 text-gray-600">{children}</td>
)

// Mock data based on proven email marketing patterns from OpenCart/PrestaShop/Magento
const mockCampaigns = [
  {
    id: '1',
    name: 'Welcome Series - New Customers',
    description: 'Automated welcome email series for new registrations',
    type: 'email',
    status: 'running',
    trigger_type: 'welcome_series',
    subject: 'Welcome to Our Store! Here\'s 10% off your first order',
    target_segment: 'New Registrations',
    sent_count: 45,
    delivered_count: 44,
    opened_count: 32,
    clicked_count: 18,
    unsubscribed_count: 1,
    scheduled_at: null,
    last_sent_at: '2024-01-06T10:30:00Z',
    created_at: '2024-01-01'
  },
  {
    id: '2',
    name: 'Abandoned Cart Recovery',
    description: 'Recover abandoned carts with personalized offers',
    type: 'email',
    status: 'running',
    trigger_type: 'abandoned_cart',
    subject: 'You left something behind... Complete your order now!',
    target_segment: 'Cart Abandoners',
    sent_count: 234,
    delivered_count: 230,
    opened_count: 145,
    clicked_count: 67,
    unsubscribed_count: 3,
    scheduled_at: null,
    last_sent_at: '2024-01-06T15:45:00Z',
    created_at: '2024-01-02'
  },
  {
    id: '3',
    name: 'VIP Customer Exclusive Sale',
    description: 'Special 48-hour sale for high-value customers',
    type: 'email',
    status: 'scheduled',
    trigger_type: 'scheduled',
    subject: 'VIP Exclusive: 25% Off Everything - 48 Hours Only!',
    target_segment: 'VIP Customers',
    sent_count: 0,
    delivered_count: 0,
    opened_count: 0,
    clicked_count: 0,
    unsubscribed_count: 0,
    scheduled_at: '2024-01-08T09:00:00Z',
    last_sent_at: null,
    created_at: '2024-01-05'
  },
  {
    id: '4',
    name: 'Win-Back Campaign',
    description: 'Re-engage customers who haven\'t purchased in 6 months',
    type: 'email',
    status: 'running',
    trigger_type: 'win_back',
    subject: 'We miss you! Here\'s 20% off to welcome you back',
    target_segment: 'Win-Back Targets',
    sent_count: 892,
    delivered_count: 856,
    opened_count: 312,
    clicked_count: 89,
    unsubscribed_count: 12,
    scheduled_at: null,
    last_sent_at: '2024-01-06T08:00:00Z',
    created_at: '2024-01-03'
  },
  {
    id: '5',
    name: 'Product Recommendations',
    description: 'Personalized product recommendations based on browsing history',
    type: 'email',
    status: 'paused',
    trigger_type: 'event_based',
    subject: 'Products we think you\'ll love',
    target_segment: 'High-Value Customers',
    sent_count: 156,
    delivered_count: 152,
    opened_count: 89,
    clicked_count: 34,
    unsubscribed_count: 2,
    scheduled_at: null,
    last_sent_at: '2024-01-04T14:20:00Z',
    created_at: '2024-01-04'
  }
]

export default function EmailCampaigns() {
  const [searchQuery, setSearchQuery] = useState("")
  const [campaigns] = useState(mockCampaigns)

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalSent = campaigns.reduce((sum, c) => sum + c.sent_count, 0)
  const totalOpened = campaigns.reduce((sum, c) => sum + c.opened_count, 0)
  const totalClicked = campaigns.reduce((sum, c) => sum + c.clicked_count, 0)
  const averageOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0'
  const averageClickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : '0'

  const runningCampaigns = campaigns.filter(c => c.status === 'running').length
  const scheduledCampaigns = campaigns.filter(c => c.status === 'scheduled').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage automated email marketing campaigns
          </p>
        </div>
        <Button className="gap-2" onClick={() => alert('Button clicked')}>
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runningCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {scheduledCampaigns} scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent.toLocaleString('en-US')}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageOpenRate}%</div>
            <p className="text-xs text-muted-foreground">
              Industry avg: 21.3%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Click Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageClickRate}%</div>
            <p className="text-xs text-muted-foreground">
              Industry avg: 2.6%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Management</CardTitle>
          <CardDescription>
            Monitor and manage your email marketing campaigns and automation workflows
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Target Segment</TableHead>
                <TableHead>Last Sent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => {
                const openRate = campaign.sent_count > 0 ? 
                  ((campaign.opened_count / campaign.sent_count) * 100).toFixed(1) : '0'
                const clickRate = campaign.sent_count > 0 ? 
                  ((campaign.clicked_count / campaign.sent_count) * 100).toFixed(1) : '0'
                
                return (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {campaign.subject}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {campaign.trigger_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        campaign.status === 'running' ? 'default' : 
                        campaign.status === 'scheduled' ? 'secondary' :
                        campaign.status === 'paused' ? 'destructive' : 'outline'
                      }>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{campaign.sent_count} sent</div>
                        <div className="text-muted-foreground">
                          {openRate}% open, {clickRate}% click
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {campaign.target_segment}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {campaign.last_sent_at ? 
                          new Date(campaign.last_sent_at).toLocaleDateString() : 
                          campaign.scheduled_at ?
                          `Scheduled for ${new Date(campaign.scheduled_at).toLocaleDateString()}` :
                          'Never'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {campaign.status === 'running' ? (
                          <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : campaign.status === 'paused' ? (
                          <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
                            <Play className="h-4 w-4" />
                          </Button>
                        ) : null}
                        <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Campaign Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Campaign Templates</CardTitle>
          <CardDescription>
            Quick-start templates based on proven email marketing patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Welcome Series</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Multi-email onboarding sequence for new customers
              </p>
              <div className="text-xs">
                <div>• Welcome + discount email (immediate)</div>
                <div>• Product highlights (day 3)</div>
                <div>• Customer testimonials (day 7)</div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Abandoned Cart</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Recover lost sales with timely reminders
              </p>
              <div className="text-xs">
                <div>• Reminder email (1 hour)</div>
                <div>• Incentive offer (24 hours)</div>
                <div>• Final chance (72 hours)</div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Win-Back</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Re-engage inactive customers
              </p>
              <div className="text-xs">
                <div>• "We miss you" message</div>
                <div>• Special discount offer</div>
                <div>• Product recommendations</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}





