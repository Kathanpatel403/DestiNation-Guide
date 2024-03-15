import React from 'react'

export default function ab() {
  return (
    <div >
            <div>
                {reviewsData.map((review, index) => (
                    <div key={index}
                        style={{
                            backgroundColor: "#e3e3e3",
                            borderRadius: '15px',
                            padding: '15px',
                            marginBottom: '15px',
                            shadowColor: '#fff',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8,
                            borderWidth: 1,
                            borderColor: "#ccc",
                            marginLeft: '15px',
                            marginRight: '15px'
                        }}>
                        <div style={{ fontSize: '15px', fontWeight: "bold", marginBottom: '15px' }}>Name: {review.name}</div>
                        <div style={{ fontSize: '15px', marginBottom: '15px' }}>Email: {review.email}</div>
                        <div style={{ fontSize: '15px', marginBottom: '15px' }}>Review: {review.review}</div>
                        <div style={{ flexDirection: "row" }}>
                            <div style={{ fontSize: '15px', marginBottom: '15px' }}>Rating: ({review.rating})</div>
                            <div style={{ fontSize: '15px' }}>  {generateStars(review.rating)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
  )
}
