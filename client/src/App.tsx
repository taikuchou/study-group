import React from 'react'
import StudyGroupPlatform from './components/StudyGroupPlatform'
import { DataProvider } from './context/DataContext';
export default function App() {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Study Group Platform</h1>
        <DataProvider><StudyGroupPlatform /></DataProvider>
      </div>
    </div>
  )
}
