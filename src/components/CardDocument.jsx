import React from 'react'

const CardDocument = ({ title, url, onClick }) => {
  return (
    <div className="card hover:cursor-pointer" onClick={() => onClick(url)}>
      <h3>{title}</h3>
    </div>
  )
}

export default CardDocument
