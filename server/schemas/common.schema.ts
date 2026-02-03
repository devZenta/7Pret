import { z } from "@hono/zod-openapi";

export const ErrorResponseSchema = z
	.object({
		success: z.boolean().openapi({ example: false }),
		message: z.string().openapi({ example: "An error occurred" }),
	})
	.openapi("ErrorResponse");

export const SuccessResponseSchema = z
	.object({
		success: z.boolean().openapi({ example: true }),
		message: z.string().openapi({ example: "Operation successful" }),
	})
	.openapi("SuccessResponse");

export const IdParamSchema = z.object({
	id: z.string().openapi({ example: "123", description: "Resource ID" }),
});

export const NumericIdParamSchema = z.object({
	id: z
		.string()
		.regex(/^\d+$/)
		.transform(Number)
		.openapi({ example: "1", description: "Numeric resource ID" }),
});
