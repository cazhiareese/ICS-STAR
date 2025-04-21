function SocialLinksEditModal({ isOpen, onClose, onSaveLinks }) {
    const [facebook, setFacebook] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [github, setGithub] = useState("");
  
    const handleSave = async () => {
      await onSaveLinks({ facebook, linkedin, github });
      onClose(); // Close modal after save
    };
  
    return (
      isOpen && (
        <div className="modal-container">
          {/* Your input fields here */}
          <input value={facebook} onChange={(e) => setFacebook(e.target.value)} />
          <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
          <input value={github} onChange={(e) => setGithub(e.target.value)} />
          <button onClick={handleSave}>Save</button>
        </div>
      )
    );
  }
  