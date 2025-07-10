// @ts-nocheck
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/domains/shared/components/ui/card'
import { Button } from '@/domains/shared/components/ui/button'
import { Badge } from '@/domains/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/domains/shared/components/ui/tabs'
import { Progress } from '@/domains/shared/components/ui/progress'
import { Input } from '@/domains/shared/components/ui/input'
import { 

  Hammer, 
  Building, 
  Thermometer, 
  Cloud, 
  Users, 
  Package,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Star,
  Search,
  Filter
} from 'lucide-react'

// Force dynamic rendering to avoid SSG auth context issues
import { ConstructionEcosystemManager } from '@/domains/shared/services/construction/construction-ecosystem-manager'


export const dynamic = 'force-dynamic'
interface MaterialData {
  id: string
  name: string
  category: string
  specifications: string[]
  suppliers: number
  avgPrice: number
  climateRating: number
  availability: 'high' | 'medium' | 'low'
  seasonal: boolean
}

interface ContractorData {
  id: string
  name: string
  specialization: string[]
  rating: number
  projectsCompleted: number
  location: string
  verified: boolean
  priceRange: string
}

interface WeatherData {
  temperature: number
  humidity: number
  sandstormRisk: 'low' | 'medium' | 'high'
  constructionSuitability: number
  recommendations: string[]
}

export default function ConstructionEcosystemPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [materials, setMaterials] = useState<MaterialData[]>([])
  const [contractors, setContractors] = useState<ContractorData[]>([])
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeConstructionData = async () => {
      try {
        const ecosystemManager = new ConstructionEcosystemManager()
        
        // Mock data - in real implementation, this would come from the manager
        const mockMaterials: MaterialData[] = [
          {
            id: '1',
            name: 'Thermal Insulation Blocks',
            category: 'Insulation',
            specifications: ['High temperature resistance', 'Moisture resistant', 'Fire retardant'],
            suppliers: 12,
            avgPrice: 45,
            climateRating: 95,
            availability: 'high',
            seasonal: false
          },
          {
            id: '2',
            name: 'Sand-Resistant Concrete',
            category: 'Foundation',
            specifications: ['Enhanced durability', 'Sand penetration resistance', 'High compression'],
            suppliers: 8,
            avgPrice: 320,
            climateRating: 90,
            availability: 'medium',
            seasonal: true
          },
          {
            id: '3',
            name: 'UV-Protected Roofing',
            category: 'Roofing',
            specifications: ['UV protection', 'Heat reflection', 'Waterproof'],
            suppliers: 15,
            avgPrice: 89,
            climateRating: 88,
            availability: 'high',
            seasonal: false
          }
        ]

        const mockContractors: ContractorData[] = [
          {
            id: '1',
            name: 'Gulf Construction Masters',
            specialization: ['Residential', 'Commercial', 'Infrastructure'],
            rating: 4.8,
            projectsCompleted: 156,
            location: 'Riyadh',
            verified: true,
            priceRange: '$$-$$$'
          },
          {
            id: '2',
            name: 'Desert Build Experts',
            specialization: ['Foundation', 'Climate Optimization'],
            rating: 4.6,
            projectsCompleted: 89,
            location: 'Jeddah',
            verified: true,
            priceRange: '$-$$'
          },
          {
            id: '3',
            name: 'Saudi Construction Alliance',
            specialization: ['Large Scale', 'Government Projects'],
            rating: 4.9,
            projectsCompleted: 203,
            location: 'Dammam',
            verified: true,
            priceRange: '$$$-$$$$'
          }
        ]

        const mockWeather: WeatherData = {
          temperature: 42,
          humidity: 35,
          sandstormRisk: 'low',
          constructionSuitability: 75,
          recommendations: [
            'Morning hours (6-10 AM) optimal for concrete work',
            'Avoid exterior painting during high humidity',
            'Use thermal protection for workers',
            'Schedule foundation work for current conditions'
          ]
        }

        setMaterials(mockMaterials)
        setContractors(mockContractors)
        setWeatherData(mockWeather)
        setLoading(false)
      } catch (error) {
        console.error('Failed to initialize construction data:', error)
        setLoading(false)
      }
    }

    initializeConstructionData()
  }, [])

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredContractors = contractors.filter(contractor =>
    contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Building className="h-8 w-8 animate-pulse mx-auto mb-4" />
            <p>Loading Construction Ecosystem...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Construction Ecosystem</h1>
          <p className="text-muted-foreground">Gulf-optimized construction management and guidance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Project Planning
          </Button>
          <Button>
            <Hammer className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materials Available</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50,000+</div>
            <p className="text-xs text-muted-foreground">Gulf-optimized specifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Contractors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,000+</div>
            <p className="text-xs text-muted-foreground">Across GCC region</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData?.temperature}°C</div>
            <p className="text-xs text-muted-foreground">Construction suitability: {weatherData?.constructionSuitability}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Active</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">Across Saudi Arabia</p>
          </CardContent>
        </Card>
      </div>

      {/* Climate Alert */}
      {weatherData && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Cloud className="h-5 w-5" />
              Current Climate Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-orange-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium">Temperature</p>
                <p className="text-lg">{weatherData.temperature}°C</p>
              </div>
              <div>
                <p className="text-sm font-medium">Humidity</p>
                <p className="text-lg">{weatherData.humidity}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Sandstorm Risk</p>
                <Badge variant={weatherData.sandstormRisk === 'low' ? 'default' : 'destructive'}>
                  {weatherData.sandstormRisk}
                </Badge>
              </div>
            </div>
            <div>
              <p className="font-medium mb-2">Today's Construction Recommendations:</p>
              <ul className="space-y-1">
                {weatherData.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
          <TabsTrigger value="guidance">Building Guidance</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Material Categories</CardTitle>
                <CardDescription>Most popular construction materials by climate rating</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Insulation', 'Foundation', 'Roofing', 'Flooring', 'Exterior'].map((category, index) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={95 - index * 5} className="w-20 h-2" />
                      <span className="text-sm text-muted-foreground">{95 - index * 5}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Contractors</CardTitle>
                <CardDescription>Highest rated construction partners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contractors.slice(0, 3).map((contractor) => (
                  <div key={contractor.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{contractor.name}</p>
                      <p className="text-sm text-muted-foreground">{contractor.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{contractor.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{contractor.projectsCompleted} projects</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((material) => (
              <Card key={material.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{material.name}</CardTitle>
                      <CardDescription>{material.category}</CardDescription>
                    </div>
                    <Badge variant={material.availability === 'high' ? 'default' : 'secondary'}>
                      {material.availability}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Climate Rating</span>
                      <span>{material.climateRating}%</span>
                    </div>
                    <Progress value={material.climateRating} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Specifications:</p>
                    {material.specifications.map((spec, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {spec}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">{material.suppliers} suppliers</p>
                      <p className="font-medium">SAR {material.avgPrice}/unit</p>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contractors" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contractors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Location
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContractors.map((contractor) => (
              <Card key={contractor.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {contractor.name}
                        {contractor.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {contractor.location}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{contractor.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{contractor.priceRange}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Specializations:</p>
                    <div className="flex flex-wrap gap-1">
                      {contractor.specialization.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      {contractor.projectsCompleted} completed projects
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Portfolio</Button>
                      <Button size="sm">Get Quote</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guidance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saudi Arabia Building Guidance System</CardTitle>
              <CardDescription>Climate-optimized construction recommendations for the Gulf region</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  phase: 'Foundation Planning',
                  recommendations: [
                    'Use sand-resistant concrete mix for enhanced durability',
                    'Implement proper moisture barriers for high humidity protection',
                    'Consider seasonal soil expansion in foundation depth calculations'
                  ],
                  climateFactors: ['Soil composition', 'Seasonal moisture', 'Sand infiltration']
                },
                {
                  phase: 'Structural Framework',
                  recommendations: [
                    'Choose steel with anti-corrosion coating for coastal areas',
                    'Implement thermal expansion joints for extreme temperature variations',
                    'Use reinforced connections for sandstorm resistance'
                  ],
                  climateFactors: ['Temperature extremes', 'Humidity corrosion', 'Wind loads']
                },
                {
                  phase: 'Insulation & Protection',
                  recommendations: [
                    'Install high-performance thermal insulation (R-30 minimum)',
                    'Use reflective roofing materials to reduce heat absorption',
                    'Implement proper ventilation systems for humidity control'
                  ],
                  climateFactors: ['Extreme heat', 'Humidity control', 'Energy efficiency']
                }
              ].map((guidance, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">{guidance.phase}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Recommendations:</p>
                      <ul className="space-y-1">
                        {guidance.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Climate Factors:</p>
                      <div className="flex flex-wrap gap-1">
                        {guidance.climateFactors.map((factor, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Construction Projects</CardTitle>
              <CardDescription>Monitor ongoing projects across the region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Project management interface coming soon</p>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Project Planning Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}





