import React, { useState, useEffect } from 'react';

function TeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [teachercode, setTeachercode] = useState('');
    const [rfid, setRfid] = useState('');
    const [lastname, setLastname] = useState('');
    const [firstname, setFirstname] = useState('');
    const [deptid, setDeptid] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/teachers');
            const json = await response.json();
            setTeachers(json);
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
        setTeachercode('');
        setRfid('');
        setLastname('');
        setFirstname('');
        setDeptid('');
        setSelectedId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isUpdate = selectedId !== null;
        const url = isUpdate
            ? `http://localhost:5000/teachers/${selectedId}`
            : 'http://localhost:5000/teachers';

        const method = isUpdate ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teachercode, rfid, lastname, firstname, deptid }),
            });

            if (response.ok) {
                await fetchData();
                document.getElementById('teachermodal').style.display = 'none';
                clearForm();
            } else {
                const errorData = await response.json();
                alert("Error: " + errorData.message);
            }
        } catch (error) {
            console.error("Connection error:", error);
        }
    };

    const prepareEdit = (teacher) => {
        setTeachercode(teacher.teachercode);
        setRfid(teacher.rfid);
        setLastname(teacher.lastname);
        setFirstname(teacher.firstname);
        setDeptid(teacher.deptid);

        setSelectedId(teacher.teachercode);

        document.getElementById('teachermodal').style.display = 'block';
    };

    const handleDelete = async (code) => {
        if (!window.confirm("Are you sure you?")) return;

        try {
            const response = await fetch(`http://localhost:5000/teachers/${code}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchData();
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
                <div className='w3-right w3-padding'>
                    <button
                        className='w3-button w3-blue'
                        onClick={() => {
                            clearForm();
                            document.getElementById('teachermodal').style.display = 'block';
                        }}
                    >
                        +ADD
                    </button>
                </div>

                <table className="w3-table-all">
                    <thead>
                        <tr className="w3-blue">
                            <th>CODE</th>
                            <th>RFID</th>
                            <th>LASTNAME</th>
                            <th>FIRSTNAME</th>
                            <th>DEPT ID</th>
                            <th>CONTROL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((teacher) => (
                            <tr key={teacher.teachercode}>
                                <td>{teacher.teachercode}</td>
                                <td>{teacher.rfid}</td>
                                <td>{teacher.lastname}</td>
                                <td>{teacher.firstname}</td>
                                <td>{teacher.deptid}</td>
                                <td>
                                    {/* EXACT SAME STYLE AS STUDENTLIST */}
                                    <button onClick={() => prepareEdit(teacher)}>&#9998;</button>
                                    <button onClick={() => handleDelete(teacher.teachercode)}>&times;</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className='w3-modal' id='teachermodal'>
                <div className='w3-modal-content w3-animate-top' style={{ width: '50%' }}>
                    <div className='w3-container w3-padding w3-blue'>
                        TEACHER
                        <span
                            className='w3-button w3-display-topright'
                            onClick={() => document.getElementById('teachermodal').style.display = 'none'}
                        >
                            &times;
                        </span>
                    </div>

                    <div className='w3-container w3-padding'>
                        <form onSubmit={handleSubmit}>
                            <p>
                                <label>TEACHER CODE</label>
                                <input
                                    type='text'
                                    className={`w3-input w3-border ${selectedId ? 'w3-light-grey' : ''}`}
                                    value={teachercode}
                                    onChange={(e) => setTeachercode(e.target.value)}
                                    readOnly={selectedId !== null}
                                />
                            </p>

                            <p>
                                <label>RFID</label>
                                <input
                                    type='text'
                                    className='w3-input w3-border'
                                    value={rfid}
                                    onChange={(e) => setRfid(e.target.value)}
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
                                <label>DEPT ID</label>
                                <input
                                    type='text'
                                    className='w3-input w3-border'
                                    value={deptid}
                                    onChange={(e) => setDeptid(e.target.value)}
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

export default TeacherList;