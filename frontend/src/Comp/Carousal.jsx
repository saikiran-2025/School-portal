import React, { useEffect, useState } from 'react'
import "./Carousal.css"
let arr=[
    "https://content.jdmagicbox.com/comp/vijayawada/r3/0866px866.x866.000648731609.g6r3/catalogue/netaji-high-school-bhavanipuram-vijayawada-schools-2mv6msh.jpg",
    "https://images.pexels.com/photos/18012459/pexels-photo-18012459.jpeg",
    "https://images.pexels.com/photos/10646428/pexels-photo-10646428.jpeg",
    "https://images.pexels.com/photos/35745620/pexels-photo-35745620.jpeg",
    "https://images.pexels.com/photos/8467278/pexels-photo-8467278.jpeg",
    "https://media.istockphoto.com/id/2246518771/photo/science-teacher-explains-human-anatomy-model-to-curious-students.jpg?s=2048x2048&w=is&k=20&c=oFZQUKFICnqAbrbqlp4LRQBo-S5bUxm0kdjB7bUNXHs="
]
const Carousal = () => {
    let [i,setI]=useState(0);

    useEffect(()=>{
        let interval=setInterval(()=>{
            setI((prev)=>(prev+1) % arr.length);
        },2000)
        return () => clearInterval(interval);
    },[]);

    let fwd=()=>{
        setI((i+1) % arr.length);
    };

    let bkw=()=>{
        if (i == 0) {
            setI(arr.length - 1);
        } else {
            setI(i-1);
        }
    };
  return (
    <div className="bnr">
      <img src={arr[i]} alt="service" />
      <i className="fa-solid fa-less-than" onClick={bkw}></i>
      <i className="fa-solid fa-greater-than" onClick={fwd}></i>
      <div className="circles">
        {arr.map((img, ind) => (
          <i
            key={ind}
            className={
              i === ind ? "fa-solid fa-circle" : "fa-regular fa-circle"
            }
            onClick={() => setI(ind)}
          ></i>
        ))}
      </div>
    </div>
  )
}

export default Carousal