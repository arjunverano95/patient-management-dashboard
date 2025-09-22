export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: Address;
  medicalRecordNumber: string;
  insurance: Insurance;
  emergencyContact: EmergencyContact;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Insurance {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface PatientFilters {
  search?: string;
  status?: Patient['status'];
  gender?: Patient['gender'];
  ageRange?: {
    min: number;
    max: number;
  };
}

export interface CreatePatientInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Patient['gender'];
  address: Address;
  medicalRecordNumber: string;
  insurance: Insurance;
  emergencyContact: EmergencyContact;
}

export interface UpdatePatientInput extends Partial<CreatePatientInput> {
  id: string;
}
