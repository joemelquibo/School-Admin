import React, { useState, useEffect } from 'react';

function EnrollmentList() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    // Form States matching enrollment fields
    const [enroll_code, setEnroll_code] = useState('');
    const [enroll_date, setEnroll_date] = useState('');
    const [student_id, setStudent_id] = useState('');
    const [status, setStatus] = useState('');
    const [amt_paid, setAmt_paid] = useState('');

    const API_URL = 'http://localhost:5000/enrollment';

    const fetchData = async () => {
        try {
            const response = await fetch(API_URL);
            const json = await response.json();
            setEnrollments(json);
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
        setEnroll_code('');
        setEnroll_date('');
        setStudent_id('');
        setStatus('');
        setAmt_paid('');
        setSelectedId(null);
    };

    // Search Bar Filter
    const filteredEnrollments = enrollments.filter((e) =>
        e.enroll_code.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isUpdate = selectedId !== null;
        const url = isUpdate ? `${API_URL}/${selectedId}` : API_URL;
        const method = isUpdate ? 'PUT' : 'POST';

        const payload = { enroll_code, enroll_date, student_id, status, amt_paid };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await fetchData();
                document.getElementById('enrollmodal').style.display = 'none';
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

    const prepareEdit = (enroll) => {
        setEnroll_code(enroll.enroll_code);
        setEnroll_date(enroll.enroll_date);
        setStudent_id(enroll.student_id);
        setStatus(enroll.status);
        setAmt_paid(enroll.amt_paid);

        setSelectedId(enroll.enroll_code);
        document.getElementById('enrollmodal').style.display = 'block';
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const response = await fetch(`${API_URL}/${id}`, {
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
                {/* Search Bar */}
                <div className="w3-left w3-padding" style={{ width: '300px' }}>
                    <input 
                        type="text" 
                        className="w3-input w3-border" 
                        placeholder="Search Enroll Code..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='w3-right w3-padding'>
                    <button className='w3-button w3-blue' onClick={() => {
                        clearForm();
                        document.getElementById('enrollmodal').style.display = 'block';
                    }}>+ADD</button>
                </div>

                <table className="w3-table-all">
                    <thead>
                        <tr className="w3-blue">
                            <th>ENROLL CODE</th>
                            <th>DATE</th>
                            <th>STUDENT ID</th>
                            <th>STATUS</th>
                            <th>AMT PAID</th>
                            <th>CONTROL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEnrollments.map((e) => (
                            <tr key={e.enroll_code}>
                                <td>{e.enroll_code}</td>
                                <td>{e.enroll_date}</td>
                                <td>{e.student_id}</td>
                                <td>{e.status}</td>
                                <td>{e.amt_paid}</td>
                                <td>
                                    <button onClick={() => prepareEdit(e)}>&#9998;</button>
                                    <button onClick={() => handleDelete(e.enroll_code)}>&times;</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <div className='w3-modal' id='enrollmodal'>
                <div className='w3-modal-content w3-animate-top' style={{ width: '50%' }}>
                    <div className='w3-container w3-padding w3-blue'>
                        ENROLLMENT
                        <span className='w3-button w3-display-topright' onClick={() => document.getElementById('enrollmodal').style.display = 'none'}>&times;</span>
                    </div>
                    <div className='w3-container w3-padding'>
                        <form onSubmit={handleSubmit}>
                            <p>
                                <label>ENROLL CODE</label>
                                <input 
                                    type='text' 
                                    className={`w3-input w3-border ${selectedId ? 'w3-light-grey' : ''}`}
                                    value={enroll_code} 
                                    onChange={(e) => setEnroll_code(e.target.value)} 
                                    readOnly={selectedId !== null} 
                                    required
                                />
                            </p>
                            <p>
                                <label>ENROLL DATE</label>
                                <input 
                                    type='date' 
                                    className='w3-input w3-border' 
                                    value={enroll_date} 
                                    onChange={(e) => setEnroll_date(e.target.value)} 
                                    required
                                />
                            </p>
                            <p>
                                <label>STUDENT ID</label>
                                <input 
                                    type='text' 
                                    className='w3-input w3-border'
                                    value={student_id} 
                                    onChange={(e) => setStudent_id(e.target.value)} 
                                    required
                                />
                            </p>
                            <p>
                                <label>STATUS</label>
                                <select 
                                    className='w3-select w3-border' 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Status</option>
                                    <option value="ENROLLED">ENROLLED</option>
                                    <option value="PENDING">PENDING</option>
                                    <option value="DROPPED">DROPPED</option>
                                </select>
                            </p>
                            <p>
                                <label>AMOUNT PAID</label>
                                <input 
                                    type='number' 
                                    step="0.01"
                                    className='w3-input w3-border'
                                    value={amt_paid} 
                                    onChange={(e) => setAmt_paid(e.target.value)} 
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

export default EnrollmentList;