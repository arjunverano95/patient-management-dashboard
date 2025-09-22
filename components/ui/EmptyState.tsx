import React from 'react';
import {Button, Empty} from 'antd';
import {
  UserAddOutlined,
  SearchOutlined,
  FilterOutlined,
} from '@ant-design/icons';

interface EmptyStateProps {
  /** Title text to display */
  title?: string;
  /** Description text to display */
  description?: string;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Text for action button */
  actionText?: string;
  /** Callback when action button is clicked */
  onAction?: () => void;
  /** Type of empty state */
  type?: 'no-data' | 'no-results' | 'error';
  /** Additional CSS classes */
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  type = 'no-data',
  className = '',
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'no-results':
        return {
          title: 'No patients found',
          description:
            'Try adjusting your search criteria or filters to find patients.',
          icon: <SearchOutlined className="text-6xl text-gray-300" />,
        };
      case 'error':
        return {
          title: 'Unable to load patients',
          description:
            'There was an error loading the patient data. Please try again.',
          icon: <FilterOutlined className="text-6xl text-red-300" />,
        };
      default:
        return {
          title: 'No patients yet',
          description:
            'Get started by adding your first patient to the system.',
          icon: <UserAddOutlined className="text-6xl text-gray-300" />,
        };
    }
  };

  const content = {
    title: title || getDefaultContent().title,
    description: description || getDefaultContent().description,
    icon: icon || getDefaultContent().icon,
  };

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <Empty
        image={content.icon}
        description={
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              {content.title}
            </h3>
            <p className="text-gray-500 max-w-sm">{content.description}</p>
            {actionText && onAction && (
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={onAction}
                className="mt-4"
              >
                {actionText}
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
};

export default EmptyState;
