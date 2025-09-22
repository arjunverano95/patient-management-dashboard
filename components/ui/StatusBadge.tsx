import React from 'react';
import {Tag} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import {Patient} from '../../types/patient';

interface StatusBadgeProps {
  /** Patient status to display */
  status: Patient['status'];
  /** Size of the badge */
  size?: 'small' | 'default' | 'large';
  /** Whether to show status icon */
  showIcon?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'default',
  showIcon = true,
  className = '',
}) => {
  const getStatusConfig = (status: Patient['status']) => {
    switch (status) {
      case 'active':
        return {
          color: 'success',
          text: 'Active',
          icon: <CheckCircleOutlined />,
        };
      case 'inactive':
        return {
          color: 'default',
          text: 'Inactive',
          icon: <StopOutlined />,
        };
      case 'pending':
        return {
          color: 'warning',
          text: 'Pending',
          icon: <ClockCircleOutlined />,
        };
      default:
        return {
          color: 'default',
          text: 'Unknown',
          icon: null,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Tag
      color={config.color}
      icon={showIcon ? config.icon : undefined}
      className={`${className} ${
        size === 'small'
          ? 'text-xs'
          : size === 'large'
          ? 'text-base'
          : 'text-sm'
      }`}
    >
      {config.text}
    </Tag>
  );
};

export default StatusBadge;
