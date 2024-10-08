import React, { useEffect, useState } from 'react';
import '../styles/profile.css';
import { getUserProfile } from '../services/api';
import FormUpdateUser from './FormUpdateUser';
import { toast } from 'react-toastify';


const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);


    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUserProfile();
            if (!response.error) {
                setUser(response);
            }
        }
        fetchUser();
    }, [])

    const handleEditClick = () => {
        setIsEditing(true);
    }

    const handleEditSuccess = (updateUser) => {
        setIsEditing(false);
        toast.success("פרופיל עודכן בהצלחה")
        setUser(updateUser);
    }

    if (!user) {
        return <div>Loding...</div>
    }


    return (
        <div className="profile-container">
            {isEditing ? (
                <FormUpdateUser user={user} isManager={false} onClose={() => setIsEditing(false)} onSuccess={handleEditSuccess}/>
            ) : (
                <>
                    <div className="profile-image-container">
                        <img src={user.image} alt="Profile" className="profile-image" />
                        <button onClick={handleEditClick} className="edit-button">
                            Edit Profile
                        </button>
                    </div>
                    <div className="profile-details">
                        <div className="profile-text">
                            <p className="profile-name">{user.firstname} {user.lastname}</p>
                            <p className="profile-position">{user.job}</p>
                            <p className="profile-email">{user.email}</p>
                            <p className="profile-phone">{user.phone}</p>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
};

export default Profile;



/* הפעלה של כרטיס הפרופיל
    כדאי לשנות את קבלת הנתונים
    useEffect באמצעות
    
    <Profile
        user={{
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            position: 'Software Engineer',
            phone: '123-456-7890',
            image: 'https://cdn-icons-png.flaticon.com/512/2919/2919906.png'
        }}
        onEdit={() => console.log('Edit profile clicked')}
    /> 
*/