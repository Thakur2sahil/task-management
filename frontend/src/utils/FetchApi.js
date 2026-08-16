export const FetchAPI = async (url, options = {}) => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(url, {
            method: options.method || "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token && {
                    Authorization: `${token}`,
                }),
                ...options.headers,
            },
            body: options.body
                ? JSON.stringify(options.body)
                : undefined,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};