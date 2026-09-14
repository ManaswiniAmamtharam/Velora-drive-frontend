import { useEffect, useState } from "react";
import "../styles/enquiries.css";

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("enquiries")) || [];

    setEnquiries(saved);
  }, []);

  const deleteEnquiry = (index) => {
    const updated = enquiries.filter((_, i) => i !== index);

    setEnquiries(updated);

    localStorage.setItem(
      "enquiries",
      JSON.stringify(updated)
    );

    alert("Enquiry Deleted");
  };

  const clearAll = () => {
    if (window.confirm("Delete all enquiries?")) {
      localStorage.removeItem("enquiries");
      setEnquiries([]);
    }
  };

  return (
    <div className="container enquiries-page">
      <div className="enquiry-header">
        <h1>Customer Enquiries</h1>

        {enquiries.length > 0 && (
          <button
            className="clear-btn"
            onClick={clearAll}
          >
            Clear All
          </button>
        )}
      </div>

      <p className="count">
        Total Enquiries: {enquiries.length}
      </p>

      {enquiries.length === 0 ? (
        <div className="empty-box">
          <h2>No Enquiries Yet</h2>
          <p>
            Messages sent from the Contact Seller form
            will appear here.
          </p>
        </div>
      ) : (
        enquiries.map((item, index) => (
          <div className="enquiry-card" key={index}>
            <div className="top-row">
              <h3>{item.name}</h3>
              <span>{item.date}</span>
            </div>

            <p>
              <strong>Vehicle:</strong> {item.vehicle}
            </p>

            <p>
              <strong>Email:</strong> {item.email}
            </p>

            <p>
              <strong>Phone:</strong> {item.phone}
            </p>

            <p>
              <strong>Message:</strong>
            </p>

            <div className="message-box">
              {item.message}
            </div>

            <button
              className="delete-btn"
              onClick={() => deleteEnquiry(index)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Enquiries;