import * as React from 'react';
import { Route, Routes as DomRoutes } from 'react-router-dom';
import { App } from './src/app';
import { Home } from './src/home';
import { useAnalytics } from './src/hooks';
import { PrivacyPolicy, TermsOfUse, Debug } from './src/components';

export function Routes() {
  useAnalytics();

  return (
    <div>
      <DomRoutes>

        <Route path="/" element={<Home />} />
        <Route path="app" element={<App />} />
        <Route path="privacy_policy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsOfUse />} />
        <Route path="debug" element={<Debug />} />

      </DomRoutes>
    </div>
  );
}
