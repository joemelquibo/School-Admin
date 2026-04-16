import React, { useState, useEffect } from 'react';

function SubjectList() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);

    // Form States matching subjects backend
    const [subjcode, setSubjcode] = useState('');
    const [subjdesc, setSubjdesc] = useState('');
    const [units, setUnits] = useState('');

    const API_URL = 'http://localhost:5000/subjects';

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            const json = await response.json();
            setSubjects(json);
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
        setSubjcode('');
        setSubjdesc('');
        setUnits('');
        setSelectedId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isUpdate = selectedId !== null;
        
        // Match backend logic: PUT uses /:subjcode
        const url = isUpdate ? `${API_URL}/${selectedId}` : API_URL;
        const method = isUpdate ? 'PUT' : 'POST';

        const payload = { subjcode, subjdesc, units };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await fetchData();
                document.getElementById('subjmodal').style.display = 'none';
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

    const prepareEdit = (subject) => {
        setSubjcode(subject.subjcode);
        setSubjdesc(subject.subjdesc);
        setUnits(subject.units);
        setSelectedId(subject.subjcode);
        document.getElementById('subjmodal').style.display = 'block';
    };

    const handleDelete = async (code) => {
        if (!window.confirm(`Are you sure you want to delete ${code}?`)) return;

        try {
            const response = await fetch(`${API_URL}/${code}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchData();
                console.log("Deleted successfully");
            } else {
                alert("Failed to delete");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <>
            <div className="w3-container w3-padding">
                <div className='w3-right w3-padding'>
                    <button className='w3-button w3-blue' onClick={() => {
                        clearForm();
                        document.getElementById('subjmodal').style.display = 'block';
                    }}>+ADD SUBJECT</button>
                </div>
                <table className="w3-table-all w3-card-4">
                    <thead>
                        <tr className="w3-blue">
                            <th>SUBJECT CODE</th>
                            <th>DESCRIPTION</th>
                            <th>UNITS</th>
                            <th>CONTROL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((s) => (
                            <tr key={s.subjcode}>
                                <td>{s.subjcode}</td>
                                <td>{s.subjdesc}</td>
                                <td>{s.units}</td>
                                <td>
                                    <button onClick={() => prepareEdit(s)}>&#9998;</button>
                                    <button onClick={() => handleDelete(s.subjcode)}>&times;</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <div className='w3-modal' id='subjmodal'>
                <div className='w3-modal-content w3-animate-top' style={{ width: '40%' }}>
                    <header className='w3-container w3-padding w3-blue'>
                        <b>{selectedId ? 'EDIT SUBJECT' : 'ADD SUBJECT'}</b>
                        <span className='w3-button w3-display-topright' 
                              onClick={() => document.getElementById('subjmodal').style.display = 'none'}>&times;</span>
                    </header>
                    <div className='w3-container w3-padding'>
                        <form onSubmit={handleSubmit}>
                            <p>
                                <label>Subject Code</label>
                                <input 
                                    type='text' 
                                    className={`w3-input w3-border ${selectedId ? 'w3-light-grey' : ''}`}
                                    value={subjcode} 
                                    onChange={(e) => setSubjcode(e.target.value)} 
                                    readOnly={selectedId !== null} 
                                    required
                                />
                            </p>
                            <p>
                                <label>Description</label>
                                <input 
                                    type='text' 
                                    className='w3-input w3-border' 
                                    value={subjdesc} 
                                    onChange={(e) => setSubjdesc(e.target.value)} 
                                    required
                                />
                            </p>
                            <p>
                                <label>Units</label>
                                <input 
                                    type='number' 
                                    className='w3-input w3-border'
                                    value={units} 
                                    onChange={(e) => setUnits(e.target.value)} 
                                    required
                                />
                            </p>
                            <footer className='w3-padding-16 w3-right'>
                                <button type='submit' className='w3-button w3-blue'>SAVE SUBJECT</button>
                            </footer>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SubjectList;