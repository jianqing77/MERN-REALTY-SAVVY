import React, { useState } from 'react';

function HeartIcon() {
    const [isFilled, setIsFilled] = useState(false);

    const toggleHeart = () => {
        setIsFilled(!isFilled);
    };

    return (
        <i
            className={isFilled ? 'fa fa-heart' : 'fa fa-heart-o'}
            aria-hidden="true"
            onClick={toggleHeart}></i>
    );
}

export default HeartIcon;
