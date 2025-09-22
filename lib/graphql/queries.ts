import {gql} from '@apollo/client';
export const PATIENT_FRAGMENT = gql`
  fragment PatientFragment on Patient {
    id
    firstName
    lastName
    email
    phone
    dateOfBirth
    gender
    medicalRecordNumber
    status
    address {
      street
      city
      state
      zipCode
      country
    }
    emergencyContact {
      name
      relationship
      phone
      email
    }
    insurance {
      provider
      policyNumber
      groupNumber
    }
    createdAt
    updatedAt
  }
`;

export const GET_PATIENTS = gql`
  ${PATIENT_FRAGMENT}
  query GetPatients(
    $first: Int
    $after: String
    $search: String
    $status: PatientStatus
    $gender: Gender
    $ageRange: AgeRangeInput
  ) {
    patients(
      first: $first
      after: $after
      search: $search
      status: $status
      gender: $gender
      ageRange: $ageRange
    ) {
      edges {
        node {
          ...PatientFragment
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const CREATE_PATIENT = gql`
  ${PATIENT_FRAGMENT}
  mutation CreatePatient($input: CreatePatientInput!) {
    createPatient(input: $input) {
      ...PatientFragment
    }
  }
`;

export const UPDATE_PATIENT = gql`
  ${PATIENT_FRAGMENT}
  mutation UpdatePatient($id: ID!, $input: UpdatePatientInput!) {
    updatePatient(id: $id, input: $input) {
      ...PatientFragment
    }
  }
`;

export const DELETE_PATIENT = gql`
  mutation DeletePatient($id: ID!) {
    deletePatient(id: $id) {
      success
      message
    }
  }
`;
