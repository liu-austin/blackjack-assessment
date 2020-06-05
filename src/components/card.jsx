import React from 'react';

const Card = ({image}) => {
    return (
        <div style={{display: 'inline-block'}}>
            <img src={image}/>
        </div>
    );
}

export default Card;