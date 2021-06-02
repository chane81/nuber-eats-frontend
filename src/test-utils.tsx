import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';

const AllTheProviders: React.FC = ({ children }) => {
  return (
    <HelmetProvider>
      <Router>{children}</Router>
    </HelmetProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';

export { customRender as render };
