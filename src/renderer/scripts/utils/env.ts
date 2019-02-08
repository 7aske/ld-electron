window.process = process || {};
export const ENV: string | undefined = window.process.type == "renderer" ? "electron" : "web";
export const url: string | null = ENV == "electron" ? null : "http://localhost:3000";
