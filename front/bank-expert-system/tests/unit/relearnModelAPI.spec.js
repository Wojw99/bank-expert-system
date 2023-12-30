// relearnModelAPI.test.js

import { relearnModelAPI } from '@/views/Training.vue';

// Mock the global fetch function
beforeEach(() => {
    global.fetch = require('jest-fetch-mock');
});

afterEach(() => {
    fetch.resetMocks();
});

test('relearnModelAPI success', async () => {
    // Set up the mock to return a successful response
    fetch.mockResponseOnce(JSON.stringify({ mockResponseData: 'success' }), { status: 200 });

    const token = 'mockToken';
    const parameters = { mockParameters: 'mockValue' };

    const result = await relearnModelAPI(token, parameters);

    // Check if the function returns the expected result
    expect(result).toEqual({ mockResponseData: 'success' });

    // Check if fetch was called with the correct arguments
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/classification/relearn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mockToken',
        },
        body: JSON.stringify({ mockParameters: 'mockValue' }),
    });
});

test('relearnModelAPI error', async () => {
    // Set up the mock to return an error response
    fetch.mockRejectOnce(new Error('Mock Error Message'));

    const token = 'mockToken';
    const parameters = { mockParameters: 'mockValue' };

    // Use try-catch to catch the thrown error
    try {
        await relearnModelAPI(token, parameters);
    } catch (error) {
        // Check if the error message matches the expected value
        expect(error.message).toEqual('Error relearning model. Please try again.');
    }

    // Check if fetch was called with the correct arguments
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/classification/relearn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mockToken',
        },
        body: JSON.stringify({ mockParameters: 'mockValue' }),
    });
});
