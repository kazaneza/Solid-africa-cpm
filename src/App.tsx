import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PurchaseEntry from './pages/PurchaseEntry';
import ProductionEntry from './pages/ProductionEntry';
import IndirectCosts from './pages/IndirectCosts';
import WeeklyReport from './pages/WeeklyReport';
import MonthlyReport from './pages/MonthlyReport';
import Schools from './pages/Schools';
import Ingredients from './pages/Ingredients';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/purchases" element={
            <ProtectedRoute>
              <Layout>
                <PurchaseEntry />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/production" element={
            <ProtectedRoute>
              <Layout>
                <ProductionEntry />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/indirect-costs" element={
            <ProtectedRoute>
              <Layout>
                <IndirectCosts />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/reports/weekly" element={
            <ProtectedRoute>
              <Layout>
                <WeeklyReport />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/reports/monthly" element={
            <ProtectedRoute>
              <Layout>
                <MonthlyReport />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings/schools" element={
            <ProtectedRoute>
              <Layout>
                <Schools />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings/ingredients" element={
            <ProtectedRoute>
              <Layout>
                <Ingredients />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;