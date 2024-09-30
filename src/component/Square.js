import React from 'react';

const ImageGrid = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Image */}
        <div className="relative w-full h-0 pb-full md:pb-1/2 bg-gray-200">
          <img
            src="https://via.placeholder.com/600x600"
            alt="First Image"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        {/* Second Image */}
        <div className="relative w-full h-0 pb-full md:pb-1/2 bg-gray-200">
          <img
            src="https://via.placeholder.com/600x600"
            alt="Second Image"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageGrid;
