import { useState } from "react";
import { useEffect } from "react";

export default function SearchHomes() {
  const [allhomesdata, setHomesData] = useState([]);

  useEffect(() => {
    fetch("/searchhomes")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setHomesData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (

    <>
        
    
    </>


  );
}
