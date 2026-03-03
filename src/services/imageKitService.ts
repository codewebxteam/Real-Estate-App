// import ImageKit from '@imagekit/react'; 
// Temporarily disabled web-only library causing prototype error in RN

/**
 * Mocking ImageKit for React Native environment
 */
export const uploadImage = async (file: any) => {
    console.log('Mock Image Upload:', file.name);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return a high-quality placeholder image
    return {
        url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
        fileId: 'mock-file-id-' + Math.random().toString(36).substr(2, 9),
    };
};

const imagekit = {
    upload: uploadImage
};

export default imagekit;
