import {gql} from '@apollo/client';
import data from '../data.json';
import {
  Patient,
  CreatePatientInput,
  UpdatePatientInput,
} from '../../types/patient';

export const typeDefs = gql`
  scalar Date

  type Address {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }

  type EmergencyContact {
    name: String!
    relationship: String!
    phone: String!
    email: String!
  }

  type Insurance {
    provider: String!
    policyNumber: String!
    groupNumber: String
  }

  type Patient {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    dateOfBirth: String!
    gender: Gender!
    address: Address!
    medicalRecordNumber: String!
    insurance: Insurance!
    emergencyContact: EmergencyContact!
    createdAt: String!
    updatedAt: String!
    status: PatientStatus!
  }

  enum Gender {
    male
    female
    other
  }

  enum PatientStatus {
    active
    inactive
    pending
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type PatientEdge {
    node: Patient!
    cursor: String!
  }

  type PatientConnection {
    edges: [PatientEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  input AddressInput {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }

  input EmergencyContactInput {
    name: String!
    relationship: String!
    phone: String!
    email: String!
  }

  input InsuranceInput {
    provider: String!
    policyNumber: String!
    groupNumber: String
  }

  input CreatePatientInput {
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    dateOfBirth: String!
    gender: Gender!
    address: AddressInput!
    medicalRecordNumber: String!
    insurance: InsuranceInput!
    emergencyContact: EmergencyContactInput!
  }

  input UpdatePatientInput {
    firstName: String
    lastName: String
    email: String
    phone: String
    dateOfBirth: String
    gender: Gender
    address: AddressInput
    medicalRecordNumber: String
    insurance: InsuranceInput
    emergencyContact: EmergencyContactInput
    status: PatientStatus
  }

  input AgeRangeInput {
    min: Int
    max: Int
  }

  type Query {
    patients(
      first: Int
      after: String
      search: String
      status: PatientStatus
      gender: Gender
      ageRange: AgeRangeInput
    ): PatientConnection!
    patient(id: ID!): Patient
  }

  type Mutation {
    createPatient(input: CreatePatientInput!): Patient!
    updatePatient(id: ID!, input: UpdatePatientInput!): Patient!
    deletePatient(id: ID!): DeleteResponse!
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }
`;

/**
 * Calculates age from date of birth
 */
const calculateAge = (dateOfBirth: string): number => {
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
};

/**
 * Filters patients based on search criteria
 */
const filterPatients = (patients: Patient[], filters: any): Patient[] => {
  return patients.filter((patient) => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [
        patient.firstName,
        patient.lastName,
        patient.email,
        patient.medicalRecordNumber,
      ];

      if (
        !searchableFields.some((field) =>
          field.toLowerCase().includes(searchTerm),
        )
      ) {
        return false;
      }
    }

    if (filters.status && patient.status !== filters.status) {
      return false;
    }

    if (filters.gender && patient.gender !== filters.gender) {
      return false;
    }

    if (filters.ageRange) {
      const age = calculateAge(patient.dateOfBirth);
      const {min, max} = filters.ageRange;

      if (min !== undefined && age < min) return false;
      if (max !== undefined && age > max) return false;
    }

    return true;
  });
};

export const resolvers = {
  Query: {
    patients: (_: any, args: any) => {
      const {first = 10, after, search, status, gender, ageRange} = args;

      const filteredPatients = filterPatients(data.patients as Patient[], {
        search,
        status,
        gender,
        ageRange,
      });
      const startIndex = after ? parseInt(after) : 0;
      const endIndex = startIndex + first;
      const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

      const edges = paginatedPatients.map((patient, index) => ({
        node: patient,
        cursor: (startIndex + index).toString(),
      }));
      const hasNextPage = endIndex < filteredPatients.length;
      const hasPreviousPage = startIndex > 0;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage,
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        },
        totalCount: filteredPatients.length,
      };
    },

    patient: (_: any, {id}: {id: string}) => {
      return (
        (data.patients as Patient[]).find((patient) => patient.id === id) ||
        null
      );
    },
  },

  Mutation: {
    createPatient: (_: any, {input}: {input: CreatePatientInput}) => {
      const newPatient: Patient = {
        id: `patient-${Date.now()}`,
        ...input,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (data.patients as Patient[]).unshift(newPatient);
      return newPatient;
    },

    updatePatient: (
      _: any,
      {id, input}: {id: string; input: UpdatePatientInput},
    ) => {
      const patients = data.patients as Patient[];
      const patientIndex = patients.findIndex((patient) => patient.id === id);

      if (patientIndex === -1) {
        throw new Error(`Patient with id ${id} not found`);
      }

      const updatedPatient = {
        ...patients[patientIndex],
        ...input,
        updatedAt: new Date().toISOString(),
      } as Patient;

      patients[patientIndex] = updatedPatient;
      return updatedPatient;
    },

    deletePatient: (_: any, {id}: {id: string}) => {
      const patients = data.patients as Patient[];
      const patientIndex = patients.findIndex((patient) => patient.id === id);

      if (patientIndex === -1) {
        return {
          success: false,
          message: `Patient with id ${id} not found`,
        };
      }

      patients.splice(patientIndex, 1);
      return {
        success: true,
        message: 'Patient deleted successfully',
      };
    },
  },
};
