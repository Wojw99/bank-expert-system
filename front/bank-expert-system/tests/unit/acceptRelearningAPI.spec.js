// acceptRelearningAPI.spec.js

import { acceptRelearningAPI } from '@/views/Training.vue';

// Mock the fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
    })
);

describe('acceptRelearningAPI', () => {
    it('should send a POST request to the correct URL with the authorization header', async () => {
        const token = 'mockToken';

        await acceptRelearningAPI(token);

    // Check if fetch was called with the correct arguments
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/classification/acceptRelearning', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
    });

    it('should return the response from the fetch call', async () => {
        const token = 'mockToken';

        const response = await acceptRelearningAPI(token);

        expect(response.ok).toBe(true);
    });
});
