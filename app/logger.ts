import logger from "pino";

export const pino = logger({
	transport: {
		target: "pino-pretty",
	},
});
