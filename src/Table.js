import React, { useState, useEffect } from 'react';

export default function JsonView() {
    const [jsonData, setJsonData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const populateData = () => {
        setIsLoading(true);
        fetch('http://127.0.0.1:8000')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && Array.isArray(data["DataType List"])) {
                    setJsonData(data["DataType List"]);
                } else {
                    console.error('Fetched data is not in the expected format:', data);
                    setError('Data is not available');
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(error.message);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        populateData();
    }, []);

    return (
        <div>
            <h2>JSON Data</h2>
            <button onClick={populateData} disabled={isLoading}>
                {isLoading ? 'Fetching Data...' : 'Fetch Data'}
            </button>
            {error && <div>Error: {error}</div>}
            {!isLoading && !error && (
                <ul>
                    {jsonData.map((item, index) => (
                        <li key={index}>
                            <strong>Name:</strong> {item.name}, <strong>Birthdate:</strong> {item.birthdate}, <strong>Score:</strong> {item.score}, <strong>Grade:</strong> {item.grade}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
