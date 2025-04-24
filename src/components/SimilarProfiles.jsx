import React, { useEffect, useState } from 'react';
import { getAllUsersAPI } from '../Services/AllAPI';

const SimilarProfiles = () => {
    const [similarProfiles, setSimilarProfiles] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getAllUsersAPI();
                console.log(res.data);
                // Limit to the first 5 profiles
                setSimilarProfiles(res.data.slice(0, 5));
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);



    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Similar profiles</h2>
            <div className="space-y-4">
                {similarProfiles.map((profile, index) => (
                    <div key={index} className="flex items-center">
                        <div className="flex">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white overflow-hidden bg-blue-100">
                                <h1 className="text-2xl font-bold text-white">{profile.username.charAt(0).toUpperCase()}</h1>
                            </div>
                            <div className='flex-1'>
                                <p className="font-medium text-gray-800">{profile.username}</p>
                                <p className="text-gray-500 text-sm">{profile.country}</p>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    See more
                </button>
            </div>
        </div>
    );
};

export default SimilarProfiles;
