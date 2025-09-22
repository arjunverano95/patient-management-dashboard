'use client';

import React from 'react';
import {ConfigProvider, App as AntdApp} from 'antd';
import {ApolloProvider} from '@apollo/client';
import PatientList from '../components/patient/PatientList';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import {apolloClient} from '../lib/apollo-client';

const PatientDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PatientList />
      </div>
    </div>
  );
};

const PatientManagementApp: React.FC = () => {
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1890ff',
              borderRadius: 6,
            },
          }}
        >
          <AntdApp>
            <PatientDashboard />
          </AntdApp>
        </ConfigProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
};

export default PatientManagementApp;
