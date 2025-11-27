"use client";
import Navbar from "@/Components/Navbar";
import { AuthContext } from "@/providers/AuthProvider";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const Profile = () => {
  const { user, updateUser, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
 

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const name = form.name.value;
    const photoURL = form.photo.value;

    try {
      await updateUser({ displayName: name, photoURL });
      setUser({ ...user, displayName: name, photoURL });

      Swal.fire({
        title: "Profile Updated!",
        text: "Your information has been successfully updated.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      setShowForm(false);
    } catch (err) {
      Swal.fire({
        title: "Update Failed",
        text: "Something went wrong while updating your profile.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="max-w-lg mx-auto px-4 py-12 ">

      <h2 className="text-3xl font-semibold text-center mb-6">My Profile</h2>

      <div className="flex flex-col items-center mb-8">
        <img
          src={user?.photoURL || "https://i.ibb.co/VqvjV4H/default-avatar.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-blue-600 shadow-md object-cover mb-3"
        />
        <h3 className="text-xl font-semibold">{user?.displayName || "User"}</h3>
        <p className="text-gray-600">{user?.email}</p>
      </div>

      {!showForm ? (
        <div className="text-center">
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            Update Profile
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleUpdate}
          className="bg-white p-6 rounded-2xl shadow-lg space-y-4"
        >
          <input
            name="name"
            defaultValue={user?.displayName}
            type="text"
            placeholder="Your Name"
            className="w-full border px-4 py-2 rounded "
          />
          <input
            name="photo"
            defaultValue={user?.photoURL}
            type="url"
            placeholder="Photo URL"
            className="w-full border px-4 py-2 rounded"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn border border-primary   flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
