
import { useState } from "react";
import { apiFetch } from "../services/api";
import "../styles/sellVehicle.css";

const initialForm = {
  type: "",
  brand: "",
  model: "",
  year: "",
  price: "",
  fuel: "",
  transmission: "",
  location: "",
  color: "",
  description: "",
};

function SellVehicle() {
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      // The current backend accepts an image URL/path, not file uploads.
      // This preview works locally; persistent upload needs a separate endpoint.
      setImage(URL.createObjectURL(file));
    }
  };

  const saveDraft = () => {
    localStorage.setItem(
      "vehicleDraft",
      JSON.stringify({ ...form, image })
    );
    alert("Draft Saved");
  };

  const submitListing = async () => {
    if (
      !form.type ||
      !form.brand.trim() ||
      !form.model.trim() ||
      !form.year ||
      !form.price ||
      !form.location.trim()
    ) {
      alert("Please fill in vehicle type, brand, model, year, price and location.");
      return;
    }

    if (Number(form.price) <= 0 || Number(form.year) <= 0) {
      alert("Please enter a valid year and a price greater than zero.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        type: form.type,
        brand: form.brand.trim(),
        model: form.model.trim(),
        year: Number(form.year),
        price: Number(form.price),
        fuel: form.fuel,
        transmission: form.transmission,
        location: form.location.trim(),
        color: form.color.trim(),
        description: form.description.trim(),
        image: "",
      };

      const savedVehicle = await apiFetch("/vehicles", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert(
        `Vehicle listed successfully! Listing ID: ${savedVehicle.id}`
      );

      setForm({ ...initialForm });
      setImage("");
      setPreview(false);
      localStorage.removeItem("vehicleDraft");
    } catch (err) {
      alert(
        err.message ||
          "Unable to submit listing. Please log in and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container sell-page">
      <h1>Sell Your Vehicle</h1>

      <div className="sell-layout">
        <div className="form-card">
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="">Vehicle Type</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Bike">Bike</option>
          </select>

          <input
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
          />

          <input
            name="model"
            placeholder="Model"
            value={form.model}
            onChange={handleChange}
          />

          <input
            type="number"
            name="year"
            placeholder="Manufacturing Year"
            value={form.year}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Expected Price"
            value={form.price}
            onChange={handleChange}
          />

          <select name="fuel" value={form.fuel} onChange={handleChange}>
            <option value="">Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="CNG">CNG</option>
          </select>

          <select
            name="transmission"
            value={form.transmission}
            onChange={handleChange}
          >
            <option value="">Transmission</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>

          <input
            name="location"
            placeholder="City / Location"
            value={form.location}
            onChange={handleChange}
          />

          <input
            name="color"
            placeholder="Color"
            value={form.color}
            onChange={handleChange}
          />

          <textarea
            rows="4"
            name="description"
            placeholder="Vehicle Description"
            value={form.description}
            onChange={handleChange}
          />

          <label className="upload">
            Upload Vehicle Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />
          </label>

          <div className="btn-group">
            <button onClick={saveDraft}>Save Draft</button>

            <button onClick={() => setPreview(!preview)}>
              Preview
            </button>

            <button onClick={submitListing} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        {preview && (
          <div className="preview-card">
            <h2>Listing Preview</h2>

            {image && <img src={image} alt="Vehicle preview" />}

            <h3>{form.brand} {form.model}</h3>
            <p>₹ {Number(form.price || 0).toLocaleString("en-IN")}</p>
            <p>{form.year}</p>
            <p>{form.fuel} • {form.transmission}</p>
            <p>{form.location}</p>
            <p>{form.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellVehicle;
