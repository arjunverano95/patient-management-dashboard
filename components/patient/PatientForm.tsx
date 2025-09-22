import React, {useEffect, useState} from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
  Space,
  Divider,
} from 'antd';
import {message} from '../../lib/message';
import {SaveOutlined, CloseOutlined, UserOutlined} from '@ant-design/icons';
import {useMutation} from '@apollo/client';
import {Patient} from '../../types/patient';
import {CREATE_PATIENT, UPDATE_PATIENT} from '../../lib/graphql/queries';
import dayjs from 'dayjs';

const {Option} = Select;

interface PatientFormProps {
  /** Patient data for editing, undefined for creating new patient */
  patient?: Patient;
  /** Callback when form is cancelled */
  onCancel: () => void;
  /** Callback when patient is successfully saved */
  onSuccess?: () => void;
  /** Additional CSS classes */
  className?: string;
}

const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  onCancel,
  onSuccess,
  className = '',
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEditing = !!patient;

  const [createPatientMutation] = useMutation(CREATE_PATIENT);
  const [updatePatientMutation] = useMutation(UPDATE_PATIENT);
  useEffect(() => {
    if (patient) {
      form.setFieldsValue({
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: dayjs(patient.dateOfBirth),
        gender: patient.gender,
        address: {
          street: patient.address.street,
          city: patient.address.city,
          state: patient.address.state,
          zipCode: patient.address.zipCode,
          country: patient.address.country,
        },
        medicalRecordNumber: patient.medicalRecordNumber,
        insurance: patient.insurance,
        emergencyContact: {
          name: patient.emergencyContact.name,
          relationship: patient.emergencyContact.relationship,
          phone: patient.emergencyContact.phone,
          email: patient.emergencyContact.email,
        },
      });
    }
  }, [patient, form]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      await form.validateFields();
      const formData = {
        ...values,
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
        address: {
          street: values.address.street,
          city: values.address.city,
          state: values.address.state,
          zipCode: values.address.zipCode,
          country: values.address.country || 'USA',
        },
        emergencyContact: {
          name: values.emergencyContact.name,
          relationship: values.emergencyContact.relationship,
          phone: values.emergencyContact.phone,
          email: values.emergencyContact.email,
        },
      };

      if (isEditing) {
        const inputData = {...formData} as any;
        delete inputData.id;

        await updatePatientMutation({
          variables: {
            id: patient.id,
            input: inputData,
          },
        });
        message.success('Patient updated successfully');
      } else {
        await createPatientMutation({
          variables: {
            input: formData,
          },
        });
        message.success('Patient created successfully');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving patient:', error);
      message.error('Failed to save patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validates email format
   */
  const validateEmail = (_: any, value: string) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return Promise.reject(new Error('Please enter a valid email address'));
    }
    return Promise.resolve();
  };

  /**
   * Validates phone number format
   */
  const validatePhone = (_: any, value: string) => {
    if (value && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
      return Promise.reject(new Error('Please enter a valid phone number'));
    }
    return Promise.resolve();
  };

  /**
   * Validates ZIP code format (US format)
   */
  const validateZipCode = (_: any, value: string) => {
    if (value && !/^\d{4}(-\d{4})?$/.test(value)) {
      return Promise.reject(
        new Error('Please enter a valid ZIP code (1234 or 12345-6789)'),
      );
    }
    return Promise.resolve();
  };

  return (
    <Card
      className={`${className}`}
      title={
        <Space>
          <UserOutlined />
          {isEditing ? 'Edit Patient' : 'Add New Patient'}
        </Space>
      }
      extra={
        <Button icon={<CloseOutlined />} onClick={onCancel} type="text">
          Cancel
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="patient-form"
        scrollToFirstError
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Personal Information
          </h3>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  {required: true, message: 'Please enter first name'},
                  {min: 2, message: 'First name must be at least 2 characters'},
                ]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  {required: true, message: 'Please enter last name'},
                  {min: 2, message: 'Last name must be at least 2 characters'},
                ]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {required: true, message: 'Please enter email address'},
                  {validator: validateEmail},
                ]}
              >
                <Input type="email" placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  {required: true, message: 'Please enter phone number'},
                  {validator: validatePhone},
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Date of Birth"
                name="dateOfBirth"
                rules={[
                  {required: true, message: 'Please select date of birth'},
                ]}
              >
                <DatePicker
                  className="w-full"
                  placeholder="Select date of birth"
                  disabledDate={(current) =>
                    current && current > dayjs().endOf('day')
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{required: true, message: 'Please select gender'}]}
              >
                <Select placeholder="Select gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider />

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Address Information
          </h3>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label="Street Address"
                name={['address', 'street']}
                rules={[
                  {required: true, message: 'Please enter street address'},
                ]}
              >
                <Input placeholder="Enter street address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                label="City"
                name={['address', 'city']}
                rules={[{required: true, message: 'Please enter city'}]}
              >
                <Input placeholder="Enter city" />
              </Form.Item>
            </Col>
            <Col xs={12} sm={4}>
              <Form.Item
                label="State"
                name={['address', 'state']}
                rules={[{required: true, message: 'Please enter state'}]}
              >
                <Input placeholder="State" maxLength={2} />
              </Form.Item>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Item
                label="ZIP Code"
                name={['address', 'zipCode']}
                rules={[
                  {required: true, message: 'Please enter ZIP code'},
                  {validator: validateZipCode},
                ]}
              >
                <Input placeholder="12345" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item
                label="Country"
                name={['address', 'country']}
                initialValue="USA"
              >
                <Input placeholder="Country" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider />

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Medical Information
          </h3>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Medical Record Number"
                name="medicalRecordNumber"
                rules={[
                  {
                    required: true,
                    message: 'Please enter medical record number',
                  },
                ]}
              >
                <Input placeholder="Enter medical record number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Insurance Provider"
                name={['insurance', 'provider']}
                rules={[
                  {required: true, message: 'Please enter insurance provider'},
                ]}
              >
                <Input placeholder="Enter insurance provider" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Policy Number"
                name={['insurance', 'policyNumber']}
                rules={[
                  {required: true, message: 'Please enter policy number'},
                ]}
              >
                <Input placeholder="Enter policy number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Group Number"
                name={['insurance', 'groupNumber']}
              >
                <Input placeholder="Enter group number (optional)" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider />

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Emergency Contact
          </h3>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Contact Name"
                name={['emergencyContact', 'name']}
                rules={[
                  {
                    required: true,
                    message: 'Please enter emergency contact name',
                  },
                ]}
              >
                <Input placeholder="Enter emergency contact name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Relationship"
                name={['emergencyContact', 'relationship']}
                rules={[{required: true, message: 'Please enter relationship'}]}
              >
                <Select placeholder="Select relationship">
                  <Option value="Spouse">Spouse</Option>
                  <Option value="Parent">Parent</Option>
                  <Option value="Child">Child</Option>
                  <Option value="Sibling">Sibling</Option>
                  <Option value="Friend">Friend</Option>
                  <Option value="Guardian">Guardian</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Contact Phone"
                name={['emergencyContact', 'phone']}
                rules={[
                  {
                    required: true,
                    message: 'Please enter emergency contact phone',
                  },
                  {validator: validatePhone},
                ]}
              >
                <Input placeholder="Enter emergency contact phone" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Contact Email"
                name={['emergencyContact', 'email']}
                rules={[{validator: validateEmail}]}
              >
                <Input
                  type="email"
                  placeholder="Enter emergency contact email"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
          >
            {isEditing ? 'Update Patient' : 'Add Patient'}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default PatientForm;
