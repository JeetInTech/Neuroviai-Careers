/**
 * CV Forge - Template Selector Component
 * 
 * Allows users to preview and select CV templates
 */

import React, { useState } from 'react';
import { TEMPLATE_INFO } from './templates';
import { CheckCircle, Star } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  targetRole?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate,
  targetRole,
}) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  // Sort templates to show recommended ones first based on target role
  const sortedTemplates = [...TEMPLATE_INFO].sort((a, b) => {
    const aMatches = targetRole && a.roles.includes(targetRole);
    const bMatches = targetRole && b.roles.includes(targetRole);
    if (aMatches && !bMatches) return -1;
    if (!aMatches && bMatches) return 1;
    return b.atsScore - a.atsScore;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Choose a Template</h3>
        <span className="text-sm text-gray-500">
          {TEMPLATE_INFO.length} ATS-optimized templates
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedTemplates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          const isRecommended = targetRole && template.roles.includes(targetRole);
          const isHovered = hoveredTemplate === template.id;

          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              className={`
                relative p-4 rounded-lg border-2 text-left transition-all duration-200
                ${isSelected 
                  ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' 
                  : isHovered
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              {/* Recommended Badge */}
              {isRecommended && (
                <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-medium px-2 py-0.5 rounded-full">
                  <Star className="h-3 w-3" />
                  Recommended
                </div>
              )}

              {/* Selected Check */}
              {isSelected && (
                <div className="absolute top-2 right-2 text-indigo-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
              )}

              {/* Template Preview Icon */}
              <div className="text-3xl mb-2">
                {template.preview}
              </div>

              {/* Template Info */}
              <h4 className={`font-semibold text-sm ${isSelected ? 'text-indigo-700' : 'text-gray-900'}`}>
                {template.name}
              </h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {template.description}
              </p>

              {/* ATS Score Badge */}
              <div className="mt-2">
                <span className={`
                  text-xs font-medium px-2 py-0.5 rounded-full
                  ${template.atsScore >= 93 
                    ? 'bg-green-100 text-green-700' 
                    : template.atsScore >= 90 
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }
                `}>
                  ATS: {template.atsScore}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Compact dropdown version
export const TemplateDropdown: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate,
}) => {
  const selectedInfo = TEMPLATE_INFO.find(t => t.id === selectedTemplate);

  return (
    <div className="relative">
      <select
        value={selectedTemplate}
        onChange={(e) => onSelectTemplate(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {TEMPLATE_INFO.map((template) => (
          <option key={template.id} value={template.id}>
            {template.preview} {template.name} (ATS: {template.atsScore}%)
          </option>
        ))}
      </select>
      {selectedInfo && (
        <p className="mt-1 text-xs text-gray-500">{selectedInfo.description}</p>
      )}
    </div>
  );
};

export default TemplateSelector;
