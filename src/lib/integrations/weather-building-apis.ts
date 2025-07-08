// @ts-nocheck
/**
 * 🌤️ Weather & Building Code API Integration
 * Real-time climate data and construction compliance for GCC markets
 * 
 * @module WeatherBuildingAPIs
 * @version 2.0.0
 * @since Phase 3 - July 2025
 */

import { z } from 'zod';

// Weather Data Types
export interface WeatherData {
  location: {
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
    condition: string;
    description: string;
  };
  forecast: WeatherForecast[];
  construction: ConstructionSuitability;
  lastUpdated: string;
}

export interface WeatherForecast {
  date: string;
  temperature: { min: number; max: number };
  humidity: number;
  windSpeed: number;
  precipitation: number;
  condition: string;
  constructionSuitability: 'excellent' | 'good' | 'fair' | 'poor' | 'unsuitable';
}

export interface ConstructionSuitability {
  overall: 'excellent' | 'good' | 'fair' | 'poor' | 'unsuitable';
  factors: {
    temperature: { score: number; impact: string };
    humidity: { score: number; impact: string };
    wind: { score: number; impact: string };
    precipitation: { score: number; impact: string };
  };
  recommendations: string[];
  optimalTimes: { start: string; end: string }[];
}

// Building Code Types
export interface BuildingCode {
  id: string;
  country: string;
  region?: string;
  category: string;
  title: string;
  description: string;
  requirements: BuildingRequirement[];
  lastUpdated: string;
  version: string;
  status: 'active' | 'draft' | 'superseded';
}

export interface BuildingRequirement {
  id: string;
  section: string;
  title: string;
  description: string;
  specification: string;
  isMandatory: boolean;
  applicableClimate: string[];
  materials: string[];
  inspectionRequired: boolean;
  certificationRequired: boolean;
}

export interface ComplianceCheck {
  codeId: string;
  requirementId: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'unknown';
  notes: string;
  actionRequired?: string;
}

// Weather Request Schema
export const WeatherRequestSchema = z.object({
  location: z.object({
    city: z.string(),
    country: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
  includeForecast: z.boolean().default(true),
  forecastDays: z.number().min(1).max(14).default(7),
  includeConstruction: z.boolean().default(true),
});

export type WeatherRequest = z.infer<typeof WeatherRequestSchema>;

// Building Code Request Schema
export const BuildingCodeRequestSchema = z.object({
  country: z.string(),
  region: z.string().optional(),
  category: z.string().optional(),
  projectType: z.string().optional(),
  materials: z.array(z.string()).optional(),
});

export type BuildingCodeRequest = z.infer<typeof BuildingCodeRequestSchema>;

// GCC Weather Stations
export const GCC_WEATHER_STATIONS = [
  { city: 'Riyadh', country: 'SA', coordinates: { lat: 24.7136, lng: 46.6753 } },
  { city: 'Dubai', country: 'AE', coordinates: { lat: 25.2048, lng: 55.2708 } },
  { city: 'Kuwait City', country: 'KW', coordinates: { lat: 29.3759, lng: 47.9774 } },
  { city: 'Doha', country: 'QA', coordinates: { lat: 25.2854, lng: 51.5310 } },
  { city: 'Jeddah', country: 'SA', coordinates: { lat: 21.4858, lng: 39.1925 } },
  { city: 'Abu Dhabi', country: 'AE', coordinates: { lat: 24.2992, lng: 54.6972 } },
  { city: 'Dammam', country: 'SA', coordinates: { lat: 26.4207, lng: 50.0888 } },
];

// GCC Building Codes Database
export const GCC_BUILDING_CODES: BuildingCode[] = [
  {
    id: 'sbc_structural',
    country: 'SA',
    category: 'structural',
    title: 'Saudi Building Code - Structural Requirements',
    description: 'Structural engineering requirements for buildings in Saudi Arabia',
    version: '2.0',
    status: 'active',
    lastUpdated: '2024-01-15',
    requirements: [
      {
        id: 'sbc_seismic',
        section: '16',
        title: 'Seismic Design Requirements',
        description: 'Requirements for earthquake-resistant design',
        specification: 'Structures must be designed to resist seismic forces as per Zone 2A requirements',
        isMandatory: true,
        applicableClimate: ['arid', 'hot_arid'],
        materials: ['concrete', 'steel', 'masonry'],
        inspectionRequired: true,
        certificationRequired: true,
      },
      {
        id: 'sbc_wind',
        section: '26',
        title: 'Wind Load Design',
        description: 'Design requirements for wind loads',
        specification: 'Basic wind speed: 120 km/h for most regions, 140 km/h for coastal areas',
        isMandatory: true,
        applicableClimate: ['arid', 'coastal'],
        materials: ['concrete', 'steel'],
        inspectionRequired: true,
        certificationRequired: false,
      },
    ],
  },
  {
    id: 'uae_green',
    country: 'AE',
    category: 'sustainability',
    title: 'UAE Green Building Regulations',
    description: 'Environmental and energy efficiency requirements',
    version: '3.1',
    status: 'active',
    lastUpdated: '2024-03-20',
    requirements: [
      {
        id: 'uae_thermal',
        section: '5',
        title: 'Thermal Performance',
        description: 'Building envelope thermal requirements',
        specification: 'Overall Thermal Transfer Value (OTTV) ≤ 23 W/m²',
        isMandatory: true,
        applicableClimate: ['hot_humid', 'desert'],
        materials: ['insulation', 'glazing'],
        inspectionRequired: true,
        certificationRequired: true,
      },
    ],
  },
  {
    id: 'kuwait_fire',
    country: 'KW',
    category: 'fire_safety',
    title: 'Kuwait Fire Safety Code',
    description: 'Fire prevention and safety requirements',
    version: '1.5',
    status: 'active',
    lastUpdated: '2023-11-10',
    requirements: [
      {
        id: 'kw_egress',
        section: '7',
        title: 'Emergency Egress',
        description: 'Emergency exit requirements',
        specification: 'Minimum 2 exits per floor, maximum travel distance 45m',
        isMandatory: true,
        applicableClimate: ['all'],
        materials: ['all'],
        inspectionRequired: true,
        certificationRequired: true,
      },
    ],
  },
];

/**
 * Weather API Manager
 * Handles weather data retrieval and construction suitability analysis
 */
export class WeatherAPIManager {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || 'demo_key';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  /**
   * Get current weather and construction suitability
   */
  public async getWeatherData(request: WeatherRequest): Promise<WeatherData> {
    try {
      // Validate request
      WeatherRequestSchema.parse(request);

      // Get current weather
      const currentWeather = await this.getCurrentWeather(request.location);
      
      // Get forecast if requested
      const forecast = request.includeForecast
        ? await this.getWeatherForecast(request.location, request.forecastDays)
        : [];

      // Calculate construction suitability
      const constructionSuitability = request.includeConstruction
        ? this.calculateConstructionSuitability(currentWeather)
        : this.getDefaultConstructionSuitability();

      return {
        location: request.location,
        current: currentWeather,
        forecast,
        construction: constructionSuitability,
        lastUpdated: new Date().toISOString(),
      };

    } catch (error) {
      console.error('Error getting weather data:', error);
      throw error;
    }
  }

  /**
   * Get current weather conditions
   */
  private async getCurrentWeather(location: any): Promise<WeatherData['current']> {
    // In production, this would call actual weather API
    // Simulating weather data for now
    await new Promise(resolve => setTimeout(resolve, 300));

    // Generate realistic weather data for GCC region
    const baseTemp = this.getBaseTemperature(location.country);
    const variation = (Math.random() - 0.5) * 10;

    return {
      temperature: baseTemp + variation,
      humidity: Math.floor(Math.random() * 40) + 30, // 30-70%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      windDirection: Math.floor(Math.random() * 360),
      pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
      visibility: Math.floor(Math.random() * 5) + 5, // 5-10 km
      uvIndex: Math.floor(Math.random() * 6) + 6, // 6-11 (high in GCC)
      condition: this.getRandomCondition(),
      description: 'Hot and mostly clear',
    };
  }

  /**
   * Get weather forecast
   */
  private async getWeatherForecast(location: any, days: number): Promise<WeatherForecast[]> {
    // Simulate forecast data
    await new Promise(resolve => setTimeout(resolve, 200));

    const forecast: WeatherForecast[] = [];
    const baseTemp = this.getBaseTemperature(location.country);

    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const dayTemp = baseTemp + (Math.random() - 0.5) * 15;
      const humidity = Math.floor(Math.random() * 30) + 35;
      const windSpeed = Math.floor(Math.random() * 15) + 8;
      const precipitation = Math.random() * 5; // 0-5mm

      forecast.push({
        date: date.toISOString().split('T')[0],
        temperature: {
          min: Math.floor(dayTemp - 8),
          max: Math.floor(dayTemp + 8),
        },
        humidity,
        windSpeed,
        precipitation,
        condition: this.getRandomCondition(),
        constructionSuitability: this.evaluateConstructionSuitability(
          dayTemp, humidity, windSpeed, precipitation
        ),
      });
    }

    return forecast;
  }

  /**
   * Calculate construction suitability based on weather
   */
  private calculateConstructionSuitability(weather: WeatherData['current']): ConstructionSuitability {
    const tempScore = this.evaluateTemperature(weather.temperature);
    const humidityScore = this.evaluateHumidity(weather.humidity);
    const windScore = this.evaluateWind(weather.windSpeed);
    const precipScore = 100; // No precipitation in current weather

    const overallScore = (tempScore + humidityScore + windScore + precipScore) / 4;
    
    return {
      overall: this.getOverallSuitability(overallScore),
      factors: {
        temperature: {
          score: tempScore,
          impact: this.getTemperatureImpact(weather.temperature),
        },
        humidity: {
          score: humidityScore,
          impact: this.getHumidityImpact(weather.humidity),
        },
        wind: {
          score: windScore,
          impact: this.getWindImpact(weather.windSpeed),
        },
        precipitation: {
          score: precipScore,
          impact: 'No precipitation - excellent for construction',
        },
      },
      recommendations: this.generateRecommendations(weather),
      optimalTimes: this.getOptimalConstructionTimes(),
    };
  }

  /**
   * Get base temperature for country
   */
  private getBaseTemperature(country: string): number {
    const temps = {
      'SA': 35, // Saudi Arabia
      'AE': 33, // UAE
      'KW': 36, // Kuwait
      'QA': 34, // Qatar
    };
    return temps[country as keyof typeof temps] || 35;
  }

  /**
   * Get random weather condition
   */
  private getRandomCondition(): string {
    const conditions = ['clear', 'partly_cloudy', 'cloudy', 'hazy', 'dusty'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  /**
   * Evaluate temperature for construction
   */
  private evaluateTemperature(temp: number): number {
    if (temp < 20) return 60; // Too cold
    if (temp <= 30) return 100; // Ideal
    if (temp <= 40) return 80; // Good
    if (temp <= 45) return 50; // Challenging
    return 20; // Too hot
  }

  /**
   * Evaluate humidity for construction
   */
  private evaluateHumidity(humidity: number): number {
    if (humidity < 30) return 90; // Dry - good for concrete
    if (humidity <= 60) return 100; // Ideal
    if (humidity <= 80) return 70; // Acceptable
    return 40; // Too humid
  }

  /**
   * Evaluate wind for construction
   */
  private evaluateWind(windSpeed: number): number {
    if (windSpeed < 10) return 100; // Calm
    if (windSpeed <= 20) return 90; // Light breeze
    if (windSpeed <= 30) return 60; // Moderate
    return 30; // Too windy
  }

  /**
   * Evaluate construction suitability
   */
  private evaluateConstructionSuitability(
    temp: number, humidity: number, wind: number, precip: number
  ): 'excellent' | 'good' | 'fair' | 'poor' | 'unsuitable' {
    const tempScore = this.evaluateTemperature(temp);
    const humidityScore = this.evaluateHumidity(humidity);
    const windScore = this.evaluateWind(wind);
    const precipScore = precip > 5 ? 20 : precip > 1 ? 60 : 100;

    const average = (tempScore + humidityScore + windScore + precipScore) / 4;

    if (average >= 90) return 'excellent';
    if (average >= 75) return 'good';
    if (average >= 60) return 'fair';
    if (average >= 40) return 'poor';
    return 'unsuitable';
  }

  /**
   * Get overall suitability rating
   */
  private getOverallSuitability(score: number): 'excellent' | 'good' | 'fair' | 'poor' | 'unsuitable' {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    if (score >= 40) return 'poor';
    return 'unsuitable';
  }

  /**
   * Get temperature impact description
   */
  private getTemperatureImpact(temp: number): string {
    if (temp < 20) return 'Temperature too low for optimal concrete curing';
    if (temp <= 30) return 'Ideal temperature for construction activities';
    if (temp <= 40) return 'High temperature - increased hydration required';
    if (temp <= 45) return 'Very hot - limit exposure time, frequent breaks';
    return 'Extreme heat - avoid concrete work, safety risks';
  }

  /**
   * Get humidity impact description
   */
  private getHumidityImpact(humidity: number): string {
    if (humidity < 30) return 'Low humidity - excellent for concrete setting';
    if (humidity <= 60) return 'Optimal humidity for construction';
    if (humidity <= 80) return 'High humidity - slower concrete drying';
    return 'Very high humidity - extended curing time required';
  }

  /**
   * Get wind impact description
   */
  private getWindImpact(windSpeed: number): string {
    if (windSpeed < 10) return 'Calm conditions - ideal for all construction';
    if (windSpeed <= 20) return 'Light wind - good conditions';
    if (windSpeed <= 30) return 'Moderate wind - caution with lifting operations';
    return 'Strong wind - suspend crane operations, secure materials';
  }

  /**
   * Generate construction recommendations
   */
  private generateRecommendations(weather: WeatherData['current']): string[] {
    const recommendations: string[] = [];

    if (weather.temperature > 40) {
      recommendations.push('Schedule concrete pours during early morning hours');
      recommendations.push('Increase water content monitoring');
      recommendations.push('Implement frequent worker break schedules');
    }

    if (weather.humidity > 70) {
      recommendations.push('Allow extended curing time for concrete');
      recommendations.push('Monitor for surface moisture issues');
    }

    if (weather.windSpeed > 25) {
      recommendations.push('Suspend crane and lifting operations');
      recommendations.push('Secure loose materials and scaffolding');
    }

    if (weather.uvIndex > 8) {
      recommendations.push('Provide shade for workers');
      recommendations.push('Mandate protective clothing and sunscreen');
    }

    return recommendations;
  }

  /**
   * Get optimal construction times
   */
  private getOptimalConstructionTimes(): { start: string; end: string }[] {
    // GCC region optimal times (avoiding midday heat)
    return [
      { start: '06:00', end: '10:00' },
      { start: '16:00', end: '19:00' },
    ];
  }

  /**
   * Get default construction suitability
   */
  private getDefaultConstructionSuitability(): ConstructionSuitability {
    return {
      overall: 'good',
      factors: {
        temperature: { score: 80, impact: 'Moderate temperature' },
        humidity: { score: 80, impact: 'Acceptable humidity' },
        wind: { score: 90, impact: 'Light wind conditions' },
        precipitation: { score: 100, impact: 'No precipitation' },
      },
      recommendations: ['Monitor weather conditions regularly'],
      optimalTimes: [
        { start: '06:00', end: '10:00' },
        { start: '16:00', end: '19:00' },
      ],
    };
  }
}

/**
 * Building Code Manager
 * Handles building code compliance checking
 */
export class BuildingCodeManager {
  private codes: Map<string, BuildingCode>;

  constructor() {
    this.codes = new Map();
    this.initializeCodes();
  }

  /**
   * Initialize building codes
   */
  private initializeCodes(): void {
    GCC_BUILDING_CODES.forEach(code => {
      this.codes.set(code.id, code);
    });
  }

  /**
   * Get building codes for a request
   */
  public getBuildingCodes(request: BuildingCodeRequest): BuildingCode[] {
    BuildingCodeRequestSchema.parse(request);

    return Array.from(this.codes.values())
      .filter(code => {
        if (code.country !== request.country) return false;
        if (request.region && code.region && code.region !== request.region) return false;
        if (request.category && code.category !== request.category) return false;
        return code.status === 'active';
      });
  }

  /**
   * Check compliance for a project
   */
  public checkCompliance(
    codeIds: string[],
    projectDetails: {
      materials: string[];
      projectType: string;
      location: string;
    }
  ): ComplianceCheck[] {
    const checks: ComplianceCheck[] = [];

    codeIds.forEach(codeId => {
      const code = this.codes.get(codeId);
      if (!code) return;

      code.requirements.forEach(requirement => {
        const isApplicable = this.isRequirementApplicable(requirement, projectDetails);
        
        if (isApplicable) {
          checks.push({
            codeId,
            requirementId: requirement.id,
            status: 'unknown', // Would be determined by actual inspection
            notes: `Requirement: ${requirement.title}`,
            actionRequired: requirement.isMandatory ? 'Compliance verification required' : undefined,
          });
        }
      });
    });

    return checks;
  }

  /**
   * Check if requirement is applicable to project
   */
  private isRequirementApplicable(
    requirement: BuildingRequirement,
    projectDetails: any
  ): boolean {
    // Check if any project materials match requirement materials
    if (requirement.materials.length > 0) {
      const hasMatchingMaterial = requirement.materials.some(material =>
        projectDetails.materials.includes(material) || material === 'all'
      );
      if (!hasMatchingMaterial) return false;
    }

    return true;
  }

  /**
   * Get code statistics
   */
  public getCodeStats(): {
    totalCodes: number;
    codesByCountry: Record<string, number>;
    codesByCategory: Record<string, number>;
    mandatoryRequirements: number;
  } {
    const codes = Array.from(this.codes.values());
    
    let mandatoryRequirements = 0;
    codes.forEach(code => {
      mandatoryRequirements += code.requirements.filter(r => r.isMandatory).length;
    });

    return {
      totalCodes: codes.length,
      codesByCountry: codes.reduce((acc, code) => {
        acc[code.country] = (acc[code.country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      codesByCategory: codes.reduce((acc, code) => {
        acc[code.category] = (acc[code.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      mandatoryRequirements,
    };
  }
}

// Export singleton instances
export const weatherAPIManager = new WeatherAPIManager();
export const buildingCodeManager = new BuildingCodeManager();

// Export utility functions
export const getConstructionWeather = async (location: any) => {
  return await weatherAPIManager.getWeatherData({
    location,
    includeForecast: true,
    forecastDays: 7,
    includeConstruction: true,
  });
};

export const checkBuildingCodeCompliance = (country: string, projectDetails: any) => {
  const codes = buildingCodeManager.getBuildingCodes({ country });
  const codeIds = codes.map(code => code.id);
  return buildingCodeManager.checkCompliance(codeIds, projectDetails);
};


