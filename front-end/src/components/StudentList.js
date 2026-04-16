import React,{useState,useEffect} from 'react';
function StudentList()
{
	const [students,setStudent] = useState([]);
	const [loading,setLoading] = useState({});
	const [selectedId, setSelectedId] = useState(null);
	//
	const [idno,setIdno] = useState('');
	const [lastname,setLastname] = useState('');
	const [firstname,setFirstname] = useState('');
	const [course_id,setCourse_id] = useState('');
	const [level,setLevel] = useState('');
		
	const fetchData = async () => 
	{
	try {
		const response = await fetch('http://localhost:5000/students');
		const json = await response.json();
		setStudent(json);
	} catch (error) {
		console.error("Fetch error:", error);
	} finally {
		setLoading(false);
	}
	};
	useEffect(() => {

	fetchData();
}, []);

	const clearForm = () => {
    setIdno('');
    setLastname('');
    setFirstname('');
    setCourse_id('');
    setLevel('');
    setSelectedId(null);
	};

	{/*Add*/}
	const handleSubmit = async (event) => {
    event.preventDefault();
    const isUpdate = selectedId !== null;
    const url = isUpdate 
        ? `http://localhost:5000/students/${selectedId}` 
        : 'http://localhost:5000/students';
    const method = isUpdate ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idno, lastname, firstname, course_id, level }),
        });

        if (response.ok) {
            await fetchData(); 
            document.getElementById('studentmodal').style.display = 'none';
			clearForm();
            setSelectedId(null); 
            
            console.log(isUpdate ? "Update successful" : "Insert successful");
        } else {
            const errorData = await response.json();
            alert("Error: " + errorData.message);
        }
    } catch (error) {
        console.error("Connection error:", error);
    }
};

	{/*Edit Section*/}
	const prepareEdit = (student) => {
		setIdno(student.idno);
		setLastname(student.lastname);
		setFirstname(student.firstname);
		setCourse_id(student.course_id);
		setLevel(student.Level);

		setSelectedId(student.idno);

		document.getElementById('studentmodal').style.display = 'block';
	};

	{/*Update*/}
	const handleUpdate = async (id) => {
		try {
			const response = await fetch('http://localhost:5000/students', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					idno: idno, 
					lastname: lastname,
					firstname: firstname,
					course_id: course_id,
					level: level,
				}),
			});
			
			if (response.ok) 
			{
				fetchData(); // Refresh table
				document.getElementById('studentmodal').style.display = 'none';
				alert("Updated successfully!");
        	}

			const result = await response.json();
			console.log("Success:", result);
			} 
				catch (error) {
				console.error("Error:", error);
			}
	};

	{/*Delete*/}
	const handleDelete = async (idno) => {
		if (!window.confirm("Are you sure you?")) return;

		try {
			const response = await fetch(`http://localhost:5000/students/${idno}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				fetchData();
				console.log("Deleted successfully");
			}
			else{
				throw new Error('Failed to delete');
			}
		}
		catch (error){
			console.error("Delete error:", error);
		}
	}
	
	return (
    <>	
		<div className="w3-container w3-padding">
			<div className='w3-right w3-padding'>
				<button className='w3-button w3-blue' onClick={() => 
				{
					clearForm();
					document.getElementById('studentmodal').style.display='block';
				}}>+ADD</button>
			</div>
			<table className="w3-table-all">
			  <thead>
				<tr className="w3-blue">
				  <th>IDNO</th>
				  <th>LASTNAME</th>
				  <th>FIRSTNAME</th>
				  <th>COURSE</th>
				  <th>LEVEL</th>
				  <th>CONTROL</th>
				</tr>
			  </thead>
			  <tbody>
				{students.map((student) => (
				  <tr key={student.id}> 
					<td>{student.idno}</td>
					<td>{student.lastname}</td>
					<td>{student.firstname}</td>
					<td>{student.course_id}</td>
					<td>{student.level}</td>
					<td>
						<button onClick={() => prepareEdit(student)}>&#9998;</button>
						<button onClick={() => handleDelete(student.idno)}>&times;</button>
					</td>
				  </tr>
				))}
				
			  </tbody>
			</table>
		</div>
		
		<div className='w3-modal' id='studentmodal'>
			<div className='w3-modal-content w3-animate-top' style={{ width:'50%' }}>
				<div className='w3-container w3-padding w3-blue'>
					STUDENT
					<span className='w3-button w3-display-topright' onClick={() => document.getElementById('studentmodal').style.display='none'}>&times;</span>
				</div>
				<div className='w3-container w3-padding'>
					<form onSubmit={handleSubmit}>
						<p>
							<label>IDNO</label>
							<input 
								type='text' 
								className={`w3-input w3-border ${selectedId ? 'w3-light-grey' : ''}`}
								value={idno} 
								onChange={(e) => setIdno(e.target.value)} 
    							readOnly={selectedId !== null} 
							/>
						</p>
						<p>
							<label>LASTNAME</label>
							<input 
								type='text' 
								className='w3-input w3-border' 
								value={lastname} 
								onChange={(e) => setLastname(e.target.value)} 
							/>
						</p>
						<p>
							<label>FIRSTNAME</label>
							<input 
								type='text' 
								className='w3-input w3-border'
								value={firstname} 
								onChange={(e) => setFirstname(e.target.value)} 
							/>
						</p>
						<p>
							<label>COURSE</label>
							<select 
								className='w3-select w3-border' 
								value={course_id} 
								onChange={(e) => setCourse_id(e.target.value)}
								required
							>
								<option value="" disabled>Choose a course</option>
								
								{/* Hard-coded options: value is the ID, text is the label */}
								<option value="1">1 - BS Information Technology</option>
								<option value="2">2 - BS Computer Science</option>
								<option value="3">3 - BS Hospitality Management</option>
								<option value="4">4 - BS Computer Engineering</option>
							</select>
						</p>
						<p>
							<label>LEVEL</label>
							<input 
								type='text' 
								className='w3-input w3-border'
								value={level} 
								onChange={(e) => setLevel(e.target.value)} 
							/>
						</p>
						<p className='w3-right'>
							<input type='submit' value='SAVE' className='w3-button w3-blue' />
						</p>
					</form>
				</div>
			</div>
		</div>
	</>
  );
}

export default StudentList;