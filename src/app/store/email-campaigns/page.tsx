'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function EmailCampaignsPage() {
  const [campaigns] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCampaigns = campaigns.filter((campaign: any) =>
    (campaign?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (campaign?.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalSent = campaigns.reduce((sum: number, c: any) => sum + (c?.sent_count || 0), 0)
  const totalOpened = campaigns.reduce((sum: number, c: any) => sum + (c?.opened_count || 0), 0)
  const totalClicked = campaigns.reduce((sum: number, c: any) => sum + (c?.clicked_count || 0), 0)

  const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0'
  const clickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : '0'

  const runningCampaigns = campaigns.filter((c: any) => c?.status === 'running').length
  const scheduledCampaigns = campaigns.filter((c: any) => c?.status === 'scheduled').length

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Email Campaigns</h1>
        <Button>Create Campaign</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clickRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runningCampaigns}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
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
                <TableHead>Segment</TableHead>
                <TableHead>Last Sent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No campaigns found</TableCell>
                </TableRow>
              ) : (
                filteredCampaigns.map((campaign: any) => {
                  const openRate = (campaign?.sent_count || 0) > 0 ?
                    (((campaign?.opened_count || 0) / (campaign?.sent_count || 1)) * 100).toFixed(1) : '0'
                  const clickRate = (campaign?.sent_count || 0) > 0 ?
                    (((campaign?.clicked_count || 0) / (campaign?.sent_count || 1)) * 100).toFixed(1) : '0'

                  return (
                    <TableRow key={campaign?.id || Math.random()}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign?.name || 'Unnamed Campaign'}</div>
                          <div className="text-sm text-gray-500">
                            {campaign?.subject || 'No subject'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {(campaign?.trigger_type || 'manual').replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          campaign?.status === 'running' ? 'default' :
                          campaign?.status === 'scheduled' ? 'secondary' :
                          campaign?.status === 'paused' ? 'destructive' : 'outline'
                        }>
                          {campaign?.status || 'draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>{campaign?.sent_count || 0} sent</div>
                        <div className="text-sm text-gray-500">
                          {openRate}% opened, {clickRate}% clicked
                        </div>
                      </TableCell>
                      <TableCell>
                        {campaign?.target_segment || 'All customers'}
                      </TableCell>
                      <TableCell>
                        {campaign?.last_sent_at ?
                          new Date(campaign.last_sent_at).toLocaleDateString() :
                          campaign?.scheduled_at ?
                          `Scheduled for ${new Date(campaign.scheduled_at).toLocaleDateString()}` :
                          'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {campaign?.status === 'running' ? (
                            <Button size="sm" variant="outline">
                              Pause
                            </Button>
                          ) : campaign?.status === 'paused' ? (
                            <Button size="sm" variant="outline">
                              Resume
                            </Button>
                          ) : null}
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
