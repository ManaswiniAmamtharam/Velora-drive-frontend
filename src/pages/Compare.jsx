import { useEffect, useState } from "react";
import vehicles from "../data/vehicles";

function Compare() {

  const [compare,setCompare]=useState([]);

  useEffect(()=>{

    const ids=JSON.parse(localStorage.getItem("compareVehicles"))||[];

    const selected=vehicles.filter(v=>ids.includes(v.id));

    setCompare(selected);

  },[]);

  if(compare.length===0){
    return(
      <div className="container">
        <h2>No vehicles selected for comparison.</h2>
      </div>
    )
  }

  if(compare.length===1){
    return(
      <div className="container">
        <h2>Select one more vehicle to compare.</h2>
      </div>
    )
  }

  const v1=compare[0];
  const v2=compare[1];

  return(

    <div className="container">

      <h1>Compare Vehicles</h1>

      <table className="compare-table">

        <tbody>

          <tr>
            <th>Image</th>
            <td><img src={v1.image} width="180"/></td>
            <td><img src={v2.image} width="180"/></td>
          </tr>

          <tr>
            <th>Brand</th>
            <td>{v1.brand}</td>
            <td>{v2.brand}</td>
          </tr>

          <tr>
            <th>Model</th>
            <td>{v1.model}</td>
            <td>{v2.model}</td>
          </tr>

          <tr>
            <th>Year</th>
            <td>{v1.year}</td>
            <td>{v2.year}</td>
          </tr>

          <tr>
            <th>Price</th>
            <td>₹ {v1.price.toLocaleString()}</td>
            <td>₹ {v2.price.toLocaleString()}</td>
          </tr>

          <tr>
            <th>Fuel</th>
            <td>{v1.fuel}</td>
            <td>{v2.fuel}</td>
          </tr>

          <tr>
            <th>Transmission</th>
            <td>{v1.transmission}</td>
            <td>{v2.transmission}</td>
          </tr>

          <tr>
            <th>KM Driven</th>
            <td>{v1.kilometers.toLocaleString()}</td>
            <td>{v2.kilometers.toLocaleString()}</td>
          </tr>

        </tbody>

      </table>

    </div>

  );

}

export default Compare;