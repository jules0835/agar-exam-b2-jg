"use client"

import React from "react"

export default function LoadingPage() {
  return (
    <div className="loading-page">
      <div className="loading-container">
        <h1 className="loading-text">AGAR Game</h1>
        <p className="loading-text-p">Loading game informations...</p>
        <div className="circles">
          <div className="circle small"></div>
          <div className="circle medium"></div>
          <div className="circle large"></div>
        </div>
      </div>
    </div>
  )
}
