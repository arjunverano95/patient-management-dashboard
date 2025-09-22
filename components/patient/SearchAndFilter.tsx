import React, {useState, useCallback, useEffect} from 'react';
import {Input, Select, Button, Row, Col, Card, Space, DatePicker} from 'antd';
import {SearchOutlined, FilterOutlined, ClearOutlined} from '@ant-design/icons';
import {PatientFilters} from '../../types/patient';
import dayjs from 'dayjs';

const {Search} = Input;
const {Option} = Select;
const {RangePicker} = DatePicker;

interface SearchAndFilterProps {
  /** Current filter values */
  filters: PatientFilters;
  /** Callback when filters change */
  onFilterChange: (filters: PatientFilters) => void;
  /** Whether search is in progress */
  loading: boolean;
  /** Additional CSS classes */
  className?: string;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  filters,
  onFilterChange,
  loading,
  className = '',
}) => {
  const [localFilters, setLocalFilters] = useState<PatientFilters>(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSearch = useCallback(
    (value: string) => {
      const newFilters = {...localFilters, search: value};
      setLocalFilters(newFilters);
      onFilterChange(newFilters);
    },
    [localFilters, onFilterChange],
  );

  const handleStatusChange = useCallback(
    (value: string | undefined) => {
      const newFilters = {
        ...localFilters,
        status: (value as PatientFilters['status']) || undefined,
      };
      setLocalFilters(newFilters);
      onFilterChange(newFilters);
    },
    [localFilters, onFilterChange],
  );

  const handleGenderChange = useCallback(
    (value: string | undefined) => {
      const newFilters = {
        ...localFilters,
        gender: (value as PatientFilters['gender']) || undefined,
      };
      setLocalFilters(newFilters);
      onFilterChange(newFilters);
    },
    [localFilters, onFilterChange],
  );

  const handleAgeRangeChange = useCallback(
    (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
      let ageRange: PatientFilters['ageRange'] = undefined;

      if (dates && dates[0] && dates[1]) {
        const currentYear = new Date().getFullYear();
        const minAge = currentYear - dates[1].year();
        const maxAge = currentYear - dates[0].year();
        ageRange = {min: minAge, max: maxAge};
      }

      const newFilters = {...localFilters, ageRange};
      setLocalFilters(newFilters);
      onFilterChange(newFilters);
    },
    [localFilters, onFilterChange],
  );

  const handleClearFilters = useCallback(() => {
    const clearedFilters: PatientFilters = {};
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  }, [onFilterChange]);

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== null && value !== '',
  );

  return (
    <Card className={`mb-4 ${className}`} styles={{body: {padding: '16px'}}}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Search
            placeholder="Search patients..."
            value={localFilters.search}
            onChange={(e) =>
              setLocalFilters({...localFilters, search: e.target.value})
            }
            onSearch={handleSearch}
            onPressEnter={(e) =>
              handleSearch((e.target as HTMLInputElement).value)
            }
            loading={loading}
            prefix={<SearchOutlined />}
            allowClear
            className="w-full"
          />
        </Col>

        <Col xs={12} sm={6} md={4} lg={3}>
          <Select
            placeholder="Status"
            value={localFilters.status}
            onChange={handleStatusChange}
            allowClear
            className="w-full"
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="pending">Pending</Option>
          </Select>
        </Col>

        <Col xs={12} sm={6} md={4} lg={3}>
          <Select
            placeholder="Gender"
            value={localFilters.gender}
            onChange={handleGenderChange}
            allowClear
            className="w-full"
          >
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Space wrap>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowAdvanced(!showAdvanced)}
              type={showAdvanced ? 'primary' : 'default'}
              title={
                showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'
              }
            />

            {hasActiveFilters && (
              <Button
                icon={<ClearOutlined />}
                onClick={handleClearFilters}
                type="text"
                danger
              >
                Clear All
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      {showAdvanced && (
        <Row gutter={[16, 16]} className="mt-4 pt-4 border-t border-gray-200">
          <Col xs={24} sm={12} md={8} lg={6}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Age Range
              </label>
              <RangePicker
                placeholder={['Min Age', 'Max Age']}
                onChange={handleAgeRangeChange}
                className="w-full"
                format="YYYY"
                picker="year"
              />
            </div>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default SearchAndFilter;
