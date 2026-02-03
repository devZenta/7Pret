export const success = (data: unknown, message = "Success") => {
	return { success: true, message, data };
};

export const error = (message: string, code = 400) => {
	return { success: false, message, code };
};
