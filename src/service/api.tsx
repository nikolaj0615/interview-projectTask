export const registerPersonAndGetIBAN = async (name: string): Promise<string> => {
    try {
        const response = await fetch('https://63e3e2d765ae49317719e670.mockapi.io/api/v1/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
            }),
        });

        if (!response.ok) {
            throw new Error('registration in not working');
        }

        const data = await response.json();
        return data.iban;
    } catch (error) {
        console.error('error: error during generation person', error);
        throw error;
    }
};