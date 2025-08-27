import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import styles from "./Profile.module.css";
import { Dashboard } from "../Dashboard/dashboard";
import { updateProfile, updatePassword } from "../redux/authSlice";


const Profile: React.FC = () => {
    const dispatch = useDispatch<any>();
    const { user } = useSelector((state: RootState) => state.auth);

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const saveProfileChanges = () => {
        if (!user?.id) return alert("User not logged in");
        if (!name || !email || !phone) return alert("All fields are required.");
      
        dispatch(updateProfile({ id: user.id, name, email, phone }))
          .unwrap()
          .then(() => {
            alert("Profile updated successfully!");
            setIsEditingProfile(false);
          })
          .catch(() => alert("Failed to update profile"));
      };
      
      const changePassword = () => {
        if (!user?.id) return alert("User not logged in");
        if (newPassword !== confirmNewPassword) return alert("New passwords do not match.");
        if (!currentPassword || !newPassword) return alert("Please fill in current and new password fields.");
      
        dispatch(updatePassword({ id: user.id, currentPassword, newPassword }))
          .unwrap()
          .then(() => {
            alert("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setShowPasswordModal(false);
          })
          .catch(() => alert("Failed to change password"));
      };
      

    return (
        <div className={styles.Add}>
            <Dashboard />

            <div className={styles.top}>
                <p>User Profile</p>
            </div>
            
            <div className={styles.container}>
                <h2>Edit Personal Details</h2>
                
                <div className={styles.profileInfo}>
                    <label>
                        <strong>Name:</strong>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditingProfile}
                            className={isEditingProfile ? styles.editableInput : styles.disabledInput}
                        />
                    </label>
                    
                    <label>
                        <strong>Email:</strong>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditingProfile}
                            className={isEditingProfile ? styles.editableInput : styles.disabledInput}
                        />
                    </label>
                    
                    <label>
                        <strong>Phone:</strong>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={!isEditingProfile}
                            className={isEditingProfile ? styles.editableInput : styles.disabledInput}
                        />
                    </label>

                    {!isEditingProfile ? (
                        <div className={styles.profileActions}>
                            <button onClick={() => setIsEditingProfile(true)}>Edit Details</button>
                            <button onClick={() => setShowPasswordModal(true)}>Change Password</button>
                        </div>
                    ) : (
                        <div className={styles.profileActions}>
                            <button onClick={saveProfileChanges}>Save Changes</button>
                            <button onClick={() => {
                                setName(user?.name || "");
                                setEmail(user?.email || "");
                                setPhone(user?.phone || "");
                                setIsEditingProfile(false);
                            }}>Cancel</button>
                        </div>
                    )}
                </div>
            </div>
            
            {showPasswordModal && (
                <div className={styles.modal}>
                    <div className={styles.popicon}>
                        <button onClick={() => setShowPasswordModal(false)}>X</button>
                    </div>
                    <h3>Change Password</h3>
                    <div className={styles.values}>
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <button onClick={changePassword}>Update Password</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;