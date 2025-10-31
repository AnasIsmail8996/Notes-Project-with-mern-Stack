import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { toast } from "react-toastify";
import axios from "axios";

const Dashboard = () => {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  // 🧠 Fetch all notes of the logged-in user
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return toast.error("User not logged in!");

        const response = await axios.get("http://localhost:5000/api/users/myNotes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotes(response.data.notes || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error(error.response?.data?.message || "Failed to fetch notes!");
      }
    };

    fetchNotes();
  }, []);

  // ✏️ Load only the draft note from localStorage
  useEffect(() => {
    const draftNote = localStorage.getItem("draftNote") || "";
    setNote(draftNote);
  }, []);

  // 💾 Save draft note automatically
  useEffect(() => {
    localStorage.setItem("draftNote", note);
  }, [note]);

  // 🧩 Handle Save Note
  const handleSave = async () => {
    try {
      if (!note.trim()) return toast.error("Write something before saving!");

      const token = localStorage.getItem("token");
      if (!token) return toast.error("User not logged in!");

      const url = "http://localhost:5000/api/users/createPost";

      const response = await axios.post(
        url,
        { note },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newNote = response.data.createPost;
      setNotes((prev) => [newNote, ...prev]); // instantly add new note

      toast.success("Note saved successfully!");
      setNote(""); 
      localStorage.removeItem("draftNote");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save note!");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🧠 Your Notes Dashboard</h2>

      <textarea
        className={styles.textarea}
        placeholder="Write your note here..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button className={styles.button} onClick={handleSave}>
        Save Note
      </button>

      <div className={styles.notesSection}>
        <h3 className={styles.subtitle}>Saved Notes</h3>
        {notes.length === 0 ? (
          <p className={styles.empty}>No notes yet. Start writing!</p>
        ) : (
          <ul className={styles.noteList}>
            {notes.map((n, index) => (
              <li key={n._id || index} className={styles.noteItem}>
                {n.note}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
