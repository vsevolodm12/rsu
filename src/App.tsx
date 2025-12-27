import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import FacultiesScreen from './screens/FacultiesScreen'
import CoursesScreen from './screens/CoursesScreen'
import GroupsScreen from './screens/GroupsScreen'
import ScheduleScreen from './screens/ScheduleScreen'
import AdminScreen from './screens/AdminScreen'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<FacultiesScreen />} />
          <Route path="/faculty/:facultyId" element={<CoursesScreen />} />
          <Route path="/faculty/:facultyId/course/:courseId" element={<GroupsScreen />} />
          <Route path="/group/:groupId" element={<ScheduleScreen />} />
          <Route path="/admin" element={<AdminScreen />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App


