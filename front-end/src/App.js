import './App.css'
import React,{useState,useEffect} from 'react';
import StudentList from './components/StudentList';
import Enrollment_DetList from './components/Enrollment_DetList';
import SubjectOffList from './components/SubjectOffList';
import SubjectList from './components/SubjectList';

function App() {
	const [view, setView] = useState('students');
	return (
		<>
      <div className="w3-bar w3-indigo w3-card w3-padding">
        <span className="w3-bar-item w3-large"><b>School Admin v1.0</b></span>
        <div className="w3-right">
			<button 
			className={`w3-bar-item w3-button w3-round ${view === 'students' ? 'w3-white w3-text-indigo' : ''}`} 
			onClick={() => setView('students')}>
			Students
			</button>
			
			<button 
			className={`w3-bar-item w3-button w3-round ${view === 'teachers' ? 'w3-white w3-text-indigo' : ''}`} 
			onClick={() => setView('teachers')}>
			Teachers
			</button>

			<button 
			className={`w3-bar-item w3-button w3-round ${view === 'course' ? 'w3-white w3-text-indigo' : ''}`} 
			onClick={() => setView('course')}>
			Course
			</button>

			<button 
			className={`w3-bar-item w3-button w3-round ${view === 'enrollment' ? 'w3-white w3-text-indigo' : ''}`} 
			onClick={() => setView('enrollment')}>
			Enrollment
			</button>

			<button 
			className={`w3-bar-item w3-button w3-round ${view === 'enrollment_details' ? 'w3-white w3-text-indigo' : ''}`} 
			onClick={() => setView('enrollment_details')}>
			Enrollment Details
			</button>

			<button 
			className={`w3-bar-item w3-button w3-round ${view === 'subjectoffered' ? 'w3-white w3-text-indigo' : ''}`} 
			onClick={() => setView('subjectoffered')}>
			Subjectoffered
			</button>

			<button 
			className={`w3-bar-item w3-button w3-round ${view === 'subjects' ? 'w3-white w3-text-indigo' : ''}`} 
			onClick={() => setView('subjects')}>
			Subjects
			</button>
		</div>
      </div>

      <div className="w3-container w3-padding-24">
        {view === 'students' && <StudentList />} {/*In ania lang nya uban master, remove lang nang div */}
        
		{/*Teacher navbar */}
        {view === 'teachers' && (
          <div className="w3-panel w3-leftbar w3-sand w3-padding-24">
            <p className="w3-xlarge w3-serif"><i>"Titsers"</i></p>
          </div>
        )}{/*TeacherList ang e filename sa page */}
		
		{/*Course navbar */}
        {view === 'course' && (
          <div className="w3-panel w3-leftbar w3-sand w3-padding-24">
            <p className="w3-xlarge w3-serif"><i>"kers"</i></p>
          </div>
        )}{/*CourseList ang e filename sa page */}

		{/*Enrollment navbar */}
        {view === 'enrollment' && (
          <div className="w3-panel w3-leftbar w3-sand w3-padding-24">
            <p className="w3-xlarge w3-serif"><i>"inrol"</i></p>
          </div>
        )}{/*EnrollmentList ang e filename sa page */}
		
		{/*Enrollment_details navbar */}
        {view === 'enrollment_details' && <Enrollment_DetList/>}

		{/*Subject Offered navbar */}
        {view === 'subjectoffered' && <SubjectOffList/>}

		{/*Subjects navbar */}
        {view === 'subjects' && <SubjectList/>}

      </div>
		</>
	);
}

export default App;
