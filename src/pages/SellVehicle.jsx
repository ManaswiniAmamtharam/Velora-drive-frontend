import { useState } from "react";
import "../styles/sellVehicle.css";

function SellVehicle() {

  const [form, setForm] = useState({
    type: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    fuel: "",
    transmission: "",
    location: "",
    color: "",
    description: ""
  });

  const [image, setImage] = useState("");

  const [preview, setPreview] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if(file){
      setImage(URL.createObjectURL(file));
    }
  };

  const saveDraft = () => {
    localStorage.setItem("vehicleDraft", JSON.stringify({...form,image}));
    alert("Draft Saved");
  };

  const submitListing = () => {

    if(
      !form.brand ||
      !form.model ||
      !form.price ||
      !form.location
    ){
      alert("Please fill required fields");
      return;
    }

    const listings =
      JSON.parse(localStorage.getItem("sellerListings")) || [];

    const newVehicle = {
      id: Date.now(),
      ...form,
      image
    };

    listings.push(newVehicle);

    localStorage.setItem("sellerListings", JSON.stringify(listings));

    alert("Vehicle Listed Successfully!");

    setForm({
      type:"",
      brand:"",
      model:"",
      year:"",
      price:"",
      fuel:"",
      transmission:"",
      location:"",
      color:"",
      description:""
    });

    setImage("");
    setPreview(false);
  };

  return (
    <div className="container sell-page">

      <h1>Sell Your Vehicle</h1>

      <div className="sell-layout">

        <div className="form-card">

          <select name="type" value={form.type} onChange={handleChange}>
            <option value="">Vehicle Type</option>
            <option>SUV</option>
            <option>Sedan</option>
            <option>Hatchback</option>
            <option>Bike</option>
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
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Electric</option>
            <option>CNG</option>
          </select>

          <select
            name="transmission"
            value={form.transmission}
            onChange={handleChange}
          >
            <option value="">Transmission</option>
            <option>Manual</option>
            <option>Automatic</option>
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
            <input type="file" accept="image/*" onChange={handleImage}/>
          </label>

          <div className="btn-group">
            <button onClick={saveDraft}>Save Draft</button>

            <button onClick={()=>setPreview(!preview)}>
              Preview
            </button>

            <button onClick={submitListing}>
              Submit
            </button>
          </div>

        </div>

        {preview && (
          <div className="preview-card">

            <h2>Listing Preview</h2>

            {image && (
              <img src={image} alt="preview"/>
            )}

            <h3>{form.brand} {form.model}</h3>

            <p>₹ {Number(form.price).toLocaleString()}</p>

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