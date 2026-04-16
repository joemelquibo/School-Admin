import React, { useState, useEffect } from 'react';

function CourseList() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    // Form States matching course table fields
    const [course_code, setCourse_code] = useState('');
    const [course_desc, setCourse_desc] = useState('');

    const API_URL = 'http://localhost:5000/course';

    const fetchData = async () => {
        try {
            const response = await fetch(API_URL);
            const json = await response.json();
            setCourses(json);
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
        setCourse_code('');
        setCourse_desc('');
        setSelectedId(null);
    };

    // Search Bar Filter - Consistent with previous modules
    const filteredCourses = courses.filter((c) =>
        c.course_code.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.course_desc.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isUpdate = selectedId !== null;
        const url = isUpdate ? `${API_URL}/${selectedId}` : API_URL;
        const method = isUpdate ? 'PUT' : 'POST';

        const payload = { course_code, course_desc };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await fetchData();
                document.getElementById('coursemodal').style.display = 'none';
                clearForm();
                console.log(isUpdate ? "Update successful" : "Insert successful");
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.message || "Failed to save"));
            }
        } catch (error) {
            console.error("Connection error:", error);
        }
    };

    const prepareEdit = (course) => {
        setCourse_code(course.course_code);
        setCourse_desc(course.course_desc);
        setSelectedId(course.course_code);
        document.getElementById('coursemodal').style.display = 'block';
    };

    const handleDelete = async (code) => {
        if (!window.confirm(`Delete Course ${code}?`)) return;
        try {
            const response = await fetch(`${API_URL}/${code}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <>
            <div className="w3-container w3-padding">
                {/* Search Bar - Matches StudentList width and style */}
                <div className="w3-left w3-padding" style={{ width: '300px' }}>
                    <input 
                        type="text" 
                        className="w3-input w3-border" 
                        placeholder="Search Course..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='w3-right w3-padding'>
                    <button className='w3-button w3-blue' onClick={() => {
                        clearForm();
                        document.getElementById('coursemodal').style.display = 'block';
                    }}>+ADD COURSE</button>
                </div>

                <table className="w3-table-all">
                    <thead>
                        <tr className="w3-blue">
                            <th>COURSE CODE</th>
                            <th>DESCRIPTION</th>
                            <th>CONTROL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCourses.map((c) => (
                            <tr key={c.course_code}>
                                <td>{c.course_code}</td>
                                <td>{c.course_desc}</td>
                                <td>
                                    <button onClick={() => prepareEdit(c)}>&#9998;</button>
                                    <button onClick={() => handleDelete(c.course_code)}>&times;</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <div className='w3-modal' id='coursemodal'>
                <div className='w3-modal-content w3-animate-top' style={{ width: '40%' }}>
                    <div className='w3-container w3-padding w3-blue'>
                        COURSE DETAILS
                        <span className='w3-button w3-display-topright' onClick={() => document.getElementById('coursemodal').style.display = 'none'}>&times;</span>
                    </div>
                    <div className='w3-container w3-padding'>
                        <form onSubmit={handleSubmit}>
                            <p>
                                <label>COURSE CODE</label>
                                <input 
                                    type='text' 
                                    className={`w3-input w3-border ${selectedId ? 'w3-light-grey' : ''}`}
                                    value={course_code} 
                                    onChange={(e) => setCourse_code(e.target.value)} 
                                    readOnly={selectedId !== null} 
                                    required
                                />
                            </p>
                            <p>
                                <label>DESCRIPTION</label>
                                <input 
                                    type='text' 
                                    className='w3-input w3-border' 
                                    value={course_desc} 
                                    onChange={(e) => setCourse_desc(e.target.value)} 
                                    required
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

export default CourseList;