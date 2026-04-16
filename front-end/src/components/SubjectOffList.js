import React, { useState, useEffect } from 'react';

function SubjectOfferedList() {
    const [suboff, setSubOff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    // Form States matching your back-end fields
    const [edpcode, setEdpcode] = useState('');
    const [subjid, setSubjid] = useState('');
    const [start_time, setStartTime] = useState('');
    const [end_time, setEndTime] = useState('');
    const [days, setDays] = useState('');
    const [room, setRoom] = useState('');
    const [teacherid, setTeacherid] = useState('');

    const API_URL = 'http://localhost:5000/subjectoffered';

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            const json = await response.json();
            setSubOff(json);
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
        setEdpcode('');
        setSubjid('');
        setStartTime('');
        setEndTime('');
        setDays('');
        setRoom('');
        setTeacherid('');
        setSelectedId(null);
    };

    const filteredSubOff = suboff.filter((s) => 
        s.edpcode.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.subject_name || s.subjid).toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isUpdate = selectedId !== null;
        

        const url = isUpdate ? `${API_URL}/${selectedId}` : API_URL;
        const method = isUpdate ? 'PUT' : 'POST';

        const payload = { edpcode, subjid, start_time, end_time, days, room, teacherid };

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
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.message || "Failed to save"));
            }
        } catch (error) {
            console.error("Connection error:", error);
        }
    };

    const prepareEdit = (item) => {
        setEdpcode(item.edpcode);
        setSubjid(item.subjid);
        setStartTime(item.start_time);
        setEndTime(item.end_time);
        setDays(item.days);
        setRoom(item.room);
        setTeacherid(item.teacherid);
        setSelectedId(item.edpcode);
        document.getElementById('subjmodal').style.display = 'block';
    };

    const handleDelete = async (code) => {
        if (!window.confirm(`Delete EDP Code: ${code}?`)) return;
        try {
            const response = await fetch(`${API_URL}/${code}`, { method: 'DELETE' });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <div className="w3-container w3-padding">

            {/*Search Bar */}
            <div className="w3-left w3-padding" style={{ width: '300px' }}>
                <input 
                    type="text" 
                    className="w3-input w3-border" 
                    placeholder="Search EDP Code or Subject..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className='w3-right w3-padding'>
                
                <button className='w3-button w3-blue' onClick={() => { clearForm(); document.getElementById('subjmodal').style.display='block'; }}>
                    + ADD SUBJECT
                </button>
            </div>

            <table className="w3-table-all w3-card-4">
                <thead>
                    <tr className="w3-blue">
                        <th>EDP CODE</th>
                        <th>SUBJECT</th>
                        <th>SCHEDULE</th>
                        <th>ROOM</th>
                        <th>INSTRUCTOR</th>
                        <th>CONTROL</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSubOff.map((s) => (
                        <tr key={s.edpcode}>
                            <td>{s.edpcode}</td>
                            <td>{s.subject_name || s.subjid}</td>
                            <td>{`${s.days} ${s.start_time}-${s.end_time}`}</td>
                            <td>{s.room}</td>
                            <td>{s.teacher_name || s.teacherid}</td>
                            <td>
                                <button onClick={() => prepareEdit(s)}>&#9998;</button>
                                <button onClick={() => handleDelete(s.edpcode)}>&times;</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            <div id="subjmodal" className="w3-modal">
                <div className="w3-modal-content w3-card-4 w3-animate-zoom" style={{ maxWidth: '600px' }}>
                    <header className="w3-container w3-teal">
                        <h3>{selectedId ? 'Update Offering' : 'New Subject Offering'}</h3>
                    </header>
                    <form className="w3-container w3-padding" onSubmit={handleSubmit}>
                        <div className="w3-row-section">
                            <label>EDP Code</label>
                            <input className="w3-input w3-border" type="text" value={edpcode} onChange={e => setEdpcode(e.target.value)} disabled={selectedId !== null} required />
                        </div>
                        <div className="w3-row">
                            <div className="w3-half w3-container" style={{paddingLeft:0}}>
                                <label>Subject ID</label>
                                <input className="w3-input w3-border" type="text" value={subjid} onChange={e => setSubjid(e.target.value)} required />
                            </div>
                            <div className="w3-half w3-container" style={{paddingRight:0}}>
                                <label>Teacher ID</label>
                                <input className="w3-input w3-border" type="text" value={teacherid} onChange={e => setTeacherid(e.target.value)} required />
                            </div>
                        </div>
                        <div className="w3-row">
                            <div className="w3-third w3-container" style={{paddingLeft:0}}>
                                <label>Start Time</label>
                                <input className="w3-input w3-border" type="time" value={start_time} onChange={e => setStartTime(e.target.value)} required />
                            </div>
                            <div className="w3-third w3-container">
                                <label>End Time</label>
                                <input className="w3-input w3-border" type="time" value={end_time} onChange={e => setEndTime(e.target.value)} required />
                            </div>
                            <div className="w3-third w3-container" style={{paddingRight:0}}>
                                <label>Days</label>
                                <input className="w3-input w3-border" type="text" placeholder="MWF" value={days} onChange={e => setDays(e.target.value)} required />
                            </div>
                        </div>
                        <label>Room</label>
                        <input className="w3-input w3-border" type="text" value={room} onChange={e => setRoom(e.target.value)} required />
                        
                        <div className="w3-padding-16 w3-right">
                            <button type="button" className="w3-button w3-border" onClick={() => document.getElementById('subjmodal').style.display='none'}>Cancel</button>
                            <button type="submit" className="w3-button w3-teal w3-margin-left">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SubjectOfferedList;