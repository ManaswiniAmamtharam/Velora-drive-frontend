import { Link } from "react-router-dom";

function Breadcrumb({page}){

  return(
    <div className="breadcrumb">

      <Link to="/">Home</Link>

      {" / "}

      <span>{page}</span>

    </div>
  )

}

export default Breadcrumb;