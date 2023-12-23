// acceptRelearningAPI.spec.js

import { acceptRelearningAPI } from '@/views/Training.vue';

// Mock the fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}), // You can adjust the response data as needed
    })
);

describe('acceptRelearningAPI', () => {
    it('should send a POST request to the correct URL with the authorization header', async () => {
        // Arrange
        const token = 'mockToken';

        // Act
        await acceptRelearningAPI(token);

        // Assert
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/classification/acceptRelearning', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
    });

    it('should return the response from the fetch call', async () => {
        // Arrange
        const token = 'mockToken';

        // Act
        const response = await acceptRelearningAPI(token);

        // Assert
        expect(response.ok).toBe(true);
    });
});
