'use client';

import React, { useState } from 'react';
import { useProject } from '@/domains/projects/hooks/useProject';

interface ProjectReportingProps {
  projectId: string;
}

export function ProjectReporting({ projectId }: ProjectReportingProps) {
  const { project } = useProject(projectId);
  const [reportType, setReportType] = useState('progress');

  const generateReport = async (type: string, format: 'pdf' | 'excel') => {
    try {
      console.log(`Generating ${type} report in ${format} format for project ${projectId}`);
      // This would call the reporting service
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Reports</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
              Report Type
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="progress">Progress Report</option>
              <option value="budget">Budget Analysis</option>
              <option value="completion">Completion Certificate</option>
              <option value="materials">Materials Report</option>
              <option value="team">Team Performance</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => generateReport(reportType, 'pdf')}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Generate PDF
            </button>
            <button
              onClick={() => generateReport(reportType, 'excel')}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Generate Excel
            </button>
          </div>
        </div>
      </div>

      {/* Progress Analytics */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Progress Chart Placeholder */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Project Timeline</h4>
            <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-500">Timeline Chart</span>
            </div>
          </div>

          {/* Budget Chart Placeholder */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Budget Utilization</h4>
            <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-500">Budget Chart</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Performance Indicators</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">75%</div>
            <div className="text-sm text-gray-500">Completion Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <div className="text-sm text-gray-500">Budget Efficiency</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <div className="text-sm text-gray-500">Days Remaining</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">98%</div>
            <div className="text-sm text-gray-500">Quality Score</div>
          </div>
        </div>
      </div>

      {/* Completion Certificate */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Completion</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Completion Certificate</h4>
          <p className="text-gray-600 mb-4">
            Generate an official completion certificate when your project is finished
          </p>
          <button
            onClick={() => generateReport('completion', 'pdf')}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
