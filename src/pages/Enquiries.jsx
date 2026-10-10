
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import "../styles/enquiries.css";

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [activeTab, setActiveTab] = useState("received");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEnquiries = async (tab = activeTab) => {
    try {
      setLoading(true);
      setError("");

      const endpoint =
        tab === "sent" ? "/enquiries/sent" : "/enquiries/received";

      const data = await apiFetch(endpoint);

      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      setEnquiries([]);
      setError(err.message || "Unable to load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries(activeTab);
  }, [activeTab]);

  const changeTab = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    } else {
      loadEnquiries(tab);
    }
  };

  const getMessageDetails = (message = "") => {
    const details = {
      name: "Customer",
      email: "Not provided",
      message,
    };

    const remainingLines = [];

    message.split("\n").forEach((line) => {
      if (line.startsWith("Name: ")) {
        details.name = line.slice(6).trim();
      } else if (line.startsWith("Email: ")) {
        details.email = line.slice(7).trim();
      } else if (line.startsWith("Message: ")) {
        remainingLines.push(line.slice(9));
      } else {
        remainingLines.push(line);
      }
    });

    details.message = remainingLines.join("\n").trim();

    return details;
  };

  return (
    <div className="container enquiries-page">
      <div className="enquiry-header">
        <h1>Customer Enquiries</h1>
      </div>

      <div className="enquiry-tabs">
        <button
          type="button"
          className={activeTab === "received" ? "active" : ""}
          onClick={() => changeTab("received")}
        >
          Received Enquiries
        </button>

        <button
          type="button"
          className={activeTab === "sent" ? "active" : ""}
          onClick={() => changeTab("sent")}
        >
          Sent Enquiries
        </button>
      </div>

      <p className="count">
        {activeTab === "sent" ? "Sent" : "Received"} Enquiries:{" "}
        {enquiries.length}
      </p>

      {loading ? (
        <div className="empty-box">
          <h2>Loading Enquiries...</h2>
        </div>
      ) : error ? (
        <div className="empty-box">
          <h2>Unable to Load Enquiries</h2>
          <p>{error}</p>
          <button type="button" onClick={() => loadEnquiries()}>
            Try Again
          </button>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="empty-box">
          <h2>No Enquiries Yet</h2>
          <p>
            {activeTab === "sent"
              ? "Enquiries you send to vehicle sellers will appear here."
              : "Enquiries received for your vehicle listings will appear here."}
          </p>
        </div>
      ) : (
        enquiries.map((item) => {
          const details = getMessageDetails(item.message || "");

          return (
            <div
              className="enquiry-card"
              key={item.id}
            >
              <div className="top-row">
                <h3>{details.name}</h3>
                <span>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : "Date unavailable"}
                </span>
              </div>

              <p>
                <strong>Vehicle ID:</strong> {item.vehicleId}
              </p>

              <p>
                <strong>Email:</strong> {details.email}
              </p>

              <p>
                <strong>Phone:</strong> {item.phone || "Not provided"}
              </p>

              <p>
                <strong>Message:</strong>
              </p>

              <div className="message-box">
                {details.message || "No message provided."}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Enquiries;
