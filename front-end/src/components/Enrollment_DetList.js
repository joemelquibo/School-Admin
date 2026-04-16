import React, { useState, useEffect } from 'react';

function Enrollment_DetList() {
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    // Form Fields matching backend: enroll_id and suboffid
    const [enroll_id, setEnrollId] = useState('');
    const [suboffid, setSuboffid] = useState('');

    const API_URL = 'http://localhost:5000/enrollment_details';

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            const json = await response.json();
            setDetails(json);
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
        setEnrollId('');
        setSuboffid('');
        setSelectedId(null);
    };

    const filteredDetails = details.filter(item => 
    item.enroll_id.toString().toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isUpdate = selectedId !== null;
        
        // Backend PUT expects ID in URL: /enrollment/:enroll_id
        const url = isUpdate ? `${API_URL}/${selectedId}` : API_URL;
        const method = isUpdate ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enroll_id, suboffid }),
            });

            if (response.ok) {
                await fetchData();
                document.getElementById('enrollmentmodal').style.display = 'none';
                clearForm();
                console.log(isUpdate ? "Update successful" : "Insert successful");
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.message || "Failed to save data"));
            }
        } catch (error) {
            console.error("Connection error:", error);
        }
    };

    const prepareEdit = (item) => {
        setEnrollId(item.enroll_id);
        setSuboffid(item.suboffid);
        setSelectedId(item.enroll_id);
        document.getElementById('enrollmentmodal').style.display = 'block';
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this enrollment?")) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchData();
                console.log("Deleted successfully");
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <>
            <div className="w3-container w3-padding">
                <div className="w3-left w3-padding" style={{ width: '300px' }}>
                    <input 
                        type="text" 
                        className="w3-input w3-border" 
                        placeholder="Search Enrollment ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='w3-right w3-padding'>
                    <button className='w3-button w3-blue' onClick={() => {
                        clearForm();
                        document.getElementById('enrollmentmodal').style.display = 'block';
                    }}>+ ADD DETAILS</button>
                </div>
                <table className="w3-table-all">
                    <thead>
                        <tr className="w3-blue">
                            <th>ENROLL ID</th>
                            <th>SUB OFF ID</th>
                            <th style={{ width: '150px' }}>CONTROL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDetails.length > 0 ? (
                            filteredDetails.map((item) => (
                                <tr key={item.enroll_id}>
                                    <td>{item.enroll_id}</td>
                                    <td>{item.suboffid}</td>
                                    <td>
                                        <button onClick={() => prepareEdit(item)}>&#9998;</button>
                                        <button onClick={() => handleDelete(item.enroll_id)}>&times;</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="w3-center">No records found matching "{searchTerm}"</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <div className='w3-modal' id='enrollmentmodal'>
                <div className='w3-modal-content w3-animate-top' style={{ width: '40%' }}>
                    <div className='w3-container w3-padding w3-blue'>
                        <b>ENROLLMENT DETAIL</b>
                        <span className='w3-button w3-display-topright' onClick={() => document.getElementById('enrollmentmodal').style.display = 'none'}>&times;</span>
                    </div>
                    <div className='w3-container w3-padding'>
                        <form onSubmit={handleSubmit}>
                            <p>
                                <label>Enrollment ID</label>
                                <input
                                    type='text'
                                    className={`w3-input w3-border ${selectedId ? 'w3-light-grey' : ''}`}
                                    value={enroll_id}
                                    onChange={(e) => setEnrollId(e.target.value)}
                                    readOnly={selectedId !== null}
                                    required
                                />
                            </p>
                            <p>
                                <label>Subject Offered ID</label>
                                <input
                                    type='text'
                                    className='w3-input w3-border'
                                    value={suboffid}
                                    onChange={(e) => setSuboffid(e.target.value)}
                                    required
                                />
                            </p>
                            <p className='w3-right'>
                                <input type='submit' value='SAVE' className='w3-button w3-blue w3-margin-left' />
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Enrollment_DetList;