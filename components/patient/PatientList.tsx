import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Tooltip,
  Pagination,
} from 'antd';
import {message} from '../../lib/message';
import {useQuery, useMutation} from '@apollo/client';
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import {Patient, PatientFilters} from '../../types/patient';
import StatusBadge from '../ui/StatusBadge';
import EmptyState from '../ui/EmptyState';
import SearchAndFilter from './SearchAndFilter';
import PatientForm from './PatientForm';
import {GET_PATIENTS, DELETE_PATIENT} from '../../lib/graphql/queries';

const {Title, Text} = Typography;

interface PatientListProps {
  /** Additional CSS classes */
  className?: string;
}

/** Maps page numbers to their corresponding cursor for pagination */
type CursorMap = Record<number, string | undefined>;

const PatientList: React.FC<PatientListProps> = ({className = ''}) => {
  const [filters, setFilters] = useState<PatientFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();

  const [pageCursors, setPageCursors] = useState<CursorMap>({1: undefined});
  const {data, loading, error, refetch, fetchMore} = useQuery(GET_PATIENTS, {
    variables: {
      first: pageSize,
      after: pageCursors[currentPage], // <-- real cursor for this page
      search: filters.search,
      status: filters.status,
      gender: filters.gender,
      ageRange: filters.ageRange,
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  const [deletePatientMutation] = useMutation(DELETE_PATIENT);

  const patients: Patient[] =
    data?.patients?.edges?.map((edge: any) => edge.node) || [];
  const totalCount: number = data?.patients?.totalCount ?? 0;
  const pagination = useMemo(
    () => ({
      current: currentPage || 1,
      pageSize: pageSize || 10,
      total: totalCount || 0,
      totalPages: Math.ceil((totalCount || 0) / (pageSize || 10)),
    }),
    [currentPage, pageSize, totalCount],
  );

  useEffect(() => {
    const endCursor = data?.patients?.pageInfo?.endCursor as string | undefined;
    if (!loading) {
      setPageCursors((prev) => {
        const nextPage = currentPage + 1;
        if (endCursor && prev[nextPage] === undefined) {
          return {...prev, [nextPage]: endCursor};
        }
        if (prev[1] !== undefined) {
          return {...prev, 1: undefined};
        }
        return prev;
      });
    }
  }, [loading, data, currentPage]);
  useEffect(() => {
    setCurrentPage(1);
    setPageCursors({1: undefined});
  }, [filters, pageSize]);

  const handleFilterChange = useCallback((newFilters: PatientFilters) => {
    setFilters(newFilters);
  }, []);
  const ensureCursorForPage = useCallback(
    async (targetPage: number, size: number) => {
      const knownPages = Object.keys(pageCursors)
        .map((k) => parseInt(k, 10))
        .filter((n) => !Number.isNaN(n));
      const maxKnown = knownPages.length ? Math.max(...knownPages) : 1;

      if (targetPage <= maxKnown + 1) {
        return;
      }

      let workingCursor = pageCursors[maxKnown + 0];
      if (workingCursor === undefined && maxKnown !== 1) {
        workingCursor = pageCursors[maxKnown];
      }

      const newCursors: CursorMap = {};
      for (let p = maxKnown + 1; p <= targetPage; p++) {
        const result = await fetchMore({
          variables: {
            first: size,
            after: workingCursor,
            search: filters.search,
            status: filters.status,
            gender: filters.gender,
            ageRange: filters.ageRange,
          },
          updateQuery: (_prev, {fetchMoreResult}) => fetchMoreResult,
        });

        const endCursor =
          result?.data?.patients?.pageInfo?.endCursor ?? undefined;
        newCursors[p + 1] = endCursor;
        workingCursor = endCursor;
        if (!endCursor && p < targetPage) {
          break;
        }
      }

      if (Object.keys(newCursors).length) {
        setPageCursors((prev) => ({...prev, ...newCursors}));
      }
    },
    [fetchMore, pageCursors, filters],
  );

  const handlePageChange = useCallback(
    async (page: number, newPageSize: number) => {
      const size = newPageSize ?? pageSize;

      if (size !== pageSize) {
        setPageSize(size);
        setCurrentPage(1);
        return;
      }

      try {
        await ensureCursorForPage(page, size);
      } catch (e) {
        console.error('Error ensuring cursor for page:', e);
      }

      setCurrentPage(page);
    },
    [pageSize, ensureCursorForPage],
  );

  const handlePageSizeChange = useCallback((_current: number, size: number) => {
    setPageSize(size);
  }, []);

  const handlePatientEdit = useCallback((patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  }, []);

  const handleAddPatient = useCallback(() => {
    setEditingPatient(undefined);
    setShowForm(true);
  }, []);

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setEditingPatient(undefined);
  }, []);

  const handleFormSuccess = useCallback(() => {
    refetch();
    setShowForm(false);
    setEditingPatient(undefined);
  }, [refetch]);

  const handlePatientDelete = useCallback(
    async (patientId: string) => {
      try {
        await deletePatientMutation({
          variables: {id: patientId},
        });
        await refetch();
        message.success('Patient deleted successfully');
      } catch (error) {
        console.error('Error deleting patient:', error);
        message.error('Failed to delete patient. Please try again.');
      }
    },
    [deletePatientMutation, refetch],
  );

  const handleDelete = useCallback(
    (patientId: string, patientName: string) => {
      handlePatientDelete(patientId);
      message.success(`Patient ${patientName} has been deleted`);
    },
    [handlePatientDelete],
  );
  /**
   * Calculates age from date of birth
   */
  const calculateAge = useCallback((dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }, []);

  /**
   * Formats phone number for display (US format)
   */
  const formatPhoneNumber = useCallback((phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  }, []);

  const columns = useMemo(
    () => [
      {
        title: 'Patient',
        key: 'patient',
        width: 250,
        render: (record: Patient) => (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Text strong className="text-gray-900">
                {record.firstName} {record.lastName}
              </Text>
              <StatusBadge status={record.status} size="small" />
            </div>
            <div className="text-sm text-gray-500">
              Age: {calculateAge(record.dateOfBirth)}
            </div>
            <div className="text-xs text-gray-400">
              MRN: {record.medicalRecordNumber}
            </div>
          </div>
        ),
      },
      {
        title: 'Contact',
        key: 'contact',
        width: 200,
        render: (record: Patient) => (
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-sm">
              <MailOutlined className="text-gray-400" />
              <Text className="text-gray-700">{record.email}</Text>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <PhoneOutlined className="text-gray-400" />
              <Text className="text-gray-700">
                {formatPhoneNumber(record.phone)}
              </Text>
            </div>
          </div>
        ),
      },
      {
        title: 'Address',
        key: 'address',
        width: 200,
        render: (record: Patient) => (
          <div className="space-y-1">
            <div className="flex items-start space-x-1 text-sm">
              <HomeOutlined className="text-gray-400 mt-0.5" />
              <div>
                <div className="text-gray-700">{record.address.street}</div>
                <div className="text-gray-500">
                  {record.address.city}, {record.address.state}{' '}
                  {record.address.zipCode}
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: 'Insurance',
        key: 'insurance',
        width: 150,
        render: (record: Patient) => (
          <div className="space-y-1">
            <Text className="text-sm text-gray-700">
              {record.insurance?.provider || 'N/A'}
            </Text>
          </div>
        ),
      },
      {
        title: 'Gender',
        key: 'gender',
        width: 100,
        render: (record: Patient) => (
          <Tag
            color={
              record.gender === 'male'
                ? 'blue'
                : record.gender === 'female'
                ? 'pink'
                : 'default'
            }
          >
            {record.gender.charAt(0).toUpperCase() + record.gender.slice(1)}
          </Tag>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 120,
        fixed: 'right' as const,
        render: (record: Patient) => (
          <Space size="small">
            <Tooltip title="Edit Patient">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handlePatientEdit(record)}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Delete Patient">
              <Popconfirm
                title="Delete Patient"
                description={`Are you sure you want to delete ${record.firstName} ${record.lastName}?`}
                onConfirm={() =>
                  handleDelete(
                    record.id,
                    `${record.firstName} ${record.lastName}`,
                  )
                }
                okText="Yes"
                cancelText="No"
                okType="danger"
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [calculateAge, formatPhoneNumber, handlePatientEdit, handleDelete],
  );

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <PatientForm
            patient={editingPatient}
            onCancel={handleFormCancel}
            onSuccess={handleFormSuccess}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        type="error"
        title="Error Loading Patients"
        description={error.message}
        actionText="Try Again"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className={`${className}`}>
      <Card
        className="mb-6"
        style={{marginBottom: '24px'}}
        styles={{body: {padding: '16px'}}}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} className="mb-0">
              Patient Management
            </Title>
            <Text type="secondary">Manage patient records and information</Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={handleAddPatient}
              size="large"
            >
              Add New Patient
            </Button>
          </Col>
        </Row>
      </Card>

      <div className="mb-6" style={{marginBottom: '24px'}}>
        <SearchAndFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
        />
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={patients}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{x: 1000}}
          className="patient-table"
        />

        {!loading && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-gray-600">
              Showing{' '}
              {patients.length === 0
                ? 0
                : ((pagination.current || 1) - 1) *
                    (pagination.pageSize || 10) +
                  1}{' '}
              to{' '}
              {Math.min(
                (pagination.current || 1) * (pagination.pageSize || 10),
                pagination.total || 0,
              )}{' '}
              of {pagination.total || 0} patients
            </div>
            <Pagination
              current={pagination.current || 1}
              pageSize={pagination.pageSize || 10}
              total={pagination.total || 0}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} patients`
              }
              pageSizeOptions={['10', '20', '50', '100']}
              onChange={(page, size) =>
                handlePageChange(page, size ?? pageSize)
              }
              onShowSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default PatientList;
